
-- make uuid work,
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ADMIN/CUSTOMER TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(200) NOT NULL UNIQUE, 
    user_password VARCHAR(255) NOT NULL,
    user_role VARCHAR(30) NOT NULL CHECK (user_role IN("admin", "admins", "administrator", "administrators", "customer", "customers")) ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- AUTH TABLE FOR SESSION TOKENS - make token unique
CREATE TABLE IF NOT EXISTS auth (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
    user_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- DISH TABLE
CREATE TABLE IF NOT EXISTS dish (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
    user_id UUID REFERENCES users(id) NOT NULL,
    dish_name VARCHAR(100) NOT NULL,
    dish_description VARCHAR(255) NOT NULL, 
    dish_image VARCHAR(255) NOT NULL, 
    dish_price NUMERIC(10, 2) NOT NULL CHECK( dish_price >= 0 AND dish_price <= 10000 ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- IMAGES TABLE
CREATE TABLE IF NOT EXISTS dish_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    dish_id UUID REFERENCES dish(id) NOT NULL,
    image_path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- RATING'S TABLE
CREATE TABLE IF NOT EXISTS ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    dish_id UUID REFERENCES dish(id) NOT NULL,
    rate NUMERIC(4, 1) NOT NULL CHECK ( rate >= 0 AND rate <= 5 ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


-- END USER SESSION, REMOVE TOKEN FROM AUTH TABLE
DELETE FROM auth WHERE user_id='fccvghbj' AND user_token='gvbhjn';