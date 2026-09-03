package com.vitrinezoro.dto;

import com.vitrinezoro.model.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/** JSON shapes exchanged with the React frontend. */
public final class Dtos {

    private Dtos() {}

    public record ArtistDto(
        Long id, String name, String portraitUrl, String bio, String journey,
        String style, String nationality, Artist.Status status) {

        public static ArtistDto from(Artist a) {
            return new ArtistDto(a.getId(), a.getName(), a.getPortraitUrl(), a.getBio(),
                a.getJourney(), a.getStyle(), a.getNationality(), a.getStatus());
        }
    }

    public record ArtworkDto(
        Long id, String title, String description, String imageUrl, List<String> images,
        Long artistId, String artistName, String category, String technique,
        String dimensions, int year, boolean trending, long views) {

        public static ArtworkDto from(Artwork a) {
            return new ArtworkDto(a.getId(), a.getTitle(), a.getDescription(), a.getImageUrl(),
                a.getImages(), a.getArtist() != null ? a.getArtist().getId() : null,
                a.getArtist() != null ? a.getArtist().getName() : null,
                a.getCategory(), a.getTechnique(), a.getDimensions(),
                a.getYearCreated(), a.isTrending(), a.getViews());
        }
    }

    public record ArtworkRequest(
        String title, String description, String imageUrl, List<String> images,
        Long artistId, String category, String technique, String dimensions,
        int year, boolean trending) {}

    public record GalleryDto(
        Long id, String name, String description, String imageUrl,
        String city, String address, boolean partner) {

        public static GalleryDto from(Gallery g) {
            return new GalleryDto(g.getId(), g.getName(), g.getDescription(), g.getImageUrl(),
                g.getCity(), g.getAddress(), g.isPartner());
        }
    }

    public record ExhibitionDto(
        Long id, String title, String description, String imageUrl,
        String location, LocalDate startDate, LocalDate endDate, boolean active) {

        public static ExhibitionDto from(Exhibition e) {
            return new ExhibitionDto(e.getId(), e.getTitle(), e.getDescription(), e.getImageUrl(),
                e.getLocation(), e.getStartDate(), e.getEndDate(), e.isActive());
        }
    }

    public record ExhibitionRequest(
        String title, String description, String imageUrl,
        String location, LocalDate startDate, LocalDate endDate, boolean active) {}

    public record ReservationDto(
        Long id, Long exhibitionId, String exhibitionTitle, LocalDate visitDate,
        String timeSlot, int visitors, String fullName, String email, String phone,
        Reservation.Status status, String code) {

        public static ReservationDto from(Reservation r) {
            return new ReservationDto(r.getId(),
                r.getExhibition() != null ? r.getExhibition().getId() : null,
                r.getExhibition() != null ? r.getExhibition().getTitle() : null,
                r.getVisitDate(), r.getTimeSlot(), r.getVisitors(),
                r.getFullName(), r.getEmail(), r.getPhone(), r.getStatus(), r.getCode());
        }
    }

    public record ReservationRequest(
        Long exhibitionId, LocalDate visitDate, String timeSlot,
        int visitors, String fullName, String email, String phone, Reservation.Status status) {}

    public record UserDto(
        Long id, String name, String email, User.Role role,
        boolean active, LocalDate createdAt) {

        public static UserDto from(User u) {
            return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole(),
                u.isActive(), u.getCreatedAt());
        }
    }

    public record MonthlyPoint(String month, long value) {}

    public record PopularArtwork(String title, long views) {}

    public record StatsDto(
        long artists, long artworks, long exhibitions, long visitors, long reservations,
        List<MonthlyPoint> visitorsByMonth, List<MonthlyPoint> reservationsByMonth,
        List<PopularArtwork> popularArtworks) {}

    public record VisitorRequest(String firstName, String lastName, String phone) {}

    public record VisitorDto(
        Long id, String firstName, String lastName, String phone,
        Instant createdAt, Instant lastSeenAt, long visits) {

        public static VisitorDto from(Visitor v) {
            return new VisitorDto(v.getId(), v.getFirstName(), v.getLastName(), v.getPhone(),
                v.getCreatedAt(), v.getLastSeenAt(), v.getVisits());
        }
    }

    /**
     * Answer to a visitor registration: the opaque session token is returned in the
     * body as well as in the cookie, so a browser that refuses third-party cookies
     * (Safari, when the site and the API sit on different domains) can keep it itself.
     */
    public record VisitorSessionDto(String sessionToken, VisitorDto visitor) {}

    public record LoginRequest(String email, String password) {}

    public record RegisterRequest(String name, String email, String password) {}

    public record AuthResponse(String token, String name, String email, User.Role role) {}
}