
-- 1. Table for Collections
CREATE TABLE IF NOT EXISTS Collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL,
    description TEXT,
    season TEXT,
    series TEXT, 
    edition TEXT,
    release_year INTEGER,
    themes TEXT,
    colours TEXT,
    name_friendly TEXT
);

-- 2. Table for Shapes
CREATE TABLE IF NOT EXISTS Shapes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    measurements TEXT,
    category TEXT,
    name_friendly TEXT,
    size TEXT,
    description TEXT
);

-- 3. Table for Designs
CREATE TABLE IF NOT EXISTS Designs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection_id INTEGER NOT NULL,
    shape_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    image_urls TEXT,
    price REAL,
    release_year INTEGER,
    categories TEXT, -- Optional extra tags for a design
    FOREIGN KEY (collection_id) REFERENCES Collections(id) ON DELETE CASCADE,
    FOREIGN KEY (shape_id) REFERENCES Shapes(id) ON DELETE SET NULL
);

-- 4. Performance index
CREATE INDEX IF NOT EXISTS idx_designs_collection_id ON Designs(collection_id);
CREATE INDEX IF NOT EXISTS idx_designs_shape_id ON Designs(shape_id);