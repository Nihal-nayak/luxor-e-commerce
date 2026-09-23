package com.luxor.shoppingcartapi.dtos;

import com.luxor.shoppingcartapi.Entities.Cart;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateCartItemRequestDto {

    private Long productId;

    @NotNull
    @Positive
    private Integer quantity;

}
