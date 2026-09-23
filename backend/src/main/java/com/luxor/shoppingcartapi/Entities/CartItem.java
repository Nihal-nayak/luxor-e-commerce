package com.luxor.shoppingcartapi.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name="cart_items")
@Getter
@Setter
public class CartItem {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name ="cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    public BigDecimal getTotalPrice() {
        return product.getPrice()
                .multiply(BigDecimal.valueOf(quantity));
    }

}
