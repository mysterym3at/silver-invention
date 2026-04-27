import React, { useState, useEffect } from "react";
import ShapeService from "../services/shapeService.js";

const styles = {
  container: {
    maxWidth: 900,
    margin: "auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
  textarea: {
    width: "100%",
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
    minHeight: 80,
  },
  button: {
    padding: "8px 16px",
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
  shapesList: {
    listStyle: "none",
    paddingLeft: 0,
  },
  shapeItem: {
    padding: 10,
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shapeName: {
    fontWeight: "bold",
  },
};

const Shapes = () => {
  const [shapes, setShapes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [size, setSize] = useState(null);
  const [name, setName] = useState("");
  const [shapeType, setShapeType] = useState("");
  const [price, setPrice] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [shapeId, setShapeId] = useState("");
  const [id, setId] = useState("");
  const [ranges, setRanges] = useState([]);
  const [measurements, setMeasurements] = useState(null);
  const [type, setType] = useState(null);
  const [favourite, setFavourite] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchShapes();
  }, []);

  const fetchShapes = async () => {
    try {
      const data = await ShapeService.getAllShapes();
      setShapes(data);
    } catch (error) {
      console.error("Failed to fetch shapes:", error);
    }
  };

  const startEdit = (shape) => {
    setEditingId(shape.id);
    setCategories(shape.categories || []);
    setSize(shape.size || null);
    setName(shape.name || "");
    setShapeType(shape.shape || "");
    setPrice(shape.price || null);
    setProductInfo(shape.productInfo || null);
    setShapeId(shape.shapeId || "");
    setId(shape.id || "");
    setRanges(shape.ranges || []);
    setMeasurements(shape.measurements || null);
    setType(shape.type || null);
    setFavourite(shape.favourite || false);
  };

  const resetForm = () => {
    setEditingId(null);
    setCategories([]);
    setSize(null);
    setName("");
    setShapeType("");
    setPrice(null);
    setProductInfo(null);
    setShapeId("");
    setId("");
    setRanges([]);
    setMeasurements(null);
    setType(null);
    setFavourite(false);
  };

  const handleAddOrUpdateShape = async () => {
    if (!name) {
      alert("Shape name is required");
      return;
    }

    const shapeData = {
      categories,
      size,
      name: name.trim(),
      shape: shapeType.trim(),
      price: price !== null ? Number(price) : null,
      productInfo: productInfo ? productInfo.trim() : null,
      shapeId: shapeId.trim(),
      id,
      ranges,
      measurements,
      type,
      favourite,
    };

    try {
      if (editingId) {
        await ShapeService.updateShape(editingId, shapeData);
      } else {
        await ShapeService.addShape(shapeData);
      }
      resetForm();
      fetchShapes();
    } catch (error) {
      console.error("Error saving shape:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{editingId ? "Edit Shape" : "Add Shape"}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddOrUpdateShape();
        }}
      >
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Shape:</label>
          <input
            style={styles.input}
            value={shapeType}
            onChange={(e) => setShapeType(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Shape ID:</label>
          <input
            style={styles.input}
            value={shapeId}
            onChange={(e) => setShapeId(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Price:</label>
          <input
            type="number"
            style={styles.input}
            value={price !== null ? price : ""}
            onChange={(e) =>
              setPrice(e.target.value === "" ? null : Number(e.target.value))
            }
            step="0.01"
            min="0"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Size:</label>
          <input
            style={styles.input}
            value={size || ""}
            onChange={(e) => setSize(e.target.value || null)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Categories (comma separated):</label>
          <input
            style={styles.input}
            value={categories.join(", ")}
            onChange={(e) =>
              setCategories(e.target.value.split(",").map((c) => c.trim()))
            }
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Info:</label>
          <textarea
            style={styles.textarea}
            value={productInfo || ""}
            onChange={(e) => setProductInfo(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>ID:</label>
          <input
            style={styles.input}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Ranges (comma separated):</label>
          <input
            style={styles.input}
            value={ranges.join(", ")}
            onChange={(e) =>
              setRanges(e.target.value.split(",").map((r) => r.trim()))
            }
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Measurements:</label>
          <input
            style={styles.input}
            value={measurements || ""}
            onChange={(e) => setMeasurements(e.target.value || null)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Type:</label>
          <input
            style={styles.input}
            value={type || ""}
            onChange={(e) => setType(e.target.value || null)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Favourite:</label>
          <input
            type="checkbox"
            checked={favourite}
            onChange={(e) => setFavourite(e.target.checked)}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <button
            type="submit"
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            {editingId ? "Update Shape" : "Add Shape"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Clear
          </button>
        </div>
      </form>
      <h2>Shapes List</h2>
      <ul style={styles.shapesList}>
        {shapes.map((shape) => (
          <li key={shape.id} style={styles.shapeItem}>
            <span style={styles.shapeName}>{shape.name}</span>  {shape.measurements}{" "}
            <button
              type="button"
              style={{ ...styles.button, ...styles.buttonPrimary }}
              onClick={() => startEdit(shape)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Shapes;
