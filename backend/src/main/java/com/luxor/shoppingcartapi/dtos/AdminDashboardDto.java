package com.luxor.shoppingcartapi.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardDto {

    private String message;
    private long productCount;
    private long orderCount;
    private long userCount;
}
