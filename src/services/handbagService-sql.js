// Configuration: Point to your Cloudflare Worker URL or localhost
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:8787' 
  : 'vendula-handbags-api.mysterym3.workers.dev'; // UPDATE WITH YOUR URL

// Helper for requests
const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return response.json();
};

// --- COLLECTIONS ---
export const fetchAllCollections = () => apiFetch('/api/collections');

export const fetchCollectionById = (id) => apiFetch(`/api/collections/${id}`);

// --- DESIGNS ---
export const addDesign = (data) => apiFetch('/api/designs', {
  method: 'POST',
  body: JSON.stringify(data)
});

export const updateDesign = (id, data) => apiFetch(`/api/designs/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data)
});

// --- SHAPES ---
export const fetchShapes = () => apiFetch('/api/shapes');