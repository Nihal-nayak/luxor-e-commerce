package com.luxor.shoppingcartapi.Controller;

import com.luxor.shoppingcartapi.Entities.User;
import com.luxor.shoppingcartapi.dtos.CartItemDto;
import com.luxor.shoppingcartapi.dtos.CreateCartItemRequestDto;
import com.luxor.shoppingcartapi.dtos.UpdateCartRequestDto;
import com.luxor.shoppingcartapi.repositories.userRepository;
import com.luxor.shoppingcartapi.service.CartItemService;
import jakarta.validation.Valid;
import lombok.Data;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@RequestMapping("/cart-items")
@RestController
public class CartItemControler {

    private final CartItemService cartItemService;
    private final userRepository userRepository;

    @PostMapping
    public ResponseEntity<CartItemDto> addCartItem(
            @Valid @RequestBody CreateCartItemRequestDto request){

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        return ResponseEntity.ok(
                cartItemService.addCartItem(request, user.getId())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemDto> updateQuantity(
            @PathVariable Long id,
           @Valid @RequestBody UpdateCartRequestDto request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        return ResponseEntity.ok(
                cartItemService.UpdateQuantity(
                        id,
                        request,
                        user.getId()
                )
        );
    }

    @GetMapping("/cart/{cartId}")
    public ResponseEntity<List<CartItemDto>> getCartItem(@PathVariable Long cartId ){
        return ResponseEntity.ok(cartItemService.getCartItems(cartId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        cartItemService.deleteCartItem(id, user.getId());

        return ResponseEntity.noContent().build();
    }

}
