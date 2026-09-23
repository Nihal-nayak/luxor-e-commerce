package com.luxor.shoppingcartapi.dtos;

import com.luxor.shoppingcartapi.Entities.OrderStatus;
import lombok.Data;

@Data
public class UpdateOrderStatusRequestDto {

    private OrderStatus status;
}