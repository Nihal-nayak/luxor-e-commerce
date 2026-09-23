package com.luxor.shoppingcartapi.repositories;

import com.luxor.shoppingcartapi.Entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem , Long> {
}
