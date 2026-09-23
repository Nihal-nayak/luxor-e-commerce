package com.luxor.shoppingcartapi.repositories;

import com.luxor.shoppingcartapi.Entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order , Long> {

    List<Order> findByUserId(Long userid);

    Optional<Order> findByIdAndUserId(Long id, Long userId);
}
