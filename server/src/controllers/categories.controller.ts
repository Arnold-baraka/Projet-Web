import { Request, Response, Router } from "express";
import { Category, CategoryDTO, FullCategoryDTO } from "../models/category.model";
import { isNumber, isCategory } from "../utils/guards";
import { LoggerService } from "../services/logger.service";
import { setProductsUnavailableByCategory } from "../services/products.service";

export const categoriesController = Router();

// Mock data
let categories: Category[] = [
  { id: 1, name: "Furniture", description: "Various furniture items", status: 'AVAILABLE' },
  { id: 2, name: "Lighting", description: "Lamps and light fixtures", status: 'AVAILABLE' },
  { id: 3, name: "Decor", description: "Home decoration items", status: 'AVAILABLE' }
];

// Get all categories (for any user)
categoriesController.get("/", (req: Request, res: Response) => {
  LoggerService.info("[GET] /categories/");
  try {
    const categoryDTOs: CategoryDTO[] = categories
      .filter(c => c.status === 'AVAILABLE')
      .map(c => ({ id: c.id, name: c.name }));
    res.status(200).json(categoryDTOs);
  } catch (error) {
    LoggerService.error("Error fetching categories: " + error);
    res.status(500).json({ error: 'Error while fetching categories.' });
  }
});

// Get basic category info (for any user)
categoriesController.get("/basic/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  LoggerService.info(`[GET] /categories/basic/${id}`);
  
  if (!isNumber(id)) {
    LoggerService.error("ID must be a number");
    return res.status(400).send("ID must be a number");
  }

  try {
    const category = categories.find(c => c.id === id);
    if (!category || category.status !== 'AVAILABLE') {
      LoggerService.error(`Category with id ${id} not found or unavailable`);
      return res.status(404).send("Category not found");
    }

    const categoryDTO: CategoryDTO = {
      id: category.id,
      name: category.name
    };
    res.status(200).json(categoryDTO);
  } catch (error) {
    LoggerService.error(`Error fetching category with id ${id}: ` + error);
    res.status(500).json({ error: "Error while fetching category." });
  }
});

// ADMIN ROUTES

// Get all categories (including unavailable - admin only)
categoriesController.get("/admin", (req: Request, res: Response) => {
  LoggerService.info("[GET] /categories/admin");
  try {
    res.status(200).json(categories);
  } catch (error) {
    LoggerService.error("Error fetching all categories: " + error);
    res.status(500).json({ error: 'Error while fetching all categories.' });
  }
});

// Add new category (admin only)
categoriesController.post("/admin", (req: Request, res: Response) => {
  LoggerService.info("[POST] /categories/admin");
  
  try {
    const category: Category = req.body;
    
    if (!isCategory(category)) {
      LoggerService.error("Invalid category data");
      return res.status(400).send("Invalid category data");
    }

    category.id = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    category.status = 'AVAILABLE';
    categories.push(category);
    LoggerService.info(`Category created with id ${category.id}`);
    res.status(201).json(category);
  } catch (error) {
    LoggerService.error("Error creating category: " + error);
    res.status(500).json({ error: "Error while creating category." });
  }
});

// Update category (admin only)
categoriesController.put("/admin/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  LoggerService.info(`[PUT] /categories/admin/${id}`);
  
  try {
    const updatedCategory: Category = req.body;
    
    if (!isNumber(id) || !isCategory(updatedCategory) || id !== updatedCategory.id) {
      LoggerService.error("Invalid data for category update");
      return res.status(400).send("Invalid data");
    }

    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      LoggerService.error(`Category with id ${id} not found for update`);
      return res.status(404).send("Category not found");
    }

    categories[index] = updatedCategory;
    LoggerService.info(`Category with id ${id} updated`);
    res.status(200).json(updatedCategory);
  } catch (error) {
    LoggerService.error(`Error updating category with id ${id}: ` + error);
    res.status(500).json({ error: "Error while updating category." });
  }
});

// Set category as unavailable (admin only)
categoriesController.delete("/admin/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  LoggerService.info(`[DELETE] /categories/admin/${id}`);
  
  try {
    if (!isNumber(id)) {
      LoggerService.error("Invalid category ID");
      return res.status(400).send("ID must be a number");
    }

    const category = categories.find(c => c.id === id);
    if (!category) {
      LoggerService.error(`Category with id ${id} not found`);
      return res.status(404).send("Category not found");
    }

    // Set category as unavailable
    category.status = 'UNAVAILABLE';
    
    // Set all products in this category as unavailable via service
    setProductsUnavailableByCategory(id);
    
    LoggerService.info(`Category with id ${id} and its products set to unavailable`);
    res.status(200).json(category);
  } catch (error) {
    LoggerService.error(`Error setting category with id ${id} as unavailable: ` + error);
    res.status(500).json({ error: "Error while setting category unavailable." });
  }
});