package com.vitrinezoro.repository;

import com.vitrinezoro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
