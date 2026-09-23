package com.luxor.shoppingcartapi.service;

import com.luxor.shoppingcartapi.Entities.*;
import com.luxor.shoppingcartapi.Mappers.OrderMapper;
import com.luxor.shoppingcartapi.dtos.CreateOrderRequestDto;
import com.luxor.shoppingcartapi.dtos.OrderDto;
import com.luxor.shoppingcartapi.repositories.OrderRepository;
import com.luxor.shoppingcartapi.repositories.cartItemRepository;
import com.luxor.shoppingcartapi.repositories.cartRepository;
import com.luxor.shoppingcartapi.repositories.productRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Service
public class OrderService {

    private final cartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final productRepository productRepository;
    private final cartItemRepository cartItemRepository;


    @Transactional
    public OrderDto placeOrder(
            Long userId,
            CreateOrderRequestDto request) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow();

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is Empty");
        }

        Order order = new Order();

        order.setUser(cart.getUser());
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setTotalPrice(cart.getTotalPrice());

        // Shipping details
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingState(request.getShippingState());
        order.setShippingPincode(request.getShippingPincode());


        // Create OrderItems from CartItems
        cart.getItems().stream()
                .map(cartItem -> {

                    Product product = cartItem.getProduct();
                    int quantity = cartItem.getQuantity();

                    // Check stock
                    if (quantity > product.getStockQuantity()) {
                        throw new IllegalArgumentException(
                                "Not enough stock available for "
                                        + product.getName()
                        );
                    }

                    // Reduce stock
                    product.setStockQuantity(
                            product.getStockQuantity() - quantity
                    );

                    productRepository.save(product);

                    // Create OrderItem
                    OrderItem orderItem = new OrderItem();

                    orderItem.setOrder(order);
                    orderItem.setProduct(product);
                    orderItem.setQuantity(quantity);
                    orderItem.setPrice(product.getPrice());



                    return orderItem;

                })
                .forEach(order.getItems()::add);


        // Save order
        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cartItemRepository.deleteAllByCartId(cart.getId());

        return orderMapper.toDto(savedOrder);
    }

    @Transactional
    public OrderDto payOrder(Long orderId, Long userId) {

        Order order = orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order not found"));

        if (order.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Payment has already been processed"
            );
        }

        order.setPaymentStatus(PaymentStatus.SUCCESS);
        order.setStatus(OrderStatus.CONFIRMED);

        Order savedOrder = orderRepository.save(order);

        return orderMapper.toDto(savedOrder);
    }


    public List<OrderDto> getMyOrders(Long userId) {

        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }


    public OrderDto getMyOrder(Long orderId, Long userId) {

        Order order = orderRepository
                .findByIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order not found"));

        return orderMapper.toDto(order);
    }


    @Transactional
    public OrderDto updateOrderStatus(
            Long orderId,
            OrderStatus status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Order not found"));

        if (!order.getStatus().canTransitionTo(status)) {
            throw new IllegalArgumentException(
                    "Invalid order status transition from "
                            + order.getStatus()
                            + " to "
                            + status
            );
        }

        order.setStatus(status);

        // Restore stock if order is cancelled
        if (status == OrderStatus.CANCELLED) {

            order.getItems().forEach(orderItem -> {

                Product product = orderItem.getProduct();

                product.setStockQuantity(
                        product.getStockQuantity()
                                + orderItem.getQuantity()
                );

                productRepository.save(product);
            });
        }

        Order savedOrder = orderRepository.save(order);

        return orderMapper.toDto(savedOrder);
    }
}