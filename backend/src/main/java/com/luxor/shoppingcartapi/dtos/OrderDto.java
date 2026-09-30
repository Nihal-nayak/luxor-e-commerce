package com.luxor.shoppingcartapi.dtos;

import com.luxor.shoppingcartapi.Entities.OrderStatus;
import com.luxor.shoppingcartapi.Entities.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {
    private Long id;
    private Long userId;
    private LocalDateTime createdAt;
    private OrderStatus status;
    private BigDecimal totalPrice;
    private List<OrderItemDto> items;

    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingPincode;
    private PaymentStatus paymentStatus;

    /** Populated for admin order views only */
    private String customerName;
    private String customerEmail;
}
