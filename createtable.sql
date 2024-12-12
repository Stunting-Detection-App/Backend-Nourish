CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    sessi_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE journals (
    journals_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    photo_url TEXT NOT NULL,
    description TEXT NOT NULL,
    latitude FLOAT NULL,
    longitude FLOAT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE predictions (
    prediction_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    height FLOAT NOT NULL,
    prediction JSON NOT NULL,
    result ENUM('Severely Stunted', 'Stunted', 'Normal', 'High') NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE predictions (
    prediction_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    height FLOAT NOT NULL,
    result ENUM('Severely Stunted', 'Stunted', 'Normal', 'High') NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



INSERT INTO nutrition (food, category, serving_size_g, calories, protein_g, fats_g, vitamin_a_iu, vitamin_c_mg, vitamin_d_iu, vitamin_e_mg, vitamin_b1_mg, vitamin_b2_mg, classification)
VALUES
    ('Chicken Breast', 'Meat', 100, 165, 31, 3.6, 0, 0, 0, 0, 7, 6, NULL),
    ('Salmon', 'Fish', 100, 206, 22, 12, 4, 0, 91, 1, 5, 22, NULL),
    ('Broccoli', 'Vegetables', 100, 55, 4, 0.6, 12, 135, 0, 4, 8, 7, NULL),
    ('Carrots', 'Vegetables', 100, 41, 0.9, 0.2, 334, 9, 0, 2, 4, 3, NULL),
    ('Apples', 'Fruits', 100, 52, 0.3, 0.2, 1, 8, 0, 1, 1, 1, NULL),
    ('Eggs', 'Dairy', 100, 155, 13, 11, 10, 0, 11, 5, 5, 15, NULL),
    ('Spinach', 'Vegetables', 100, 23, 2.9, 0.4, 56, 47, 0, 13, 4, 13, NULL),
    ('Beef', 'Meat', 100, 250, 26, 17, 0, 0, 1, 0, 8, 12, NULL),
    ('Oranges', 'Fruits', 100, 47, 0.9, 0.1, 4, 89, 0, 1, 2, 3, NULL),
    ('Banana', 'Fruits', 100, 89, 1.1, 0.3, 1, 15, 0, 1, 3, 5, NULL),
    ('Almonds', 'Seeds', 100, 575, 21, 50, 0, 0, 0, 175, 16, 60, NULL),
    ('Yogurt', 'Dairy', 100, 59, 10, 0.4, 0, 1, 10, 0, 8, 5, NULL),
    ('Sweet Potato', 'Vegetables', 100, 86, 1.6, 0.1, 283, 4, 0, 2, 7, 3, NULL),
    ('Quinoa', 'Grains', 100, 120, 4.1, 1.9, 0, 0, 0, 2, 12, 9, NULL),
    ('Oats', 'Grains', 100, 389, 16.9, 6.9, 0, 0, 0, 30, 14, 12, NULL),
    ('Potatoes', 'Vegetables', 100, 77, 2, 0.1, 0, 32, 0, 0, 8, 6, NULL),
    ('Tofu', 'Plant-based', 100, 76, 25.8, 4.8, 0, 0, 6, 6, 6, 8, NULL),
    ('Cucumber', 'Vegetables', 100, 16, 0.7, 0.1, 2, 14, 0, 1, 2, 2, NULL),
    ('Bell Pepper', 'Vegetables', 100, 31, 1, 0.3, 12, 213, 0, 3, 5, 6, NULL),
    ('Zucchini', 'Vegetables', 100, 17, 1.2, 0.3, 4, 28, 0, 4, 4, 4, NULL),
    ('Grapes', 'Fruits', 100, 69, 0.7, 0.2, 1, 4, 0, 1, 1, 1, NULL),
    ('Kiwi', 'Fruits', 100, 61, 1.1, 0.5, 2, 154, 0, 7, 3, 3, NULL),
    ('Pineapple', 'Fruits', 100, 50, 0.5, 0.1, 1, 79, 0, 1, 2, 2, NULL),
    ('Mango', 'Fruits', 100, 60, 0.8, 0.4, 21, 60, 0, 2, 4, 3, NULL),
    ('Cherries', 'Fruits', 100, 63, 1.1, 0.2, 1, 16, 0, 2, 3, 3, NULL),
    ('Peas', 'Vegetables', 100, 81, 5.4, 0.4, 2, 67, 0, 2, 15, 14, NULL),
    ('Cabbage', 'Vegetables', 100, 25, 1.3, 0.1, 3, 54, 0, 2, 3, 4, NULL),
    ('Radishes', 'Vegetables', 100, 16, 0.7, 0.1, 0, 18, 0, 1, 2, 2, NULL),
    ('Brown Rice', 'Grains', 100, 111, 2.6, 0.9, 0, 0, 0, 8, 4, 6, NULL),
    ('White Rice', 'Grains', 100, 130, 2.7, 0.3, 0, 0, 0, 0, 4, 4, NULL),
    ('Barley', 'Grains', 100, 352, 12.5, 2.3, 0, 0, 0, 20, 17, 10, NULL),
    ('Shrimp', 'Meat', 100, 85, 24, 1, 1, 0, 0, 5, 5, 5, NULL),
    ('Cauliflower', 'Vegetables', 100, 2, 2, 0.3, 0, 77, 0, 1, 3, 4, NULL),
    ('Avocado', 'Fruits', 100, 160, 2, 15, 7, 16, 0, 10, 6, 10, NULL),
    ('Peanut Butter', 'Seeds', 100, 588, 25, 50, 0, 0, 0, 17, 12, 15, NULL),
    ('Milk', 'Dairy', 100, 61, 3.2, 3.3, 5, 0, 1, 0, 2, 8, NULL),
    ('Blueberries', 'Fruits', 100, 553, 0.8, 0.2, 0, 0, 4.44, 10.52, 0.91, 0.1, NULL),
    ('Soybeans', 'Seeds', 100, 72, 18, 45, 2, 0, 36.94, 17.64, 1.81, 1.34, NULL),
    ('Watermelon', 'Fruits', 100, 357, 13, 3.2, 0, 0, 29.18, 17.91, 1.83, 1.05, NULL),
    ('Guava', 'Fruits', 100, 68, 2.6, 0.95, 624, 5.4, 0, 0.74, 0.067, 0.04, NULL),
    ('Peach', 'Fruits', 100, 202, 2, 2.6, 154, 0, 48.86, 7.89, 0.11, 0.02, NULL);