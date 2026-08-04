package com.vitrinezoro.web;

import com.vitrinezoro.dto.Dtos.GalleryDto;
import com.vitrinezoro.model.Gallery;
import com.vitrinezoro.repository.GalleryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/galleries")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryRepository galleries;

    @GetMapping
    public List<GalleryDto> list() {
        return galleries.findAll().stream().map(GalleryDto::from).toList();
    }

    @GetMapping("/{id}")
    public GalleryDto get(@PathVariable Long id) {
        return galleries.findById(id).map(GalleryDto::from)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GalleryDto create(@RequestBody GalleryDto body) {
        Gallery gallery = Gallery.builder()
            .name(body.name())
            .description(body.description())
            .imageUrl(body.imageUrl())
            .city(body.city())
            .address(body.address())
            .partner(body.partner())
            .build();
        return GalleryDto.from(galleries.save(gallery));
    }

    @PutMapping("/{id}")
    public GalleryDto update(@PathVariable Long id, @RequestBody GalleryDto body) {
        Gallery gallery = galleries.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        gallery.setName(body.name());
        gallery.setDescription(body.description());
        gallery.setImageUrl(body.imageUrl());
        gallery.setCity(body.city());
        gallery.setAddress(body.address());
        gallery.setPartner(body.partner());
        return GalleryDto.from(galleries.save(gallery));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        galleries.deleteById(id);
    }
}
