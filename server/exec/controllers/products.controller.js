"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = exports.productsController = void 0;
const express_1 = require("express");
const guards_1 = require("../utils/guards");
exports.productsController = (0, express_1.Router)();
// Mock data
exports.products = [
    { id: 1, name: "Comfy Chair", description: "A very comfortable chair", price: 199.99, categoryId: 1, status: 'AVAILABLE' },
    { id: 2, name: "Wooden Table", description: "Solid oak dining table", price: 499.99, categoryId: 1, status: 'AVAILABLE' },
    { id: 3, name: "Modern Lamp", description: "Sleek designer lamp", price: 89.99, categoryId: 2, status: 'AVAILABLE' }
];
// Get all products (for any user)
exports.productsController.get("/", (req, res) => {
    console.log("[GET] /products/");
    const productDTOs = exports.products
        .filter(p => p.status === 'AVAILABLE')
        .map(p => ({ id: p.id, name: p.name, price: p.price }));
    res.json(productDTOs).status(200);
});
// Get basic product info (for any user)
exports.productsController.get("/basic/:id", (req, res) => {
    console.log("[GET] /products/basic/:id");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        return res.status(400).send("ID must be a number");
    }
    const product = exports.products.find(p => p.id === id);
    if (!product || product.status !== 'AVAILABLE') {
        return res.status(404).send("Product not found");
    }
    const productDTO = {
        id: product.id,
        name: product.name,
        price: product.price
    };
    res.status(200).json(productDTO);
});
// Get detailed product info (for any user)
exports.productsController.get("/detail/:id", (req, res) => {
    console.log("[GET] /products/detail/:id");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        return res.status(400).send("ID must be a number");
    }
    const product = exports.products.find(p => p.id === id);
    if (!product || product.status !== 'AVAILABLE') {
        return res.status(404).send("Product not found");
    }
    const fullProductDTO = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: product.categoryId,
        status: product.status
    };
    res.status(200).json(fullProductDTO);
});
// ADMIN ROUTES
// Get all products (including unavailable - admin only)
exports.productsController.get("/admin", (req, res) => {
    console.log("[GET] /products/admin");
    // In a real app, check if user is admin
    res.json(exports.products).status(200);
});
// Get basic product info (admin only)
exports.productsController.get("/admin/basic/:id", (req, res) => {
    console.log("[GET] /products/admin/basic/:id");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        return res.status(400).send("ID must be a number");
    }
    const product = exports.products.find(p => p.id === id);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    const productDTO = {
        id: product.id,
        name: product.name,
        price: product.price
    };
    res.status(200).json(productDTO);
});
// Get detailed product info (admin only)
exports.productsController.get("/admin/detail/:id", (req, res) => {
    console.log("[GET] /products/admin/detail/:id");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        return res.status(400).send("ID must be a number");
    }
    const product = exports.products.find(p => p.id === id);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    const fullProductDTO = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: product.categoryId,
        status: product.status
    };
    res.status(200).json(fullProductDTO);
});
// Add new product (admin only)
exports.productsController.post("/admin", (req, res) => {
    console.log("[POST] /products/admin");
    const product = req.body;
    if (!(0, guards_1.isProduct)(product)) {
        return res.status(400).send("Invalid product data");
    }
    product.id = exports.products.length > 0 ? Math.max(...exports.products.map(p => p.id)) + 1 : 1;
    product.status = 'AVAILABLE';
    exports.products.push(product);
    res.status(201).json(product);
});
// Update product (admin only)
exports.productsController.put("/admin/:id", (req, res) => {
    console.log("[PUT] /products/admin/:id");
    const id = parseInt(req.params.id);
    const updatedProduct = req.body;
    if (!(0, guards_1.isNumber)(id) || !(0, guards_1.isProduct)(updatedProduct) || id !== updatedProduct.id) {
        return res.status(400).send("Invalid data");
    }
    const index = exports.products.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).send("Product not found");
    }
    exports.products[index] = updatedProduct;
    res.status(200).json(updatedProduct);
});
// Set product as unavailable (admin only)
exports.productsController.delete("/admin/:id", (req, res) => {
    console.log("[DELETE] /products/admin/:id");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        return res.status(400).send("ID must be a number");
    }
    const product = exports.products.find(p => p.id === id);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    product.status = 'UNAVAILABLE';
    res.status(200).json(product);
});
