package com.vitrinezoro.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "artworks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Artwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 4096)
    private String description;

    @Column(length = 1024)
    private String imageUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "artwork_images", joinColumns = @JoinColumn(name = "artwork_id"))
    @Column(name = "url", length = 1024)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "artist_id")
    private Artist artist;

    private String category;

    private String technique;

    private String dimensions;

    /** "year" is a reserved word in H2, so the column needs an explicit name. */
    @Column(name = "year_created")
    private int year;

    private boolean trending;

    private long views;
}
