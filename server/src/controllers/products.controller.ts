/**
 * This file contains all the logic for the products controller
 */
import { Request, Response, Router } from "express";
import { Product, ProductDTO, FullProductDTO } from "../models/product.model";
import { isNumber, isProduct } from "../utils/guards";
import { LoggerService } from "../services/logger.service";
import { 
  getAllProducts, getAvailableProducts, getProductById, insertProduct, updateProduct, 
  setProductUnavailable 
} from "../services/products.service";

export const productsController = Router();

// Get all available products (for any user)
productsController.get("/", (req: Request, res: Response) => {
  LoggerService.info("[GET] /products/");
  try {
    const products = getAvailableProducts();
    const productDTOs: ProductDTO[] = products.map(p => ({
      id: p.id!, // Non-null assertion since we know products from DB have ids
      name: p.name,
      price: p.price
    }));
    res.status(200).json(productDTOs);
  } catch (error) {
    LoggerService.error("Database error: " + error);
    res.status(500).json({ error: 'Error while fetching available products.' });
  }
});

// Get basic product info (for any user)
productsController.get("/basic/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  LoggerService.info(`[GET] /products/basic/${id}`);
  
  if (!isNumber(id)) {
    LoggerService.error("ID must be a number");
    return res.status(400).send("ID must be a number");
  }

  try {
    const product = getProductById(id);
    if (!product || product.status !== 'AVAILABLE') {
      return res.status(404).json({ error: "Product not found or unavailable" });
    }

    const productDTO: ProductDTO = {
      id: product.id!, // Non-null assertion since we know existing products have ids
      name: product.name,
      price: product.price
    };
    res.status(200).json(productDTO);
  } catch (error) {
    LoggerService.error("Database error: " + error);
    res.status(500).json({ error: "Error while fetching product." });
  }
});

// Get detailed product info (for any user)
productsController.get("/detail/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  LoggerService.info(`[GET] /products/detail/${id}`);
  
  if (!isNumber(id)) {
    LoggerService.error("ID must be a number");
    return res.status(400).send("ID must be a number");
  }

  try {
    const product = getProductById(id);
    if (!product || product.status !== 'AVAILABLE') {
      return res.status(404).json({ error: "Product not found or unavailable" });
    }

    const fullProductDTO: FullProductDTO = {
      id: product.id!, // Non-null assertion since we know existing products have ids
      name: product.name,
      price: product.price,
      description: product.description,
      categoryId: product.categoryId,
      status: product.status
    };
    res.status(200).json(fullProductDTO);
  } catch (error) {
    LoggerService.error("Database error: " + error);
    res.status(500).json({ error: "Error while fetching product details." });
  }
});

// ADMIN ROUTES

// Get all products (including unavailable - admin only)
productsController.get("/admin", (req: Request, res: Response) => {
  LoggerService.info("[GET] /products/admin");
  try {
    const products = getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    LoggerService.error("Database error: " + error);
    res.status(500).json({ error: 'Error while fetching all products.' });
  }
});

// Add new product (admin only)
productsController.post("/admin", (req: Request, res: Response) => {
  LoggerService.info("[POST] /products/admin");
  
  try {
    const newProduct = req.body;
    
    if (!newProduct || Object.keys(newProduct).length === 0) {
      LoggerService.error("Invalid product data");
      return res.status(400).send("Product data is required");
    }

    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
      LoggerService.error("Missing required fields");
      return res.status(400).send("Name, price and categoryId are required");
    }
    
    const createdProduct = insertProduct({
      ...newProduct,
      status: 'AVAILABLE'
    });
    
    LoggerService.info("Product created successfully");
    res.status(201).json(createdProduct);
  } catch (error) {
    LoggerService.error("Database error: " + error);
    res.status(500).json({ error: "Error while creating product." });
  }
});

// Update product (admin only)
productsController.put("/admin/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  LoggerService.info(`[PUT] /products/admin/${id}`);
  
  if (!isNumber(id)) {
    LoggerService.error("ID must be a number");
    return res.status(400).send("ID must be a number");
  }

  try {
    const productUpdate = req.body;
    
    if (!isProduct(productUpdate)) {
      LoggerService.error("Invalid product data");
      return res.status(400).send("Invalid product data");
    }

    if (id !== productUpdate.id) {
      LoggerService.error("ID mismatch");
      return res.status(400).send("ID in path doesn't match product ID");
    }

    const updatedProduct = updateProduct(productUpdate);
    res.status(200).json(updatedProduct);
  } catch (error) {
    LoggerService.error("Database error: " + error);
    res.status(500).json({ error: "Error while updating product." });
  }
});

// Set product as unavailable (admin only)
productsController.delete("/admin/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  LoggerService.info(`[DELETE] /products/admin/${id}`);
  
  if (!isNumber(id)) {
    LoggerService.error("Invalid or missing id");
    return res.status(400).send("Invalid or missing id");
  }

  try {
    const success = setProductUnavailable(id);
    res.status(200).json({ success });
  } catch (error) {
    LoggerService.error("Database error: " + error);
    res.status(500).json({ error: "Error while setting product unavailable." });
  }
});