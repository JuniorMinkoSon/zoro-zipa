package com.vitrinezoro.web;

import com.vitrinezoro.dto.Dtos.ArtworkDto;
import com.vitrinezoro.dto.Dtos.ArtworkRequest;
import com.vitrinezoro.model.Artwork;
import com.vitrinezoro.repository.ArtistRepository;
import com.vitrinezoro.repository.ArtworkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/artworks")
@RequiredArgsConstructor
public class ArtworkController {

    private final ArtworkRepository artworks;
    private final ArtistRepository artists;

    @GetMapping
    public List<ArtworkDto> list() {
        return artworks.findAll().stream().map(ArtworkDto::from).toList();
    }

    /** Fetching a single artwork also counts a view for analytics. */
    @GetMapping("/{id}")
    public ArtworkDto get(@PathVariable Long id) {
        Artwork artwork = artworks.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        artwork.setViews(artwork.getViews() + 1);
        return ArtworkDto.from(artworks.save(artwork));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ArtworkDto create(@RequestBody ArtworkRequest body) {
        Artwork artwork = new Artwork();
        apply(artwork, body);
        return ArtworkDto.from(artworks.save(artwork));
    }

    @PutMapping("/{id}")
    public ArtworkDto update(@PathVariable Long id, @RequestBody ArtworkRequest body) {
        Artwork artwork = artworks.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        apply(artwork, body);
        return ArtworkDto.from(artworks.save(artwork));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        artworks.deleteById(id);
    }

    private void apply(Artwork artwork, ArtworkRequest body) {
        artwork.setTitle(body.title());
        artwork.setDescription(body.description());
        artwork.setImageUrl(body.imageUrl());
        artwork.setImages(body.images() != null ? new ArrayList<>(body.images()) : new ArrayList<>());
        artwork.setCategory(body.category());
        artwork.setTechnique(body.technique());
        artwork.setDimensions(body.dimensions());
        artwork.setYear(body.year());
        artwork.setTrending(body.trending());
        if (body.artistId() != null) {
            artwork.setArtist(artists.findById(body.artistId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Artiste inconnu")));
        }
    }
}
