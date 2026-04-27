import React, { useState, useEffect } from "react";
import * as HandbagService from "../services/handbagService-sql.js";
import {
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
  Container,
  Paper,
  Divider,
} from "@mui/material";

const Handbags = () => {
  // --- STATE ---
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [designs, setDesigns] = useState([]);

  // --- LOAD DATA ---
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Fetch collections and shapes concurrently for efficiency
      const [colData, shapeData] = await Promise.all([
        HandbagService.fetchAllCollections(),
        HandbagService.fetchShapes()
      ]);
      setCollections(colData);
      setShapes(shapeData);
      
      // Select the first collection by default
      if (colData.length > 0) setSelectedCollectionId(colData[0].id);
    } catch (err) {
      console.error("Failed to load initial data:", err);
    }
  };

  // --- LOAD DESIGNS FOR SELECTED COLLECTION ---
  useEffect(() => {
    if (selectedCollectionId) {
      loadCollectionDesigns(selectedCollectionId);
    }
  }, [selectedCollectionId]);

  const loadCollectionDesigns = async (id) => {
    try {
      const data = await HandbagService.fetchCollectionById(id);
      setDesigns(data.designs || []);
    } catch (err) {
      console.error("Failed to load designs:", err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Vendula Handbags Manager</Typography>
      
      {/* --- COLLECTION SELECTOR --- */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Select Collection</Typography>
        <Autocomplete
          options={collections}
          getOptionLabel={(option) => option.name}
          value={collections.find(c => c.id === selectedCollectionId) || null}
          onChange={(e, newValue) => setSelectedCollectionId(newValue?.id || null)}
          renderInput={(params) => <TextField {...params} label="Collection" />}
        />
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* --- DESIGNS LIST --- */}
      <Typography variant="h5">Designs in Collection</Typography>
      {designs.map(design => (
        <Paper key={design.id} sx={{ p: 2, my: 1 }}>
          <Typography variant="body1"><strong>{design.name}</strong> - Price: £{design.price}</Typography>
          <Typography variant="body2">Shape: {design.shape_name}</Typography>
        </Paper>
      ))}
    </Container>
  );
};

export default Handbags;