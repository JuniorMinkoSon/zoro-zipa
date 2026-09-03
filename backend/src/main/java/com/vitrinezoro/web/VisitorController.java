package com.vitrinezoro.web;

import com.vitrinezoro.dto.Dtos.VisitorDto;
import com.vitrinezoro.dto.Dtos.VisitorRequest;
import com.vitrinezoro.dto.Dtos.VisitorSessionDto;
import com.vitrinezoro.model.Visitor;
import com.vitrinezoro.repository.VisitorRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Entry screen of the showcase site: a visitor gives their name and phone number,
 * the record is stored here and the browser receives only an opaque session cookie.
 * On later visits that cookie is enough to recognise them, so the screen is skipped.
 */
@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
public class VisitorController {

    private final VisitorRepository visitors;

    @Value("${app.visitor.cookie.name:zoro_session}")
    private String cookieName;

    @Value("${app.visitor.cookie.max-age-days:180}")
    private long cookieMaxAgeDays;

    /** Must be true in production; SameSite=None additionally forces it (browser requirement). */
    @Value("${app.visitor.cookie.secure:false}")
    private boolean cookieSecure;

    /** "Lax" when the site and the API share a domain, "None" when they don't (e.g. Vercel + API host). */
    @Value("${app.visitor.cookie.same-site:Lax}")
    private String cookieSameSite;

    /** Header carrying the session token when the cookie cannot be used. */
    private static final String SESSION_HEADER = "X-Visitor-Session";

    /** Registers the visitor and opens their session. */
    @PostMapping
    public ResponseEntity<VisitorSessionDto> register(@RequestBody VisitorRequest body) {
        String firstName = required(body.firstName(), "Le prénom est obligatoire");
        String lastName = required(body.lastName(), "Le nom est obligatoire");
        String phone = normalisePhone(body.phone());

        // A returning visitor whose cookie was lost (new device, cleared browser) is
        // matched back on their phone number instead of creating a duplicate row.
        Visitor visitor = visitors.findByPhone(phone).orElseGet(() -> Visitor.builder()
            .phone(phone)
            .createdAt(Instant.now())
            .visits(0)
            .build());

        visitor.setFirstName(firstName);
        visitor.setLastName(lastName);
        visitor.setLastSeenAt(Instant.now());
        visitor.setVisits(visitor.getVisits() + 1);
        // A fresh identifier on every registration, so a leaked one cannot be replayed.
        visitor.setSessionId(UUID.randomUUID().toString().replace("-", ""));

        Visitor saved = visitors.save(visitor);

        return ResponseEntity.status(HttpStatus.CREATED)
            .header(HttpHeaders.SET_COOKIE,
                sessionCookie(saved.getSessionId(), Duration.ofDays(cookieMaxAgeDays)).toString())
            .body(new VisitorSessionDto(saved.getSessionId(), VisitorDto.from(saved)));
    }

    /** Who is behind the current session cookie — 204 when there is no valid session. */
    @GetMapping("/me")
    public ResponseEntity<VisitorDto> me(HttpServletRequest request) {
        Optional<Visitor> visitor = readSessionId(request).flatMap(visitors::findBySessionId);

        if (visitor.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        Visitor known = visitor.get();
        known.setLastSeenAt(Instant.now());
        return ResponseEntity.ok(VisitorDto.from(visitors.save(known)));
    }

    /** Closes the session and clears the cookie (the visitor record is kept). */
    @DeleteMapping("/me")
    public ResponseEntity<Void> forget() {
        return ResponseEntity.noContent()
            .header(HttpHeaders.SET_COOKIE, sessionCookie("", Duration.ZERO).toString())
            .build();
    }

    /** Admin-only: the collected visitors, most recently seen first. */
    @GetMapping
    public List<VisitorDto> list() {
        return visitors.findAll().stream()
            .sorted(Comparator.comparing(Visitor::getLastSeenAt,
                Comparator.nullsLast(Comparator.reverseOrder())))
            .map(VisitorDto::from)
            .toList();
    }

    /**
     * Spring's default /error body drops the exception reason here (verified: the
     * 400 arrives as timestamp/status/error/path only, despite
     * server.error.include-message=always), so the entry screen would have nothing
     * to show. This renders the reason for this controller's routes.
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleFailure(ResponseStatusException ex) {
        String message = ex.getReason() != null ? ex.getReason() : "Requête invalide";
        return ResponseEntity.status(ex.getStatusCode())
            .body(Map.of("status", ex.getStatusCode().value(), "message", message));
    }

    private ResponseCookie sessionCookie(String value, Duration maxAge) {
        // Browsers reject SameSite=None unless the cookie is also Secure.
        boolean secure = cookieSecure || "None".equalsIgnoreCase(cookieSameSite);
        return ResponseCookie.from(cookieName, value)
            .httpOnly(true)
            .secure(secure)
            .sameSite(cookieSameSite)
            .path("/")
            .maxAge(maxAge)
            .build();
    }

    /**
     * The session token, taken from the header first and from the cookie otherwise.
     * Safari and other browsers that block third-party cookies drop the cookie when
     * the site and the API are on different domains, so the header is what keeps a
     * returning visitor recognised there.
     */
    private Optional<String> readSessionId(HttpServletRequest request) {
        String header = request.getHeader(SESSION_HEADER);
        if (header != null && !header.isBlank()) {
            return Optional.of(header.trim());
        }

        Cookie[] cookies = request.getCookies();
        if (cookies == null) return Optional.empty();
        return Arrays.stream(cookies)
            .filter(c -> cookieName.equals(c.getName()))
            .map(Cookie::getValue)
            .filter(v -> v != null && !v.isBlank())
            .findFirst();
    }

    private static String required(String value, String message) {
        String trimmed = value == null ? "" : value.trim();
        if (trimmed.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return trimmed;
    }

    /** Keeps digits and a leading "+", so the same number always matches the same row. */
    private static String normalisePhone(String raw) {
        String value = raw == null ? "" : raw.trim();
        boolean international = value.startsWith("+");
        String digits = value.replaceAll("\\D", "");

        if (digits.length() < 8 || digits.length() > 15) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Numéro de téléphone invalide");
        }
        return international ? "+" + digits : digits;
    }
}
