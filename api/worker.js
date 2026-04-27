
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('/api/*', cors({ origin: '*' }));

// --- COLLECTIONS ---
app.get('/api/collections/:id', async (c) => {
  const id = c.req.param('id');
  const collection = await c.env.DB.prepare("SELECT * FROM Collections WHERE id = ?").bind(id).first();
  if (!collection) return c.json({ error: "Not found" }, 404);
  const { results: designs } = await c.env.DB.prepare(`
    SELECT D.*, S.name as shape_name, S.measurements, S.category as shape_category 
    FROM Designs D LEFT JOIN Shapes S ON D.shape_id = S.id WHERE D.collection_id = ?
  `).bind(id).all();
  return c.json({ 
    ...collection,
    themes: JSON.parse(collection.themes || '[]'),
    colours: JSON.parse(collection.colours || '[]'),
    designs: designs.map(d => ({ ...d, categories: JSON.parse(d.categories || '[]'), image_urls: JSON.parse(d.image_urls || '[]') }))
  });
});



// --- DESIGNS ---
app.post('/api/designs', async (c) => {
  const { collection_id, shape_id, name, image_urls, price, release_year, categories } = await c.req.json();
  await c.env.DB.prepare(
    "INSERT INTO Designs (collection_id, shape_id, name, image_urls, price, release_year, categories) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(collection_id, shape_id, name, JSON.stringify(image_urls), price, release_year, JSON.stringify(categories)).run();
  return c.json({ success: true }, 201);
});

app.put('/api/designs/:id', async (c) => {
  const id = c.req.param('id');
  const { collection_id, shape_id, name, image_urls, price, release_year, categories } = await c.req.json();
  await c.env.DB.prepare(
    "UPDATE Designs SET collection_id=?, shape_id=?, name=?, image_urls=?, price=?, release_year=?, categories=? WHERE id=?"
  ).bind(collection_id, shape_id, name, JSON.stringify(image_urls), price, release_year, JSON.stringify(categories), id).run();
  return c.json({ success: true });
});

// --- SHAPES ---
app.get('/api/shapes', async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM Shapes").all();
  
  // Map through results to parse the category string into a real array
  const formattedResults = results.map(shape => ({
    ...shape,
    category: JSON.parse(shape.category || '[]')
  }));
  
  return c.json(formattedResults);
});

app.post('/api/shapes', async (c) => {
  const { name, measurements, category } = await c.req.json();
  // Ensure category is stringified if it's an array, or kept as a string
  const categoryToStore = Array.isArray(category) ? JSON.stringify(category) : category;
  
  await c.env.DB.prepare("INSERT INTO Shapes (name, measurements, category) VALUES (?, ?, ?)")
    .bind(name, measurements, categoryToStore)
    .run();
    
  return c.json({ success: true }, 201);
});

export default app;