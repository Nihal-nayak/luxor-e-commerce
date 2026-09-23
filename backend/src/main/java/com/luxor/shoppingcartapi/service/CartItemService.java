package com.luxor.shoppingcartapi.service;

import com.luxor.shoppingcartapi.Entities.Cart;
import com.luxor.shoppingcartapi.Entities.CartItem;
import com.luxor.shoppingcartapi.Entities.Product;
import com.luxor.shoppingcartapi.Mappers.CartItemMapper;
import com.luxor.shoppingcartapi.dtos.CartItemDto;
import com.luxor.shoppingcartapi.dtos.CreateCartItemRequestDto;
import com.luxor.shoppingcartapi.dtos.UpdateCartRequestDto;
import com.luxor.shoppingcartapi.repositories.cartItemRepository;
import com.luxor.shoppingcartapi.repositories.cartRepository;
import com.luxor.shoppingcartapi.repositories.productRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CartItemService {

    private final cartRepository  cartRepo;
    private final productRepository productRepo;
    private final cartItemRepository cartItemRepo;
    private final CartItemMapper cartItemMap;


    public CartItemDto addCartItem(CreateCartItemRequestDto request, Long userId){

        Cart cart = cartRepo.findByUserId(userId).orElseThrow();

        Product product = productRepo.findById(request.getProductId()).orElseThrow();

        CartItem cartItem = cartItemRepo
                .findByCartIdAndProductId(cart.getId(), product.getId())
                .orElseGet(() -> {
                    CartItem newCartItem = new CartItem();
                    newCartItem.setCart(cart);
                    newCartItem.setProduct(product);
                    newCartItem.setQuantity(0);
                    return newCartItem;
                });

        int newQuantity = cartItem.getQuantity() + request.getQuantity();

        if (newQuantity > product.getStockQuantity()) {
            throw new IllegalArgumentException("Not enough stock available");
        }

        cartItem.setQuantity(newQuantity);

        return cartItemMap.toDto(cartItemRepo.save(cartItem));
    }

    public List<CartItemDto> getCartItems(Long id){
        return cartItemRepo.findByCartId(id)
                .stream()
                .map(cartItemMap::toDto)
                .toList();
    }

    public CartItemDto UpdateQuantity(
            Long id,
            UpdateCartRequestDto request,
            Long userId) {

        CartItem cartItem = cartItemRepo
                .findByIdAndCartUserId(id, userId)
                .orElseThrow();

        cartItem.setQuantity(request.getQuantity());

        return cartItemMap.toDto(
                cartItemRepo.save(cartItem)
        );
    }

    public void deleteCartItem(Long id, Long userId) {

        CartItem cartItem = cartItemRepo
                .findByIdAndCartUserId(id, userId)
                .orElseThrow();

        cartItemRepo.delete(cartItem);
    }


}
