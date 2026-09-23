package com.luxor.shoppingcartapi.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class UpdateCartRequestDto {
    @NotNull
    @Positive
    private Integer quantity;
}
