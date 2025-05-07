CREATE TABLE Users (
                       user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                       username TEXT NOT NULL UNIQUE,
                       email TEXT NOT NULL UNIQUE,
                       password_hash TEXT NOT NULL,
                       role TEXT CHECK(role IN ('visitor', 'client', 'administrator')) NOT NULL,
                       status TEXT CHECK(status IN ('ENABLED', 'DISABLED')) NOT NULL
);

CREATE TABLE Categories (
                            category_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            category_name TEXT NOT NULL UNIQUE,
                            status TEXT CHECK(status IN ('AVAILABLE', 'UNAVAILABLE')) NOT NULL
);

CREATE TABLE Products (
                          product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                          product_name TEXT NOT NULL,
                          description TEXT,
                          price REAL NOT NULL,
                          category_id INTEGER NOT NULL,
                          status TEXT CHECK(status IN ('AVAILABLE', 'UNAVAILABLE')) NOT NULL,
                          FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Orders (
                        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        status TEXT CHECK(status IN ('NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED')) NOT NULL,
                        order_date DATETIME,
                        FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Order_Items (
                             order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                             order_id INTEGER NOT NULL,
                             product_id INTEGER NOT NULL,
                             quantity INTEGER NOT NULL CHECK(quantity > 0),
                             unit_price REAL NOT NULL,
                             FOREIGN KEY (order_id) REFERENCES Orders(order_id),
                             FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

CREATE TABLE Tickets (
                         ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
                         user_id INTEGER NOT NULL,
                         order_id INTEGER NOT NULL,
                         title TEXT NOT NULL,
                         description TEXT NOT NULL,
                         status TEXT CHECK(status IN ('NEW', 'IN_PROGRESS', 'CLOSED')) NOT NULL,
                         FOREIGN KEY (user_id) REFERENCES Users(user_id),
                         FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);