package com.luxor.shoppingcartapi.service;

import com.luxor.shoppingcartapi.Entities.Cart;
import com.luxor.shoppingcartapi.Entities.User;
import com.luxor.shoppingcartapi.Mappers.CartMapper;
import com.luxor.shoppingcartapi.dtos.CartDto;
import com.luxor.shoppingcartapi.dtos.CreateCartRequest;
import com.luxor.shoppingcartapi.repositories.cartItemRepository;
import com.luxor.shoppingcartapi.repositories.cartRepository;
import com.luxor.shoppingcartapi.repositories.userRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Data
@Service
@AllArgsConstructor
public class CartService {

    private final userRepository userRepository;
    private final CartMapper cartMapper;
    private final cartRepository cartRepository;
    private final cartItemRepository cartItemRepository;

    // *** creating a cart ***
    public CartDto createCart(CreateCartRequest request){
        User user = userRepository.findById(request.getUserId()).orElseThrow();
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setCreatedAt(LocalDateTime.now());

        return cartMapper.toDto(cartRepository.save(cart));

    }
    // *** find cart by cart_id ***
    public CartDto getCartById(Long id){
        Cart cart = cartRepository.findById(id).orElseThrow();

        return cartMapper.toDto(cart);
    }
    // *** find Cart by user_id ***
    public CartDto getMyCart(Long userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow();

                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setCreatedAt(LocalDateTime.now());

                    return cartRepository.save(newCart);
                });

        return cartMapper.toDto(cart);
    }

    @Transactional
    public void clearCart(Long userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow();

        // Delete all items belonging to this user's cart
        cartItemRepository.deleteAllByCartId(cart.getId());
    }
}
