package com.vitrinezoro.web;

import com.vitrinezoro.dto.Dtos.ReservationDto;
import com.vitrinezoro.dto.Dtos.ReservationRequest;
import com.vitrinezoro.model.Reservation;
import com.vitrinezoro.repository.ExhibitionRepository;
import com.vitrinezoro.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservations;
    private final ExhibitionRepository exhibitions;

    @GetMapping
    public List<ReservationDto> list() {
        return reservations.findAll().stream().map(ReservationDto::from).toList();
    }

    @GetMapping("/{id}")
    public ReservationDto get(@PathVariable Long id) {
        return reservations.findById(id).map(ReservationDto::from)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationDto create(@RequestBody ReservationRequest body) {
        Reservation reservation = Reservation.builder()
            .exhibition(exhibitions.findById(body.exhibitionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Exposition inconnue")))
            .visitDate(body.visitDate())
            .timeSlot(body.timeSlot())
            .visitors(body.visitors())
            .fullName(body.fullName())
            .email(body.email())
            .status(Reservation.Status.CONFIRMED)
            .code("ZZ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
            .build();
        return ReservationDto.from(reservations.save(reservation));
    }

    @PutMapping("/{id}")
    public ReservationDto update(@PathVariable Long id, @RequestBody ReservationRequest body) {
        Reservation reservation = reservations.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.visitDate() != null) reservation.setVisitDate(body.visitDate());
        if (body.timeSlot() != null) reservation.setTimeSlot(body.timeSlot());
        if (body.visitors() > 0) reservation.setVisitors(body.visitors());
        if (body.fullName() != null) reservation.setFullName(body.fullName());
        if (body.email() != null) reservation.setEmail(body.email());
        if (body.status() != null) reservation.setStatus(body.status());
        return ReservationDto.from(reservations.save(reservation));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        reservations.deleteById(id);
    }
}
