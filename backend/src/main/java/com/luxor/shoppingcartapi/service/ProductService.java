package com.luxor.shoppingcartapi.service;

import com.luxor.shoppingcartapi.Entities.Category;
import com.luxor.shoppingcartapi.Entities.Product;
import com.luxor.shoppingcartapi.Mappers.ProductMapper;
import com.luxor.shoppingcartapi.dtos.ProductDto;
import com.luxor.shoppingcartapi.repositories.CategoryRepository;
import com.luxor.shoppingcartapi.repositories.productRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor
public class ProductService {

    private final productRepository productRepo;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;


    public ProductDto createProduct(ProductDto dto) {

        Product product = productMapper.toEntity(dto);
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow();

        product.setCategory(category);

        Product savedProduct = productRepo.save(product);

        return productMapper.toDto(savedProduct);
    }

    //get all products & search product
    public Page<ProductDto> getAllProducts(
            Long categoryId,
            String search,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {

        String normalizedSearch =
                (search == null || search.isBlank())
                        ? null
                        : search.trim();

        return productRepo.searchProducts(
                categoryId,
                normalizedSearch,
                minPrice,
                maxPrice,
                pageable
        ).map(productMapper::toDto);
    }


    //get product by id

    public ProductDto getProductById(Long id) {
        Product product = productRepo.findById(id).orElseThrow();

        return productMapper.toDto(product);
    }

    public ProductDto updateProduct(Long id, ProductDto dto) {

        Product product = productRepo.findById(id)
                .orElseThrow();

        product.setName(dto.getName());
        product.setDesc(dto.getDesc());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setImageUrl(dto.getImageUrl());

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow();

        product.setCategory(category);

        Product savedProduct = productRepo.save(product);

        return productMapper.toDto(savedProduct);
    }


    // delete a product
    public void deleteProduct(Long id) {
        productRepo.deleteById(id);
    }
}