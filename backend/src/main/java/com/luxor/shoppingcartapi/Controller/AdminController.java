package com.luxor.shoppingcartapi.Controller;

import com.luxor.shoppingcartapi.dtos.AdminDashboardDto;
import com.luxor.shoppingcartapi.repositories.OrderRepository;
import com.luxor.shoppingcartapi.repositories.productRepository;
import com.luxor.shoppingcartapi.repositories.userRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class AdminController {

    private final productRepository productRepository;
    private final OrderRepository orderRepository;
    private final userRepository userRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardDto> getDashboard() {
        return ResponseEntity.ok(
                new AdminDashboardDto(
                        "Admin dashboard",
                        productRepository.count(),
                        orderRepository.count(),
                        userRepository.count()
                )
        );
    }
}
