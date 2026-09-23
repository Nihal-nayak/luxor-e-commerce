package com.luxor.shoppingcartapi.Controller;

import com.luxor.shoppingcartapi.dtos.ProductDto;
import com.luxor.shoppingcartapi.service.ProductService;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@Data
public class ProductController {
    private final ProductService productService;


    // *** Create a Product ***
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> CreateProduct(
            @Valid @RequestBody ProductDto productDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(productDto));

    }

    // *** Get a product ***
    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                productService.getAllProducts(
                        categoryId,
                        search,
                        minPrice,
                        maxPrice,
                        pageable
                )
        );
    }


    // *** Get a product by id ***
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id){

        return ResponseEntity.ok(productService.getProductById(id));

    }


    // *** Update a product ***
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long id,
           @Valid @RequestBody ProductDto productDto) {

        return ResponseEntity.ok(
                productService.updateProduct(id, productDto)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {

        productService.deleteProduct(id);

        return ResponseEntity.noContent().build();
    }


}
