// src/components/Ranges.jsx
import React, { useState, useEffect } from "react";
import RangeService from "../services/rangeService"; // Implement Firestore service accordingly
import { Box } from "@mui/material";

const emptyRange = {
  version: 1,
  year: "",
  edition: "",
  name: "",
  series: "",
    season: "",
  rangeId: "",
  colors: [],
  inLookbook: false,
  themes: [],
  range: "",
  releaseDate: "",
  designIds: [], // Array of design document IDs referencing Designs collection
};

 function toLowerCaseFormat(str) {
          return str
            .replace(/ |\(|'|\)/g, match => (match === "(" ? "-" : ""))
            .toLowerCase()
            .trim();
        }

const styles = {
  container: {
    maxWidth: 900,
    margin: "auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  formGroup: { marginBottom: 15 },
  label: { display: "block", fontWeight: "bold", marginBottom: 5 },
  input: {
    width: "100%",
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  dateInput: {
    width: "100%",
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  checkbox: {
    transform: "scale(1.3)",
    marginLeft: 5,
  },
  button: {
    padding: "8px 16px",
    fontSize: 14,
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    marginRight: 10,
  },
  buttonPrimary: { backgroundColor: "#007bff", color: "#fff" },
  buttonSecondary: { backgroundColor: "#6c757d", color: "#fff" },
  rangesList: { listStyle: "none", paddingLeft: 0 },
  rangeItem: {
    padding: 10,
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rangeName: { fontWeight: "bold" },
};

const Ranges = () => {
  const [ranges, setRanges] = useState([]);

  const [version, setVersion] = useState(1);
  const [year, setYear] = useState("");
   const [season, setSeason] = useState("");
  const [edition, setEdition] = useState("");
  const [name, setName] = useState("");
  const [series, setSeries] = useState("");
  const [rangeId, setRangeId] = useState("");
  const [colors, setColors] = useState([]);
  const [inLookbook, setInLookbook] = useState(false);
  const [themes, setThemes] = useState([]);
  const [range, setRange] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [designIds, setDesignIds] = useState([]); // array of Design document IDs

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRanges();
  }, []);

  const fetchRanges = async () => {
    try {
      const data = await RangeService.getAllRanges();
      setRanges(data);
    } catch (error) {
      console.error("Failed to fetch ranges:", error);
    }
  };

  const startEdit = (rangeObj) => {
    setEditingId(rangeObj.id || null);
    setVersion(rangeObj.version ?? 1);
    setYear(rangeObj.year || "");
    setSeason(rangeObj.season || "");
    setEdition(rangeObj.edition || "");
    setName(rangeObj.name || "");
    setSeries(rangeObj.series || "");
    setRangeId(rangeObj.rangeId || "");
    setColors(rangeObj.colors || []);
    setInLookbook(rangeObj.inLookbook || false);
    setThemes(rangeObj.themes || []);
    setRange(rangeObj.range || "");
    setReleaseDate(rangeObj.releaseDate || "");
    setDesignIds(Array.isArray(rangeObj.designIds) ? rangeObj.designIds : []);
  };

  const resetForm = () => {
    setEditingId(null);
    setVersion(1);
    setYear("");
     setSeason("");
    setEdition("");
    setName("");
    setSeries("");
    setRangeId("");
    setColors([]);
    setInLookbook(false);
    setThemes([]);
    setRange("");
    setReleaseDate("");
    setDesignIds([]);
  };

  const handleAddOrUpdateRange = async () => {
    if (!name) {
      alert("Range name is required");
      return;
    }

    const rangeData = {
      version: Number(version),
      year: year.trim(),
       season: season.trim(),
      edition: edition.trim(),
      name: name.trim(),
      series: series.trim(),
      rangeId: toLowerCaseFormat(name).concat("_",season), 
      colors: colors.filter(Boolean),
      inLookbook,
      themes: themes.filter(Boolean),
      range: range.trim(),
      releaseDate: releaseDate.trim(),
      designIds,
    };

    try {
      if (editingId) {
        await RangeService.updateRange(editingId, rangeData);
      } else {
        await RangeService.addRange(rangeData);
      }
      resetForm();
      fetchRanges();
    } catch (error) {
      console.error("Error saving range:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{editingId ? "Edit Range" : "Add Range"}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddOrUpdateRange();
        }}
      >
        <div style={styles.formGroup}>
          <label style={styles.label}>Version:</label>
          <input
            type="number"
            style={styles.input}
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            min={1}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Year:</label>
          <input
            style={styles.input}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Edition:</label>
          <input
            style={styles.input}
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
          />
        </div>
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
          <label style={styles.label}>Series:</label>
          <input
            style={styles.input}
            value={series}
            onChange={(e) => setSeries(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Range ID:</label>
          <input
            style={styles.input}
            value={rangeId}
            onChange={(e) => setRangeId(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Colors (comma separated):</label>
          <input
            style={styles.input}
            value={colors.join(", ")}
            onChange={(e) =>
              setColors(e.target.value.split(",").map((c) => c.trim()))
            }
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>In Lookbook:</label>
          <input
            type="checkbox"
            style={styles.checkbox}
            checked={inLookbook}
            onChange={(e) => setInLookbook(e.target.checked)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Themes (comma separated):</label>
          <input
            style={styles.input}
            value={themes.join(", ")}
            onChange={(e) =>
              setThemes(e.target.value.split(",").map((t) => t.trim()))
            }
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Range:</label>
          <input
            style={styles.input}
            value={range}
            onChange={(e) => setRange(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Release Date:</label>
          <input
            type="date"
            style={styles.dateInput}
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Design IDs (comma separated):</label>
          <input
            style={styles.input}
            value={designIds.join(", ")}
            onChange={(e) =>
              setDesignIds(e.target.value.split(",").map((id) => id.trim()))
            }
            placeholder="Enter design document IDs"
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>
            {editingId ? "Update Range" : "Add Range"}
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

      <h2>Ranges List</h2>
      <ul style={styles.rangesList}>
        {ranges.map((r) => (
          <li key={r.id} style={styles.rangeItem}>
             {Array.isArray(r.designs) && r.designs.length > 0 && (
                             <Box component="span" sx={{ ml: 1, max: 5, display: "flex", gap: 1, alignItems: "left" }}>
                               {[...new Set(r.designs)].map((url, i) => (
                                 <img
                                   key={i}
                                   src={url}
                                   alt={`${r.name} image ${i + 1}`}
                                   style={{ maxHeight: "100px", maxWidth: "100px", objectFit: "contain" }}
                                 />
                               ))}
                             </Box>
                           )}


            <span style={styles.rangeName}>{r.name}</span> {r.rangeId}{" "} {r.season}{" "} {r.releaseDate}
            <button
              type="button"
              style={{ ...styles.button, ...styles.buttonPrimary }}
              onClick={() => startEdit(r)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ranges;
