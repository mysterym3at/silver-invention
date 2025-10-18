import React, { useState, useEffect } from "react";
import DesignService from "../services/designService";
import { Box } from "@mui/material";

const styles = {
  container: {
    maxWidth: 900,
    margin: "auto",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 14px",
    fontSize: 14,
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    marginRight: 10,
  },
  buttonPrimary: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  buttonSecondary: {
    backgroundColor: "#6c757d",
    color: "#fff",
  },
  designsList: {
    listStyle: "none",
    paddingLeft: 0,
  },
  designItem: {
    padding: 10,
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  designName: {
    fontWeight: "bold",
  },
    designSeason: {
    fontStyle: "italic",
  },
};
const Designs = () => {
  const [designs, setDesigns] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [shape, setShape] = useState("");
  const [price, setPrice] = useState(null);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [shapeId, setShapeId] = useState("");
  const [rangeId, setRangeId] = useState("");
  const [favourite, setFavourite] = useState(false);

  function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const data = await DesignService.getAllDesigns();
      setDesigns(data);
    } catch (error) {
      console.error("Failed to fetch designs", error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setShape("");
    setPrice(null);
    setCategories([]);
    setImages([]);
    setShapeId("");
    setRangeId("");
    setFavourite(false);
  };

  const startEdit = (design) => {
    setEditingId(design.designId);
    setName(design.name || "");
    setShape(design.shape || "");
    setPrice(design.price ?? null);
    setCategories(Array.isArray(design.details.categories) ? design.details.categories : []);
    setImages(Array.isArray(design.images) ? design.images : []);
    setShapeId(design.details?.shapeId || "");
    setRangeId(design.ranges?.rangeId || "");
    setFavourite(design.favourite || false);
  };

  const handleAddOrUpdateDesign = async () => {
    if (!name.trim()) return alert("Name is required");

    const designData = {
      name: name.trim(),
      shape: shape.trim(),
      price: price !== null ? Number(price) : null,
      categories: categories.filter(Boolean),
      images: images.filter(Boolean),
      rangeId: rangeId.trim(),
      favourite,
      details: shapeId ? { shape: { id: shapeId } } : {},
      collection: rangeId ? { range : { id: rangeId } } : {}
    };

    try {
      if (editingId) {
        await DesignService.updateDesign(editingId, designData);
      } else {
        await DesignService.addDesign(designData);
      }
      resetForm();
      fetchDesigns();
    } catch (error) {
      console.error("Error saving design", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{editingId ? "Edit Design" : "Add Design"}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddOrUpdateDesign();
        }}
      >
         <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        </div>
        {/* <input
          type="text"
          placeholder="Shape"
          value={shape}
          onChange={(e) => setShape(e.target.value)}
        /> */}
        <input
          type="number"
          placeholder="Price"
          value={price !== null ? price : ""}
          onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : null)}
        />
        <input
          type="text"
          placeholder="Categories (comma separated)"
          value={categories.join(", ")}
          onChange={(e) => setCategories(e.target.value.split(",").map((c) => c.trim()))}
        />
        <input
          type="text"
          placeholder="Images (comma separated)"
          value={images.join(", ")}
          onChange={(e) => setImages(e.target.value.split(",").map((u) => u.trim()))}
        />
        <input
          type="text"
          placeholder="Shape Firestore doc ID"
          value={shapeId}
          onChange={(e) => setShapeId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Range Firestore doc ID"
          value={rangeId}
          onChange={(e) => setRangeId(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={favourite}
            onChange={(e) => setFavourite(e.target.checked)}
          />
          Favourite
        </label>
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        <button type="button" onClick={resetForm}>Clear</button>
      </form>

      <h2>Designs List</h2>
      <ul style={styles.designsList}>
       {[...designs].sort((a, b) => a.name.localeCompare(b.name)).map((design) => (
  <li key={design.designId} style={styles.designItem}>
             <span style={styles.designName}> {design.name}</span> 
             <small>({design.designId}){""}</small>
                {design.collection && (
                <div style={styles.designSeason}>
                    <span style={{ marginRight: 20 }}> {design.collection.season} </span>  <span style={{ marginRight: 20,marginLeft: 20 }}> {design.collection.name}</span> 
                 </div>
                
              )}
            {Array.isArray(design.images) && design.images.length > 0 && (
              <Box component="span" sx={{ ml: 1, max: 5, display: "flex", gap: 1, alignItems: "left" }}>
                {[...new Set(design.images)] // remove duplicates
                .filter((url) => (url.includes("_front.") || url.includes("_back.")  || url.includes("rockamilly") || url.includes("lovelyboutique")|| url.includes("lovepersimmon")) )
                
                  .map((url, i) => (

                    <img
                      key={i}
                      src={url}
                      alt={`${design.name} image ${i + 1}`}
                      style={{ maxHeight: "200px", maxWidth: "200px", objectFit: "contain" }}
                    />
                  ))}
              </Box>
            )}
            <button onClick={() => startEdit(design)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Designs;
