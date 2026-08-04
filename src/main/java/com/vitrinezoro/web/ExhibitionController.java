package com.vitrinezoro.web;

import com.vitrinezoro.dto.Dtos.ExhibitionDto;
import com.vitrinezoro.dto.Dtos.ExhibitionRequest;
import com.vitrinezoro.model.Exhibition;
import com.vitrinezoro.repository.ArtistRepository;
import com.vitrinezoro.repository.ExhibitionRepository;
import com.vitrinezoro.repository.GalleryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/exhibitions")
@RequiredArgsConstructor
public class ExhibitionController {

    private final ExhibitionRepository exhibitions;
    private final GalleryRepository galleries;
    private final ArtistRepository artists;

    @GetMapping
    public List<ExhibitionDto> list() {
        return exhibitions.findAll().stream().map(ExhibitionDto::from).toList();
    }

    @GetMapping("/{id}")
    public ExhibitionDto get(@PathVariable Long id) {
        return exhibitions.findById(id).map(ExhibitionDto::from)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExhibitionDto create(@RequestBody ExhibitionRequest body) {
        Exhibition exhibition = new Exhibition();
        apply(exhibition, body);
        return ExhibitionDto.from(exhibitions.save(exhibition));
    }

    @PutMapping("/{id}")
    public ExhibitionDto update(@PathVariable Long id, @RequestBody ExhibitionRequest body) {
        Exhibition exhibition = exhibitions.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        apply(exhibition, body);
        return ExhibitionDto.from(exhibitions.save(exhibition));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        exhibitions.deleteById(id);
    }

    private void apply(Exhibition exhibition, ExhibitionRequest body) {
        exhibition.setTitle(body.title());
        exhibition.setDescription(body.description());
        exhibition.setPosterUrl(body.posterUrl());
        exhibition.setStartDate(body.startDate());
        exhibition.setEndDate(body.endDate());
        exhibition.setLocation(body.location());
        if (body.galleryId() != null) {
            exhibition.setGallery(galleries.findById(body.galleryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Galerie inconnue")));
        }
        exhibition.setArtists(body.artistIds() != null
            ? new ArrayList<>(artists.findAllById(body.artistIds()))
            : new ArrayList<>());
    }
}
