package com.vitrinezoro.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * A visitor who identified themselves on the entry screen (name + phone) before
 * reaching the showcase site. Personal data stays here, server-side: the browser
 * only ever holds the opaque {@code sessionId} in an HttpOnly cookie.
 */
@Entity
@Table(name = "visitors", indexes = {
    @Index(name = "idx_visitors_session_id", columnList = "session_id"),
    @Index(name = "idx_visitors_phone", columnList = "phone")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    /** Digits only, as normalised on the way in. Doubles as the identity key across sessions. */
    private String phone;

    /** Opaque session identifier handed to the browser — never contains personal data. */
    @Column(name = "session_id", unique = true, nullable = false, length = 64)
    private String sessionId;

    private Instant createdAt;

    private Instant lastSeenAt;

    /** How many times this visitor came back through the entry screen. */
    private long visits;
}
