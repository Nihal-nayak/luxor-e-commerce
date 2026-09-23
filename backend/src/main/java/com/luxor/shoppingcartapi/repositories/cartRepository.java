package com.luxor.shoppingcartapi.repositories;

import com.luxor.shoppingcartapi.Entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface cartRepository extends JpaRepository<Cart , Long> {
    Optional<Cart> findByUserId(Long userId);


}
