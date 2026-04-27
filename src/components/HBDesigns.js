import React, { useState, useEffect } from "react";
import HBDesignService from "../services/hbdesignService.js";
import { Box } from "@mui/material";


//const [searchTerm, setSearchTerm] = useState("");

const HBDesigns = () => {
  const [handbags, setHandbags] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [filteredHandbags, setFilteredHandbags] = useState([]);
    // Single combined search input
const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHandbags();
  }, []);


  const fetchHandbags = async () => {
    try {
      const data = await HBDesignService.getAllHandbags();
      const sortedData = data.sort((a, b) => {
        const nameA = a.name?.toLowerCase() || "";
        const nameB = b.name?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      });
      setHandbags(sortedData);
    } catch (error) {
      console.error("Failed to fetch handbags:", error);
    }
  };

   useEffect(() => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) {
        setFilteredHandbags(handbags);
        return;
      }
      
      const filtered = handbags.filter((h) => {
        // Check in handbag name
        const inName = typeof h.name === "string" && h.name.toLowerCase().includes(term);
        
        // Check in range
        const inRange = typeof h.range === "string" && h.range.toLowerCase().includes(term);

          // Check in range
        const inInfo = typeof h.productInfo === "string" && h.productInfo.toLowerCase().includes(term);
        
        // Check in season
        const inSeason = typeof h.season === "string" && h.season.toLowerCase().includes(term);
        
        // Check colors array
        const colors = Array.isArray(h.variations?.color) ? h.variations.color : [];
        const inColors = colors.some((c) => c.toLowerCase().includes(term));
        
        // Check designs for any matches (name or shape)
        const designs = h.details?.shapeId || [];
        const inDesignNameOrShape = designs.some((d) => {
          return (
            (typeof d.name === "string" && d.name.toLowerCase().includes(term)) ||
            (typeof d.shape === "string" && d.shape.toLowerCase().includes(term))
          );
        });
        
        // Return true if found in any field
        return inName || inRange || inSeason || inInfo || inDesignNameOrShape;
      });
      
      // Sort by releaseDate descending after filtering
      // filtered.sort((a, b) => {
      //   const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
      //   const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
      //   return dateB - dateA;
      // });
      
      setFilteredHandbags(filtered);
    }, [searchTerm, handbags]);
  

  const startEditing = (docId) => {
    const hb = handbags.find((h) => h.id === docId);
    if (hb) {
      setEditingId(docId);
      setEditValues({ ...hb, price: hb.price || "", images: hb.images || [] });
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleFieldChange = (field) => (e) => {
    let value = e.target.value;
    if (field === "images") {
      value = value.split(",").map((x) => x.trim()).filter(Boolean);
    }
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editValues.name) {
      alert("Name is required");
      return;
    }
    try {
      await HBDesignService.updateHandbag(editValues.designId || editValues.id, editValues);
      setEditingId(null);
      setEditValues({});
      fetchHandbags();
    } catch (error) {
      console.error("Error saving handbag:", error);
    }
  };

  const handleDelete = async (deleteId, designId) => {
    if (!window.confirm("Delete this handbag?")) return;
    try {
      // Always use `designId` as document ID for Firestore delete
      await HBDesignService.deleteHandbag(designId || deleteId);
      fetchHandbags();
      // If currently editing this row, exit edit mode
      if (editingId === deleteId) {
        cancelEditing();
      }
    } catch (error) {
      console.error("Error deleting handbag:", error);
    }
  };

  return (
    
    <div style={{ maxWidth: 900, margin: "auto", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2>Handbags</h2>
          <input
        type="text"
        placeholder="Search by handbag name, design, shape, range, colors, or season..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 20, fontSize: 16 }}
        aria-label="Search handbags and designs"
        autoFocus
      />

      
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
         {filteredHandbags.length === 0 && <p>No results found.</p>}
          {filteredHandbags.map((hb) => (
       
          <li key={hb.id} style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
            {editingId === hb.id ? (
              <div >
                <input
                  type="text"
                  value={editValues.name}
                  onChange={handleFieldChange("name")}
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  value={editValues.designId}
                  onChange={handleFieldChange("designId")}
                  placeholder="Design ID"
                />
                <input
                  type="text"
                  value={editValues.id}
                  onChange={handleFieldChange("id")}
                  placeholder="ID"
                />
                <input
                  type="text"
                  value={editValues.price}
                  onChange={handleFieldChange("price")}
                  placeholder="Price"
                />
                <input
                  type="text"
                  value={editValues.images.join(", ")}
                  onChange={handleFieldChange("images")}
                  placeholder="Image URLs (comma separated)"
                />
                <input
                  type="text"
                  value={editValues.measurements || ""}
                  onChange={handleFieldChange("measurements")}
                  placeholder="Measurements"
                />
                <input
                  type="text"
                  value={editValues.productInfo || ""}
                  onChange={handleFieldChange("productInfo")}
                  placeholder="Product Info"
                />
                <input
                  type="text"
                  value={editValues.year || ""}
                  onChange={handleFieldChange("year")}
                  placeholder="Year"
                />
                <input
                  type="text"
                  value={editValues.releaseDate || ""}
                  onChange={handleFieldChange("releaseDate")}
                  placeholder="Release Date"
                />
                <input
                  type="text"
                  value={editValues.season || ""}
                  onChange={handleFieldChange("season")}
                  placeholder="Season"
                />
                <input
                  type="text"
                  value={editValues.shape || ""}
                  onChange={handleFieldChange("shape")}
                  placeholder="Shape"
                />
                <input
                  type="text"
                  value={editValues.range || ""}
                  onChange={handleFieldChange("range")}
                  placeholder="Range"
                />
                <div style={{ gridColumn: "span 3", display: "flex", gap: 8 }}>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                  <button
                    style={{ color: "red" }}
                    onClick={() => handleDelete(editValues.id, editValues.designId)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontWeight: "bold" }}>{hb.name}</div>
                <div className="design-id">{hb.designId}</div>
                <div>Price: £{hb.price}</div>
                {Array.isArray(hb.images) && hb.images.length > 0 && (
                  <Box component="span" sx={{ ml: 1, max: 25, display: "flex", gap: 1, alignItems: "left" }}>
                    {[...new Set(hb.images)].map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`${hb.name} image ${i + 1}`}
                        style={{ maxHeight: "100px", maxWidth: "100px", objectFit: "contain" }}
                      />
                    ))}
                  </Box>
                )}
                <div>Measurements: {hb.measurements || "N/A"}</div>
                <div>Product Info: {hb.productInfo || "N/A"}</div>
                <div>Year: {hb.year || "N/A"}</div>
                {/* <div>Release Date: {hb.releaseDate || "N/A"}</div> */}
                <div>Season: {hb.season || "N/A"}</div>
                <div>Shape: {hb.shape || "N/A"}</div>
                <div>Range: {hb.range || "N/A"}</div>
                <button onClick={() => startEditing(hb.id)}>Edit</button>
                <button
                  style={{ color: "red", marginLeft: 8 }}
                  onClick={() => handleDelete(hb.id, hb.designId)}
                  type="button"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HBDesigns;
