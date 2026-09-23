package com.luxor.shoppingcartapi.Controller;

import com.luxor.shoppingcartapi.Entities.User;
import com.luxor.shoppingcartapi.dtos.CartDto;
import com.luxor.shoppingcartapi.dtos.CreateCartRequest;
import com.luxor.shoppingcartapi.repositories.userRepository;
import com.luxor.shoppingcartapi.service.CartService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@Data
@AllArgsConstructor
@RequestMapping("/cart")
public class CartController {

    private final userRepository userRepository;
    private final CartService cartService;

    @PostMapping
    public ResponseEntity<CartDto> CreateCart(@RequestBody CreateCartRequest request){
        return ResponseEntity.ok(cartService.createCart(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartDto> getCartById(@PathVariable Long id ){
       return ResponseEntity.ok(cartService.getCartById(id));
    }

    @GetMapping
    public ResponseEntity<CartDto> getMyCart() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        return ResponseEntity.ok(
                cartService.getMyCart(user.getId()));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        cartService.clearCart(user.getId());

        return ResponseEntity.noContent().build();
    }

}
