package com.luxor.shoppingcartapi.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private BigDecimal totalPrice;

    @OneToMany(
            mappedBy = "order" ,
            cascade = CascadeType.PERSIST)
    private List<OrderItem> items = new ArrayList<>();

    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingPincode;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
}
