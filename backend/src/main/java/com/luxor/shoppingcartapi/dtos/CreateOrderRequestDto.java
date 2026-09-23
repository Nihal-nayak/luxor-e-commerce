package com.luxor.shoppingcartapi.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateOrderRequestDto {

    @NotBlank
    private String shippingAddress;

    @NotBlank
    private String shippingCity;

    @NotBlank
    private String shippingState;

    @NotBlank
    @Pattern(regexp = "\\d{6}", message = "Pincode must be 6 digits")
    private String shippingPincode;
}