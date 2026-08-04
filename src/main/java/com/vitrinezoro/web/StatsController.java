package com.vitrinezoro.web;

import com.vitrinezoro.dto.Dtos.MonthlyPoint;
import com.vitrinezoro.dto.Dtos.PopularArtwork;
import com.vitrinezoro.dto.Dtos.StatsDto;
import com.vitrinezoro.model.Artwork;
import com.vitrinezoro.model.Reservation;
import com.vitrinezoro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final ArtistRepository artists;
    private final ArtworkRepository artworks;
    private final ExhibitionRepository exhibitions;
    private final ReservationRepository reservations;

    @GetMapping
    public StatsDto stats() {
        List<Artwork> allArtworks = artworks.findAll();
        List<Reservation> allReservations = reservations.findAll();

        long totalViews = allArtworks.stream().mapToLong(Artwork::getViews).sum();
        long totalVisitors = allReservations.stream().mapToLong(Reservation::getVisitors).sum();

        List<PopularArtwork> popular = allArtworks.stream()
            .sorted(Comparator.comparingLong(Artwork::getViews).reversed())
            .limit(6)
            .map(a -> new PopularArtwork(a.getTitle(), a.getViews()))
            .toList();

        return new StatsDto(
            artists.count(),
            allArtworks.size(),
            exhibitions.count(),
            totalVisitors + totalViews,
            allReservations.size(),
            monthlySeries(allReservations, true),
            monthlySeries(allReservations, false),
            popular);
    }

    /** Aggregates the last 6 months of reservations (visitors or bookings). */
    private List<MonthlyPoint> monthlySeries(List<Reservation> all, boolean sumVisitors) {
        LocalDate now = LocalDate.now();
        return java.util.stream.IntStream.rangeClosed(-5, 0)
            .mapToObj(offset -> {
                LocalDate month = now.plusMonths(offset);
                long value = all.stream()
                    .filter(r -> r.getVisitDate() != null
                        && r.getVisitDate().getYear() == month.getYear()
                        && r.getVisitDate().getMonth() == month.getMonth())
                    .mapToLong(r -> sumVisitors ? r.getVisitors() : 1)
                    .sum();
                String label = month.getMonth().getDisplayName(TextStyle.SHORT, Locale.FRENCH);
                return new MonthlyPoint(label, value);
            })
            .toList();
    }
}
