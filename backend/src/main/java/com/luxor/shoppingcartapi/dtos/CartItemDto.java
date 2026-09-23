package com.luxor.shoppingcartapi.dtos;

import lombok.Data;

@Data
public class CartItemDto
{
    private Long id;
    private Long productId;
    private Integer quantity;
}
