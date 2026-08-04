package com.vitrinezoro.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    public enum Status { CONFIRMED, PENDING, CANCELLED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exhibition_id")
    private Exhibition exhibition;

    private LocalDate visitDate;

    private String timeSlot;

    private int visitors;

    private String fullName;

    private String email;

    @Enumerated(EnumType.STRING)
    private Status status;

    /** Ticket code encoded in the visitor's QR code. */
    @Column(unique = true)
    private String code;
}
