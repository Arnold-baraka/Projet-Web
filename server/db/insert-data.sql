-- Categories and Products tables with relationships

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
                                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          name VARCHAR(255) NOT NULL,
                                          description TEXT,
                                          status VARCHAR(50) NOT NULL CHECK (status IN ('AVAILABLE', 'UNAVAILABLE')),
                                          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table with foreign key to categories
CREATE TABLE IF NOT EXISTS products (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        name VARCHAR(255) NOT NULL,
                                        description TEXT,
                                        price DECIMAL(10, 2) NOT NULL,
                                        categoryId INTEGER NOT NULL,
                                        status VARCHAR(50) NOT NULL CHECK (status IN ('AVAILABLE', 'UNAVAILABLE')),
                                        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Insert initial categories
INSERT INTO categories (name, description, status) VALUES
                                                       ('Furniture', 'Various furniture items', 'AVAILABLE'),
                                                       ('Lighting', 'Lamps and light fixtures', 'AVAILABLE'),
                                                       ('Decor', 'Home decoration items', 'AVAILABLE');

-- Insert initial products
INSERT INTO products (name, description, price, categoryId, status) VALUES
                                                                        ('Comfy Chair', 'A very comfortable chair', 199.99, 1, 'AVAILABLE'),
                                                                        ('Wooden Table', 'Solid oak dining table', 499.99, 1, 'AVAILABLE'),
                                                                        ('Modern Lamp', 'Sleek designer lamp', 89.99, 2, 'AVAILABLE'),
                                                                        ('Leather Sofa', 'Luxurious leather sofa for your living room', 899.99, 1, 'AVAILABLE'),
                                                                        ('Bookshelf', 'Spacious wooden bookshelf', 149.99, 1, 'AVAILABLE'),
                                                                        ('Bed Frame', 'Modern king-size bed frame', 599.99, 1, 'AVAILABLE'),
                                                                        ('Desk Lamp', 'LED desk lamp with adjustable brightness', 39.99, 2, 'AVAILABLE'),
                                                                        ('Nightstand', 'Two-drawer wooden nightstand', 89.99, 1, 'AVAILABLE'),
                                                                        ('Rug', 'Soft area rug with modern pattern', 129.99, 3, 'AVAILABLE'),
                                                                        ('Curtains', 'Light-blocking window curtains', 59.99, 3, 'AVAILABLE');

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(categoryId);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_categories_status ON categories(status);

-- View for available products with category names
CREATE VIEW available_products_view AS
SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    c.name AS categoryName,
    p.status
FROM
    products p
        JOIN
    categories c ON p.categoryId = c.id
WHERE
    p.status = 'AVAILABLE' AND c.status = 'AVAILABLE';

-- View for admin with all product details
CREATE VIEW admin_products_view AS
SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    p.categoryId,
    c.name AS categoryName,
    p.status,
    p.createdAt,
    p.updatedAt
FROM
    products p
        LEFT JOIN
    categories c ON p.categoryId = c.id;