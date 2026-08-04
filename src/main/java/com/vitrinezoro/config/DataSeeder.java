package com.vitrinezoro.config;

import com.vitrinezoro.model.*;
import com.vitrinezoro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
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
    private final ExhibitionRepository exhibitions;
    private final ReservationRepository reservations;
    private final UserRepository users;

    private static String unsplash(String id) {
        return "https://images.unsplash.com/" + id + "?q=80&w=1600&auto=format&fit=crop";
    }

    @Override
    public void run(String... args) {
        if (artists.count() > 0) return;

        Artist awa = artist("Awa Koné", "photo-1531123897727-8f129e1688ce", "Ivoirienne",
            "Abstraction contemporaine",
            "Peintre de la lumière et de la mémoire, Awa Koné explore les liens entre traditions akan et abstraction contemporaine.",
            "Formée à l'INSAAC d'Abidjan puis à l'École des Beaux-Arts de Paris, Awa Koné expose depuis 2012 entre l'Afrique de l'Ouest et l'Europe. Ses séries « Mémoires tissées » ont été présentées à la Biennale de Dakar et à la 1-54 Contemporary African Art Fair de Londres.");
        Artist kofi = artist("Kofi Mensah", "photo-1506794778202-cad84cf45f1d", "Ghanéen",
            "Sculpture et matériaux recyclés",
            "Sculpteur du réemploi, Kofi Mensah transforme métaux et plastiques récupérés en figures totémiques monumentales.",
            "Autodidacte devenu figure majeure de la sculpture ouest-africaine, Kofi Mensah travaille à Accra. Ses installations interrogent la société de consommation et la résilience des communautés côtières.");
        Artist ines = artist("Inès Diarra", "photo-1494790108377-be9c29b29330", "Malienne",
            "Photographie documentaire",
            "Photographe des villes en mutation, Inès Diarra capte la poésie des architectures sahéliennes et de leurs habitants.",
            "Diplômée du CFP de Bamako, Inès Diarra a reçu le Prix Découverte des Rencontres de Bamako en 2019. Son travail est conservé dans les collections du Musée du Quai Branly.");
        Artist yann = artist("Yann Lekas", "photo-1500648767791-00dcc994a43e", "Français",
            "Peinture figurative moderne",
            "Entre figuration et rêve, Yann Lekas peint des scènes urbaines saturées de couleur et de silence.",
            "Ancien graphiste devenu peintre à plein temps, Yann Lekas vit entre Marseille et Abidjan. Ses grands formats sont exposés dans plusieurs galeries européennes.");
        Artist nadia = artist("Nadia El Amrani", "photo-1544005313-94ddf0286df2", "Marocaine",
            "Calligraphie contemporaine",
            "Nadia El Amrani réinvente la calligraphie arabe en compositions abstraites monumentales, entre encre et feuille d'or.",
            "Formée à Casablanca et à Madrid, Nadia El Amrani expose de Marrakech à Dubaï. Elle collabore régulièrement avec des institutions culturelles autour de la transmission du geste calligraphique.");
        Artist sekou = artist("Sékou Traoré", "photo-1507003211169-0a1dd7228f2d", "Burkinabè",
            "Art textile", 
            "Tisserand et plasticien, Sékou Traoré compose des tapisseries narratives à partir de coton biologique et de teintures végétales.",
            "Héritier d'une lignée de tisserands de Bobo-Dioulasso, Sékou Traoré fait dialoguer motifs traditionnels et récits contemporains. Lauréat du Prix des Arts Textiles de Lomé 2023.");
        sekou.setStatus(Artist.Status.PENDING);
        List<Artist> allArtists = artists.saveAll(List.of(awa, kofi, ines, yann, nadia, sekou));

        Gallery rotonde = gallery("La Rotonde des Arts", "Abidjan",
            "Plateau, Avenue Chardy",
            "Espace pionnier de l'art contemporain ivoirien, La Rotonde des Arts défend les artistes émergents d'Afrique de l'Ouest depuis 1993.",
            "photo-1577720580479-7d839d829c73", true);
        Gallery cecile = gallery("Galerie Cécile Fakhoury", "Abidjan",
            "Cocody, Boulevard Latrille",
            "Vitrine internationale de la création africaine contemporaine, présente à Abidjan, Dakar et Paris.",
            "photo-1580136579312-94651dfd596d", true);
        Gallery atelier = gallery("Atelier Sahel", "Bamako",
            "Quartier du Fleuve",
            "Lieu hybride dédié à la photographie et aux arts visuels sahéliens, avec résidences d'artistes.",
            "photo-1554907984-15263bfd63bd", true);
        Gallery lumiere = gallery("Espace Lumière", "Dakar",
            "Plateau, Rue Félix Faure",
            "Galerie dédiée aux dialogues entre artistes du continent et de la diaspora.",
            "photo-1572947650440-e8a97ef053b2", false);
        galleries.saveAll(List.of(rotonde, cecile, atelier, lumiere));

        artworks.saveAll(List.of(
            artwork("Mémoires tissées I", awa, "Peinture", "Acrylique et pigments sur toile", "150 × 120 cm", 2024, true, 342,
                "Première pièce de la série phare d'Awa Koné : des strates de pigments ocre et indigo évoquent les pagnes tissés de son enfance, entre effacement et résurgence de la mémoire.",
                "photo-1541961017774-22349e4a1262"),
            artwork("Lagune, 6h04", awa, "Peinture", "Huile sur toile", "100 × 81 cm", 2023, false, 187,
                "La lagune Ébrié au lever du jour, réduite à des champs de couleur vibrants. Une méditation sur la lenteur dans une ville qui accélère.",
                "photo-1549289524-06cf8837ace5"),
            artwork("Totem des marées", kofi, "Sculpture", "Métal récupéré et plastiques marins", "220 × 60 × 60 cm", 2024, true, 415,
                "Assemblage monumental de débris collectés sur les plages d'Accra. Le totem se dresse comme un gardien né de ce que l'océan rejette.",
                "photo-1554188248-986adbb73be4"),
            artwork("Gardienne", kofi, "Sculpture", "Bronze et bois flotté", "85 × 40 × 35 cm", 2022, false, 156,
                "Figure féminine protectrice inspirée des statuaires akan, coulée en bronze et posée sur un socle de bois flotté.",
                "photo-1544413955-8f0eee2bdc3d"),
            artwork("Bamako vertical", ines, "Photographie", "Tirage argentique baryté", "120 × 80 cm", 2023, true, 389,
                "Les nouvelles tours de Bamako vues depuis les toits des maisons en banco : deux temporalités urbaines dans un même cadre.",
                "photo-1477959858617-67f85cf4f1df"),
            artwork("Les repasseuses", ines, "Photographie", "Tirage pigmentaire", "90 × 60 cm", 2021, false, 203,
                "Scène de rue à Médina Coura : trois femmes, la vapeur, la lumière rasante de fin d'après-midi.",
                "photo-1520390138845-fd2d229dd553"),
            artwork("Rue des Jardins, minuit", yann, "Peinture", "Acrylique sur toile", "130 × 97 cm", 2024, true, 298,
                "Une rue d'Abidjan la nuit, vidée de ses passants. Les enseignes électriques deviennent des aplats de couleur pure.",
                "photo-1514924013411-cbf25faa35bb"),
            artwork("Intérieur bleu", yann, "Peinture", "Huile sur lin", "81 × 65 cm", 2022, false, 134,
                "Un salon familial baigné d'un bleu crépusculaire, hommage aux intérieurs peints par Matisse revisité aux tropiques.",
                "photo-1536924940846-227afb31e2a5"),
            artwork("Lettre d'or III", nadia, "Calligraphie", "Encre et feuille d'or sur papier", "100 × 70 cm", 2023, false, 221,
                "Troisième variation d'une lettre imaginaire : le geste calligraphique s'émancipe du sens pour devenir pur rythme.",
                "photo-1579783902614-a3fb3927b6a5"),
            artwork("Verset silencieux", nadia, "Calligraphie", "Encre sur toile préparée", "160 × 120 cm", 2024, true, 267,
                "Composition monumentale où l'encre noire respire dans les réserves du blanc cassé — un silence écrit.",
                "photo-1578321272176-b7bbc0679853"),
            artwork("Récit du fleuve", sekou, "Textile", "Coton tissé, teintures végétales", "200 × 140 cm", 2023, false, 98,
                "Tapisserie narrative retraçant une traversée du fleuve Mouhoun, entre motifs bwaba et abstraction géométrique.",
                "photo-1528459801416-a9e53bbf4e17"),
            artwork("Constellation cotonnière", sekou, "Textile", "Coton et raphia", "180 × 120 cm", 2024, false, 112,
                "Des centaines de nœuds de coton brut forment une carte du ciel telle que racontée par les anciens de Bobo-Dioulasso.",
                "photo-1615529182904-14819c35db37")));

        LocalDate today = LocalDate.now();
        Exhibition memoires = exhibition("Mémoires en lumière", rotonde, "Abidjan, Plateau",
            "Une traversée des mémoires ouest-africaines à travers peinture, photographie et textile. Trois générations d'artistes y confrontent leurs récits de la ville, de l'exil et de la transmission.",
            "photo-1518998053901-5348d3961a04", today.minusDays(20), today.plusDays(40),
            List.of(awa, ines, sekou));
        Exhibition matieres = exhibition("Matières premières", cecile, "Abidjan, Cocody",
            "Sculptures et installations qui donnent une seconde vie aux matériaux délaissés : métal, plastique marin, bois flotté. Un manifeste pour un art de la réparation.",
            "photo-1545989253-02cc26577f88", today.minusDays(5), today.plusDays(60),
            List.of(kofi));
        Exhibition ecritures = exhibition("Écritures infinies", lumiere, "Dakar, Plateau",
            "La calligraphie contemporaine dans tous ses états, de l'encre traditionnelle aux installations lumineuses.",
            "photo-1577083552431-6e5fd01988ec", today.plusDays(15), today.plusDays(75),
            List.of(nadia));
        Exhibition horizons = exhibition("Horizons urbains", atelier, "Bamako",
            "Photographies et peintures des métropoles africaines en mutation : chantiers, néons, résistances poétiques.",
            "photo-1531058020387-3be344556be6", today.plusDays(30), today.plusDays(90),
            List.of(ines, yann));
        exhibitions.saveAll(List.of(memoires, matieres, ecritures, horizons));

        users.saveAll(List.of(
            user("Aminata Bakayoko", "aminata@zorozipa.art", User.Role.ADMIN),
            user("Cécile Fakhoury", "contact@galeriefakhoury.com", User.Role.GALLERY),
            user("Jean-Marc Kouadio", "jm.kouadio@gmail.com", User.Role.VISITOR),
            user("Fatou Ndiaye", "fatou.ndiaye@outlook.com", User.Role.VISITOR)));

        reservations.saveAll(List.of(
            reservation(memoires, today.plusDays(3), "10:00", 2, "Jean-Marc Kouadio", "jm.kouadio@gmail.com"),
            reservation(memoires, today.plusDays(7), "14:00", 4, "Fatou Ndiaye", "fatou.ndiaye@outlook.com"),
            reservation(matieres, today.plusDays(10), "11:30", 1, "Awa Cissé", "awa.cisse@yahoo.fr"),
            reservation(matieres, today.minusDays(2), "15:30", 3, "Paul Angoua", "p.angoua@gmail.com")));
    }

    private Artist artist(String name, String photo, String nationality, String style, String bio, String journey) {
        return Artist.builder()
            .name(name)
            .portraitUrl(unsplash(photo))
            .nationality(nationality)
            .style(style)
            .bio(bio)
            .journey(journey)
            .status(Artist.Status.VALIDATED)
            .build();
    }

    private Gallery gallery(String name, String city, String address, String description, String photo, boolean partner) {
        return Gallery.builder()
            .name(name)
            .city(city)
            .address(address)
            .description(description)
            .imageUrl(unsplash(photo))
            .partner(partner)
            .build();
    }

    private Artwork artwork(String title, Artist artist, String category, String technique,
                            String dimensions, int year, boolean trending, long views,
                            String description, String photo) {
        String url = unsplash(photo);
        return Artwork.builder()
            .title(title)
            .artist(artist)
            .category(category)
            .technique(technique)
            .dimensions(dimensions)
            .year(year)
            .trending(trending)
            .views(views)
            .description(description)
            .imageUrl(url)
            .images(List.of(url))
            .build();
    }

    private Exhibition exhibition(String title, Gallery gallery, String location, String description,
                                  String photo, LocalDate start, LocalDate end, List<Artist> artists) {
        return Exhibition.builder()
            .title(title)
            .gallery(gallery)
            .location(location)
            .description(description)
            .posterUrl(unsplash(photo))
            .startDate(start)
            .endDate(end)
            .artists(artists)
            .build();
    }

    private User user(String name, String email, User.Role role) {
        return User.builder()
            .name(name)
            .email(email)
            .role(role)
            .active(true)
            .createdAt(LocalDate.now().minusDays(30))
            .build();
    }

    private Reservation reservation(Exhibition exhibition, LocalDate date, String slot,
                                    int visitors, String fullName, String email) {
        return Reservation.builder()
            .exhibition(exhibition)
            .visitDate(date)
            .timeSlot(slot)
            .visitors(visitors)
            .fullName(fullName)
            .email(email)
            .status(Reservation.Status.CONFIRMED)
            .code("ZZ-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase())
            .build();
    }
}
