package com.vitrinezoro.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exhibitions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exhibition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 4096)
    private String description;

    @Column(length = 1024)
    private String posterUrl;

    private LocalDate startDate;

    private LocalDate endDate;

    private String location;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gallery_id")
    private Gallery gallery;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "exhibition_artists",
        joinColumns = @JoinColumn(name = "exhibition_id"),
        inverseJoinColumns = @JoinColumn(name = "artist_id"))
    @Builder.Default
    private List<Artist> artists = new ArrayList<>();

    /** An exhibition is "current" when today falls within its date range. */
    public boolean isCurrent() {
        LocalDate today = LocalDate.now();
        return !today.isBefore(startDate) && !today.isAfter(endDate);
    }
}
