package com.vitrinezoro.repository;

import com.vitrinezoro.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    Optional<Visitor> findBySessionId(String sessionId);

    Optional<Visitor> findByPhone(String phone);
}
