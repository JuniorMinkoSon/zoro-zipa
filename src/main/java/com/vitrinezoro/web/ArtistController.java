package com.vitrinezoro.web;

import com.vitrinezoro.dto.Dtos.ArtistDto;
import com.vitrinezoro.model.Artist;
import com.vitrinezoro.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistRepository artists;

    @GetMapping
    public List<ArtistDto> list() {
        return artists.findAll().stream().map(ArtistDto::from).toList();
    }

    @GetMapping("/{id}")
    public ArtistDto get(@PathVariable Long id) {
        return artists.findById(id).map(ArtistDto::from)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ArtistDto create(@RequestBody ArtistDto body) {
        Artist artist = Artist.builder()
            .name(body.name())
            .portraitUrl(body.portraitUrl())
            .bio(body.bio())
            .journey(body.journey())
            .style(body.style())
            .nationality(body.nationality())
            .status(body.status() != null ? body.status() : Artist.Status.PENDING)
            .build();
        return ArtistDto.from(artists.save(artist));
    }

    @PutMapping("/{id}")
    public ArtistDto update(@PathVariable Long id, @RequestBody ArtistDto body) {
        Artist artist = artists.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        artist.setName(body.name());
        artist.setPortraitUrl(body.portraitUrl());
        artist.setBio(body.bio());
        artist.setJourney(body.journey());
        artist.setStyle(body.style());
        artist.setNationality(body.nationality());
        if (body.status() != null) artist.setStatus(body.status());
        return ArtistDto.from(artists.save(artist));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        artists.deleteById(id);
    }
}
