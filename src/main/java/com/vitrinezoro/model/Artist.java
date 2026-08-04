package com.vitrinezoro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "artists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Artist {

    public enum Status { PENDING, VALIDATED, SUSPENDED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 1024)
    private String portraitUrl;

    @Column(length = 4096)
    private String bio;

    @Column(length = 8192)
    private String journey;

    private String style;

    private String nationality;

    @Enumerated(EnumType.STRING)
    private Status status;
}
