import React, { useEffect, useState } from "react";
import HandbagService from "../services/designService.js";

const HandbagSearch = () => {
  const [handbags, setHandbags] = useState([]);
  const [filteredHandbags, setFilteredHandbags] = useState([]);

  // Search inputs
  const [handbagNameSearch, setHandbagNameSearch] = useState("");
  const [designNameSearch, setDesignNameSearch] = useState("");

  // New search inputs
  const [shapeSearch, setShapeSearch] = useState("");
  const [rangeSearch, setRangeSearch] = useState("");
  const [colorsSearch, setColorsSearch] = useState("");
  const [seasonSearch, setSeasonSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await HandbagService.getAllHandbags();
        const dataWithFav = data.map((h) => ({
          ...h,
          variations: {
            ...h.variations,
            design: (h.variations?.design || []).map((d) => ({ ...d, favourite: false })),
          },
        }));
        setHandbags(dataWithFav);
        setFilteredHandbags(dataWithFav);
      } catch (error) {
        console.error("Failed to fetch handbags:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...handbags];
    const trimLower = (str) => str.trim().toLowerCase();

    if (handbagNameSearch.trim()) {
      const searchLower = trimLower(handbagNameSearch);
      filtered = filtered.filter(
        (h) => typeof h.name === "string" && h.name.toLowerCase().includes(searchLower)
      );
    }

    if (designNameSearch.trim()) {
      const designSearchLower = trimLower(designNameSearch);
      filtered = filtered.filter((h) => {
        const designs = h.variations?.design || [];
        return designs.some(
          (d) => typeof d.name === "string" && d.name.toLowerCase().includes(designSearchLower)
        );
      });
    }

    if (shapeSearch.trim()) {
      const shapeSearchLower = trimLower(shapeSearch);
      filtered = filtered.filter((h) => {
        const designs = h.variations?.design || [];
        // Check if any design's shape includes the search term
        return designs.some(
          (d) => typeof d.shape === "string" && d.shape.toLowerCase().includes(shapeSearchLower)
        );
      });
    }

    if (rangeSearch.trim()) {
      const rangeSearchLower = trimLower(rangeSearch);
      filtered = filtered.filter((h) => typeof h.range === "string" && h.range.toLowerCase().includes(rangeSearchLower));
    }

    if (colorsSearch.trim()) {
      const colorsSearchLower = trimLower(colorsSearch);
      filtered = filtered.filter((h) => {
        const colors = Array.isArray(h.variations?.color) ? h.variations.color : [];
        return colors.some((color) => color.toLowerCase().includes(colorsSearchLower));
      });
    }

    if (seasonSearch.trim()) {
      const seasonSearchLower = trimLower(seasonSearch);
      filtered = filtered.filter((h) => typeof h.season === "string" && h.season.toLowerCase().includes(seasonSearchLower));
    }

    // Sort by most recent releaseDate descending
    filtered.sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
      const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
      return dateB - dateA;
    });

    setFilteredHandbags(filtered);
  }, [handbags, handbagNameSearch, designNameSearch, shapeSearch, rangeSearch, colorsSearch, seasonSearch]);

  // Toggle favorite status of a design locally
  const toggleDesignFavourite = (handbagId, designName) => {
    setHandbags((prevHandbags) =>
      prevHandbags.map((handbag) => {
        if (handbag.id !== handbagId) return handbag;
        const updatedDesigns = (handbag.variations?.design || []).map((design) =>
          design.name === designName ? { ...design, favourite: !design.favourite } : design
        );
        return {
          ...handbag,
          variations: {
            ...handbag.variations,
            design: updatedDesigns,
          },
        };
      })
    );
  };

  // Email favorites button omitted for brevity (same as before)

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>Search Handbags and Designs</h2>

      <input
        type="text"
        placeholder="Search handbags by name..."
        value={handbagNameSearch}
        onChange={(e) => setHandbagNameSearch(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10, fontSize: 16 }}
        aria-label="Search handbags by name"
      />

      <input
        type="text"
        placeholder="Search designs by name..."
        value={designNameSearch}
        onChange={(e) => setDesignNameSearch(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10, fontSize: 16 }}
        aria-label="Search designs by name"
      />

      <input
        type="text"
        placeholder="Search by shape..."
        value={shapeSearch}
        onChange={(e) => setShapeSearch(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10, fontSize: 16 }}
        aria-label="Search by shape"
      />

      <input
        type="text"
        placeholder="Search by range..."
        value={rangeSearch}
        onChange={(e) => setRangeSearch(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10, fontSize: 16 }}
        aria-label="Search by range"
      />

      <input
        type="text"
        placeholder="Search by colors..."
        value={colorsSearch}
        onChange={(e) => setColorsSearch(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10, fontSize: 16 }}
        aria-label="Search by colors"
      />

      <input
        type="text"
        placeholder="Search by season..."
        value={seasonSearch}
        onChange={(e) => setSeasonSearch(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 20, fontSize: 16 }}
        aria-label="Search by season"
      />

      {/* EmailFavoritesButton component here (unchanged) */}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredHandbags.length === 0 && <p>No results found.</p>}
        {filteredHandbags.map((handbag) => (
          <li
            key={handbag.id}
            style={{ marginBottom: 30, padding: 15, border: "1px solid #ccc", borderRadius: 6, backgroundColor: "#fafafa" }}
          >
            {/* Handbag header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>{handbag.name}</h3>
              <div>
                <em>{handbag.range || "N/A"}</em> | <span>{handbag.season || "N/A"}</span> | <span>{handbag.releaseDate || "N/A"}</span>
              </div>
            </div>

            {/* Designs */}
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {(handbag.variations?.design || []).map((design) => (
                <li key={design.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <button
                    type="button"
                    onClick={() => toggleDesignFavourite(handbag.id, design.name)}
                    aria-label={design.favourite ? "Unfavourite design" : "Favourite design"}
                    title={design.favourite ? "Unfavourite design" : "Favourite design"}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 22,
                      color: design.favourite ? "gold" : "#ccc",
                      userSelect: "none",
                      padding: 0,
                    }}
                  >
                    {design.favourite ? "★" : "☆"}
                  </button>

                  {design.imageUrl && (
                    <img
                      src={design.imageUrl}
                      alt={design.name}
                      style={{ width: 120, objectFit: "cover", borderRadius: 4 }}
                    />
                  )}

                  <div>
                    <strong>{design.name || "Unnamed Design"}</strong>
                    <div>Category: {design.category || "N/A"} | Price: £{design.price ?? "0.00"}</div>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HBDesignSearch;
