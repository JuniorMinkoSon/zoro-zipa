package com.vitrinezoro.web;

import com.vitrinezoro.dto.Dtos.UserDto;
import com.vitrinezoro.model.User;
import com.vitrinezoro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository users;

    @GetMapping
    public List<UserDto> list() {
        return users.findAll().stream().map(UserDto::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto create(@RequestBody UserDto body) {
        User user = User.builder()
            .name(body.name())
            .email(body.email())
            .role(body.role() != null ? body.role() : User.Role.VISITOR)
            .active(true)
            .createdAt(LocalDate.now())
            .build();
        return UserDto.from(users.save(user));
    }

    @PutMapping("/{id}")
    public UserDto update(@PathVariable Long id, @RequestBody UserDto body) {
        User user = users.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.name() != null) user.setName(body.name());
        if (body.email() != null) user.setEmail(body.email());
        if (body.role() != null) user.setRole(body.role());
        user.setActive(body.active());
        return UserDto.from(users.save(user));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        users.deleteById(id);
    }
}
