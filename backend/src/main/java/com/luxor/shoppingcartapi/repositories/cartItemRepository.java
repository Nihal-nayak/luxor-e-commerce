package com.luxor.shoppingcartapi.repositories;

import com.luxor.shoppingcartapi.Entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface cartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(Long id);

    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    Optional<CartItem> findByIdAndCartUserId(Long id, Long userId);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.cart.id = :cartId")
    void deleteAllByCartId(@Param("cartId") Long cartId);
}
