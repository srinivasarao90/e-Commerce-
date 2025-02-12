package com.example.ecommerce.controller;

import com.example.ecommerce.model.Product;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @GetMapping
    public List<Product> getAllProducts() {
        return Arrays.asList(
            new Product(1, "Smartphone", "Electronics", 29999.99, "phone.jpg"),
            new Product(2, "T-Shirt", "Fashion", 499.99, "tshirt.jpg"),
            new Product(3, "Rice Bag", "Grocery", 999.99, "rice.jpg")
        );
    }
}
