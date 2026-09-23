package com.luxor.shoppingcartapi.Controller;

import com.luxor.shoppingcartapi.Entities.User;
import com.luxor.shoppingcartapi.dtos.CreateOrderRequestDto;
import com.luxor.shoppingcartapi.dtos.OrderDto;
import com.luxor.shoppingcartapi.dtos.UpdateOrderStatusRequestDto;
import com.luxor.shoppingcartapi.repositories.userRepository;
import com.luxor.shoppingcartapi.service.OrderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final userRepository userRepository;

    @PostMapping
    public ResponseEntity<OrderDto> placeOrder(
            @Valid @RequestBody CreateOrderRequestDto request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        return ResponseEntity.ok(
                orderService.placeOrder(user.getId(), request)
        );
    }
    @GetMapping
    public ResponseEntity<List<OrderDto>> getMyProducts(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

        return ResponseEntity.ok(orderService.getMyOrders(user.getId()));

    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getMyOrder(@PathVariable Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        return ResponseEntity.ok(
                orderService.getMyOrder(id, user.getId())
        );
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequestDto request) {

        return ResponseEntity.ok(
                orderService.updateOrderStatus(id, request.getStatus())
        );
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<OrderDto> payOrder(
            @PathVariable Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        return ResponseEntity.ok(
                orderService.payOrder(id, user.getId())
        );
    }



}
