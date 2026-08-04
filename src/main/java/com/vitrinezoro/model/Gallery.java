package com.vitrinezoro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "galleries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 4096)
    private String description;

    @Column(length = 1024)
    private String imageUrl;

    private String city;

    private String address;

    private boolean partner;
}
