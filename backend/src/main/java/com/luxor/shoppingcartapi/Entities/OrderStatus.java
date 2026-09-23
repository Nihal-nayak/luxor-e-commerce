package com.luxor.shoppingcartapi.Entities;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    SHIPPED,
    DELIVERED,
    CANCELLED;


    public boolean canTransitionTo(OrderStatus newStatus) {

        return switch (this) {
            case PENDING ->
                    newStatus == CONFIRMED || newStatus == CANCELLED;

            case CONFIRMED ->
                    newStatus == SHIPPED;

            case SHIPPED ->
                    newStatus == DELIVERED;

            case DELIVERED, CANCELLED ->
                    false;
        };
    }
}
