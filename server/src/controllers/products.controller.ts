import { Request, Response, Router } from "express";
import { Product, ProductDTO, FullProductDTO } from "../models/product.model";
import { isNumber, isProduct } from "../utils/guards";

export const productsController = Router();

// Mock data
export let products: Product[] = [
  { id: 1, name: "Comfy Chair", description: "A very comfortable chair", price: 199.99, categoryId: 1, status: 'AVAILABLE' },
  { id: 2, name: "Wooden Table", description: "Solid oak dining table", price: 499.99, categoryId: 1, status: 'AVAILABLE' },
  { id: 3, name: "Modern Lamp", description: "Sleek designer lamp", price: 89.99, categoryId: 2, status: 'AVAILABLE' }
];

// Get all products (for any user)
productsController.get("/", (req: Request, res: Response) => {
  console.log("[GET] /products/");
  const productDTOs: ProductDTO[] = products
    .filter(p => p.status === 'AVAILABLE')
    .map(p => ({ id: p.id, name: p.name, price: p.price }));
  res.json(productDTOs).status(200);
});

// Get basic product info (for any user)
productsController.get("/basic/:id", (req: Request, res: Response) => {
  console.log("[GET] /products/basic/:id");
  const id = parseInt(req.params.id);
  
  if (!isNumber(id)) {
    return res.status(400).send("ID must be a number");
  }

  const product = products.find(p => p.id === id);
  if (!product || product.status !== 'AVAILABLE') {
    return res.status(404).send("Product not found");
  }

  const productDTO: ProductDTO = {
    id: product.id,
    name: product.name,
    price: product.price
  };
  res.status(200).json(productDTO);
});

// Get detailed product info (for any user)
productsController.get("/detail/:id", (req: Request, res: Response) => {
  console.log("[GET] /products/detail/:id");
  const id = parseInt(req.params.id);
  
  if (!isNumber(id)) {
    return res.status(400).send("ID must be a number");
  }

  const product = products.find(p => p.id === id);
  if (!product || product.status !== 'AVAILABLE') {
    return res.status(404).send("Product not found");
  }

  const fullProductDTO: FullProductDTO = {
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
productsController.get("/admin", (req: Request, res: Response) => {
  console.log("[GET] /products/admin");
  // In a real app, check if user is admin
  res.json(products).status(200);
});

// Get basic product info (admin only)
productsController.get("/admin/basic/:id", (req: Request, res: Response) => {
  console.log("[GET] /products/admin/basic/:id");
  const id = parseInt(req.params.id);
  
  if (!isNumber(id)) {
    return res.status(400).send("ID must be a number");
  }

  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).send("Product not found");
  }

  const productDTO: ProductDTO = {
    id: product.id,
    name: product.name,
    price: product.price
  };
  res.status(200).json(productDTO);
});

// Get detailed product info (admin only)
productsController.get("/admin/detail/:id", (req: Request, res: Response) => {
  console.log("[GET] /products/admin/detail/:id");
  const id = parseInt(req.params.id);
  
  if (!isNumber(id)) {
    return res.status(400).send("ID must be a number");
  }

  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).send("Product not found");
  }

  const fullProductDTO: FullProductDTO = {
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
productsController.post("/admin", (req: Request, res: Response) => {
  console.log("[POST] /products/admin");
  const product: Product = req.body;
  
  if (!isProduct(product)) {
    return res.status(400).send("Invalid product data");
  }

  product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  product.status = 'AVAILABLE';
  products.push(product);
  res.status(201).json(product);
});

// Update product (admin only)
productsController.put("/admin/:id", (req: Request, res: Response) => {
  console.log("[PUT] /products/admin/:id");
  const id = parseInt(req.params.id);
  const updatedProduct: Product = req.body;
  
  if (!isNumber(id) || !isProduct(updatedProduct) || id !== updatedProduct.id) {
    return res.status(400).send("Invalid data");
  }

  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).send("Product not found");
  }

  products[index] = updatedProduct;
  res.status(200).json(updatedProduct);
});

// Set product as unavailable (admin only)
productsController.delete("/admin/:id", (req: Request, res: Response) => {
  console.log("[DELETE] /products/admin/:id");
  const id = parseInt(req.params.id);
  
  if (!isNumber(id)) {
    return res.status(400).send("ID must be a number");
  }

  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).send("Product not found");
  }

  product.status = 'UNAVAILABLE';
  res.status(200).json(product);
});