package com.luxor.shoppingcartapi.dtos;


import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CartDto
{
    private Long id;
    private LocalDateTime createdAt;
    private Long userId;
    private List<CartItemDto>  items;
    private BigDecimal totalPrice;
}
