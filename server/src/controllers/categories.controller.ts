import { Request, Response, Router } from "express";
import { Category, CategoryDTO, FullCategoryDTO } from "../models/category.model";
import { isNumber, isCategory } from "../utils/guards";
import { products } from "./products.controller";

export const categoriesController = Router();

// Mock data
let categories: Category[] = [
  { id: 1, name: "Furniture", description: "Various furniture items", status: 'AVAILABLE' },
  { id: 2, name: "Lighting", description: "Lamps and light fixtures", status: 'AVAILABLE' },
  { id: 3, name: "Decor", description: "Home decoration items", status: 'AVAILABLE' }
];

// Get all categories (for any user)
categoriesController.get("/", (req: Request, res: Response) => {
  console.log("[GET] /categories/");
  const categoryDTOs: CategoryDTO[] = categories
    .filter(c => c.status === 'AVAILABLE')
    .map(c => ({ id: c.id, name: c.name }));
  res.json(categoryDTOs).status(200);
});

// Get basic category info (for any user)
categoriesController.get("/basic/:id", (req: Request, res: Response) => {
  console.log("[GET] /categories/basic/:id");
  const id = parseInt(req.params.id);
  
  if (!isNumber(id)) {
    return res.status(400).send("ID must be a number");
  }

  const category = categories.find(c => c.id === id);
  if (!category || category.status !== 'AVAILABLE') {
    return res.status(404).send("Category not found");
  }

  const categoryDTO: CategoryDTO = {
    id: category.id,
    name: category.name
  };
  res.status(200).json(categoryDTO);
});

// ADMIN ROUTES

// Get all categories (including unavailable - admin only)
categoriesController.get("/admin", (req: Request, res: Response) => {
  console.log("[GET] /categories/admin");
  res.json(categories).status(200);
});

// Get basic category info (admin only)
categoriesController.get("/admin/basic/:id", (req: Request, res: Response) => {
  console.log("[GET] /categories/admin/basic/:id");
  const id = parseInt(req.params.id);
  
  if (!isNumber(id)) {
    return res.status(400).send("ID must be a number");
  }

  const category = categories.find(c => c.id === id);
  if (!category) {
    return res.status(404).send("Category not found");
  }

  const categoryDTO: CategoryDTO = {
    id: category.id,
    name: category.name
  };
  res.status(200).json(categoryDTO);
});

// Get detailed category info (admin only)
categoriesController.get("/admin/detail/:id", (req: Request, res: Response) => {
  console.log("[GET] /categories/admin/detail/:id");
  const id = parseInt(req.params.id);
  
  if (!isNumber(id)) {
    return res.status(400).send("ID must be a number");
  }

  const category = categories.find(c => c.id === id);
  if (!category) {
    return res.status(404).send("Category not found");
  }

  const fullCategoryDTO: FullCategoryDTO = {
    id: category.id,
    name: category.name,
    description: category.description,
    status: category.status
  };
  res.status(200).json(fullCategoryDTO);
});

// Add new category (admin only)
categoriesController.post("/admin", (req: Request, res: Response) => {
  console.log("[POST] /categories/admin");
  const category: Category = req.body;
  
  if (!isCategory(category)) {
    return res.status(400).send("Invalid category data");
  }

  category.id = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
  category.status = 'AVAILABLE';
  categories.push(category);
  res.status(201).json(category);
});

// Update category (admin only)
categoriesController.put("/admin/:id", (req: Request, res: Response) => {
  console.log("[PUT] /categories/admin/:id");
  const id = parseInt(req.params.id);
  const updatedCategory: Category = req.body;
  
  if (!isNumber(id) || !isCategory(updatedCategory) || id !== updatedCategory.id) {
    return res.status(400).send("Invalid data");
  }

  const index = categories.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).send("Category not found");
  }

  categories[index] = updatedCategory;
  res.status(200).json(updatedCategory);
});

// Set category as unavailable (admin only)
categoriesController.delete("/admin/:id", (req: Request, res: Response) => {
  console.log("[DELETE] /categories/admin/:id");
  const id = parseInt(req.params.id);
  
  if (!isNumber(id)) {
    return res.status(400).send("ID must be a number");
  }

  const category = categories.find(c => c.id === id);
  if (!category) {
    return res.status(404).send("Category not found");
  }

  // Set category as unavailable
  category.status = 'UNAVAILABLE';
  
  // Set all products in this category as unavailable
  products.forEach(p => {
    if (p.categoryId === id) {
      p.status = 'UNAVAILABLE';
    }
  });

  res.status(200).json(category);
});