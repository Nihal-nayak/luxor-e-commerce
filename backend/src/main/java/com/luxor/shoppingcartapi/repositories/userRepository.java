package com.luxor.shoppingcartapi.repositories;

import com.luxor.shoppingcartapi.Entities.User;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface userRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(@Email String email);

    List<User> findAllByOrderByIdAsc();
}
