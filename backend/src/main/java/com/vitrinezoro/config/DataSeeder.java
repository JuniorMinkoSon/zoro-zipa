package com.vitrinezoro.config;

import com.vitrinezoro.model.*;
import com.vitrinezoro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/** Seeds the catalogue on first start so the platform is immediately usable. */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ArtistRepository artists;
    private final ArtworkRepository artworks;
    private final GalleryRepository galleries;
    private final ReservationRepository reservations;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@zorozipa.com}")
    private String adminEmail;

    // No fallback: a password written here would be public, since the repository
    // can be read. Startup fails instead (see seedAdmin).
    @Value("${app.admin.password:}")
    private String adminPassword;

    // No fallback values here on purpose: a default account whose credentials sit in
    // the source code is a public login for the showcase site, since the repository
    // is readable. Same reasoning as ADMIN_PASSWORD.
    @Value("${app.user.email:}")
    private String userEmail;

    @Value("${app.user.password:}")
    private String userPassword;

    private static String unsplash(String id) {
        return "https://images.unsplash.com/" + id + "?q=80&w=1600&auto=format&fit=crop";
    }

    private static String local(String filename) {
        return "/uploads/" + filename;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedClient();

        if (artists.count() > 0) return;

        Artist zoro = artist("Zoro Zipa", local("image00002.jpeg"), "Ivoirien",
            "Urban Art",
            "Kouassi Konan Urbain, alias Zoro Zipa, est un artiste plasticien ivoirien dont la pratique s'enracine dans l'espace urbain et les réalités sociales contemporaines. Nourri dès l'enfance par un environnement artistique, il développe très tôt une sensibilité visuelle qui l'amène à explorer le graffiti et le street art comme principaux modes d'expression.\n\n" +
            "Formé en art mural, il investit la ville comme terrain de création, utilisant les murs comme supports d'un langage visuel engagé. Son travail aborde des thématiques telles que la transmission, les injustices sociales, la violence, la maltraitance et les crises humanitaires, en écho à son parcours personnel.\n\n" +
            "Pour Zoro Zipa, chaque œuvre est une étape de sa vie. Ses peintures sont les fragments d'une mémoire personnelle, où se mêlent les blessures, les épreuves, les injustices, mais aussi les moments de joie, de liberté et d'amusement qui ont construit son identité. Il ne peint pas seulement des images : il peint sa vie. Chaque mur devient un témoignage, chaque personnage une émotion, chaque couleur un souvenir.\n\n" +
            "Son univers s'enrichit également d'influences issues des cultures traditionnelles ivoiriennes, notamment sénoufo. La symbolique du Boloye, danse initiatique dite « danse de la panthère », occupe une place centrale dans sa recherche. Elle incarne, dans son œuvre, les notions de responsabilité, de passage et de préservation des savoirs ancestraux.\n\n" +
            "À la croisée du street art et des héritages culturels, Zoro Zipa développe une pratique où mémoire collective et expression contemporaine dialoguent. Son travail se veut à la fois un acte de transmission, de résistance et de conscientisation. En transformant son histoire personnelle en langage universel, il invite le public à se reconnaître dans ses œuvres et à réfléchir aux réalités humaines qui façonnent nos sociétés. Chaque création est une trace de son existence, une mémoire peinte où l'intime rencontre le collectif.",
            "Zoro Zipa transforme les murs et les espaces urbains en galeries à ciel ouvert. Son travail explore la tension entre tradition et modernité à travers des compositions audacieuses et engagées. Chaque pièce raconte une histoire de la ville contemporaine africaine.");
        List<Artist> allArtists = artists.saveAll(List.of(zoro));

        Gallery main = gallery("Zoro Zipa Gallery", "Abidjan",
            "Plateau, Rue de l'Art Urbain",
            "Galerie dédiée aux œuvres urbaines et contemporaines de Zoro Zipa. Un espace de création et de partage de l'art urbain africain.",
            "photo-1577720580479-7d839d829c73", true);
        galleries.saveAll(List.of(main));

        artworks.saveAll(List.of(
            artwork("Vibrations Urbaines", zoro, "Urban Art", "Spray et acrylique sur toile", "200 × 150 cm", 2024, true, 542,
                "Une explosion de couleurs et de formes géométriques qui capture l'énergie brute de la vie urbaine abidjanaise.",
                local("image00001.jpeg")),
            artwork("Rues de Lumière", zoro, "Urban Art", "Spray et techniques mixtes", "180 × 120 cm", 2024, true, 428,
                "Les ruelles d'Abidjan illuminées par la nuit, peintes avec des couleurs éclatantes et une dynamique captivante.",
                local("image00002.jpeg")),
            artwork("Cité en Mouvement", zoro, "Urban Art", "Acrylique et spray", "220 × 140 cm", 2024, true, 387,
                "Une représentation poétique du flux constant des villes africaines, où tradition et modernité dansent ensemble.",
                local("image00003.jpeg")),
            artwork("Écho Urbain", zoro, "Urban Art", "Spray et peinture sur toile", "160 × 120 cm", 2024, true, 295,
                "Les voix de la ville résonnent dans cette composition abstraite urbaine, où chaque coup de pinceau raconte une histoire.",
                local("image00004.jpeg"))));

        // Exhibitions, Solo Shows, Media, Products, and Masterclasses can be managed via admin panel
    }

    /**
     * Creates the initial admin account (hashed password) if none exists yet.
     * An empty ADMIN_PASSWORD stops the application rather than creating an account
     * anyone could sign in to. Nothing happens when the account already exists —
     * changing ADMIN_PASSWORD never rewrites an existing password, that is done from
     * the Profile screen of the admin panel.
     */
    private void seedAdmin() {
        if (users.existsByEmail(adminEmail)) return;

        if (adminPassword.isBlank()) {
            throw new IllegalStateException(
                "ADMIN_PASSWORD doit être défini pour créer le compte administrateur initial.");
        }

        users.save(User.builder()
            .name("Administrateur Zoro Zipa")
            .email(adminEmail)
            .password(passwordEncoder.encode(adminPassword))
            .role(User.Role.ADMIN)
            .active(true)
            .createdAt(LocalDate.now())
            .build());
    }

    /**
     * Creates the optional client account, and only when both APP_USER_EMAIL and
     * APP_USER_PASSWORD are configured. Without them no account is created at all,
     * rather than one anybody could guess from the source.
     */
    private void seedClient() {
        if (userEmail.isBlank() || userPassword.isBlank()) return;
        if (users.existsByEmail(userEmail)) return;

        users.save(User.builder()
            .name("Utilisateur Zoro Zipa")
            .email(userEmail)
            .password(passwordEncoder.encode(userPassword))
            .role(User.Role.CLIENT)
            .active(true)
            .createdAt(LocalDate.now())
            .build());
    }

    private Artist artist(String name, String photo, String nationality, String style, String bio, String journey) {
        String url = photo.startsWith("/") ? photo : unsplash(photo);
        return Artist.builder()
            .name(name)
            .portraitUrl(url)
            .nationality(nationality)
            .style(style)
            .bio(bio)
            .journey(journey)
            .status(Artist.Status.VALIDATED)
            .build();
    }

    private Gallery gallery(String name, String city, String address, String description, String photo, boolean partner) {
        String url = photo.startsWith("/") ? photo : unsplash(photo);
        return Gallery.builder()
            .name(name)
            .city(city)
            .address(address)
            .description(description)
            .imageUrl(url)
            .partner(partner)
            .build();
    }

    private Artwork artwork(String title, Artist artist, String category, String technique,
                            String dimensions, int year, boolean trending, long views,
                            String description, String photo) {
        String url = photo.startsWith("/") ? photo : unsplash(photo);
        return Artwork.builder()
            .title(title)
            .artist(artist)
            .category(category)
            .technique(technique)
            .dimensions(dimensions)
            .yearCreated(year)
            .trending(trending)
            .views(views)
            .description(description)
            .imageUrl(url)
            .images(List.of(url))
            .build();
    }


    private Reservation reservation(Exhibition exhibition, LocalDate date, String slot,
                                    int visitors, String fullName, String email, String phone) {
        return Reservation.builder()
            .exhibition(exhibition)
            .visitDate(date)
            .timeSlot(slot)
            .visitors(visitors)
            .fullName(fullName)
            .email(email)
            .phone(phone)
            .status(Reservation.Status.CONFIRMED)
            .code("ZZ-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase())
            .build();
    }
}
