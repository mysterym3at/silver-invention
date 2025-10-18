import React, { useEffect, useState } from "react";
import HandbagService from "../services/handbagService";

const HandbagSearch = () => {
  const [handbags, setHandbags] = useState([]);
  const [filteredHandbags, setFilteredHandbags] = useState([]);


  
  // Single combined search input
  const [searchTerm, setSearchTerm] = useState("");
  
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
  const term = searchTerm.trim().toLowerCase();

  if (!term) {
    // Show all handbags and all designs when search is empty, sorted by releaseDate
    const sorted = [...handbags].sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
      const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
      return dateB - dateA;
    });
    setFilteredHandbags(sorted.map(h => ({
      ...h,
      variations: {
        ...h.variations,
        design: [...(h.variations?.design || [])]
      }
    })));
    return;
  }

  // Filter handbags by matching designs only
  const result = handbags
    .map((h) => {
      // Filter the designs array for this handbag
      const filteredDesigns = (h.variations?.design || []).filter(d => {
        const nameMatch = typeof d.name === "string" && d.name.toLowerCase().includes(term);
        const shapeMatch = typeof d.shape === "string" && d.shape.toLowerCase().includes(term);

        // Handle category as string, array, or undefined
        const catField = d.category || d.categories || "";
        const categories = Array.isArray(catField)
          ? catField
          : typeof catField === "string"
            ? catField.split(/[,/]/).map(c => c.trim())
            : [];
        const catMatch = categories.some(c => c && c.toLowerCase().includes(term));

        return nameMatch || shapeMatch || catMatch;
      });

      // Return handbag only if at least one design matches
      if (filteredDesigns.length > 0) {
        return {
          ...h,
          variations: {
            ...h.variations,
            design: filteredDesigns
          }
        };
      }
      return null;
    })
    .filter(Boolean);

  // Sort by releaseDate descending (newest first)
  result.sort((a, b) => {
    const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
    const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
    return dateB - dateA;
  });

  setFilteredHandbags(result);
}, [searchTerm, handbags]);


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

  // EmailFavoritesButton component omitted for brevity (same as before)

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>Search Handbags & Designs</h2>

      <input
        type="text"
        placeholder="Search by handbag name, design, shape, range, colors, or season..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 20, fontSize: 16 }}
        aria-label="Search handbags and designs"
        autoFocus
      />

      {/* EmailFavoritesButton handbags={handbags} here */}

      {/* Render filtered handbags and designs as before */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredHandbags.length === 0 && <p>No results found.</p>}

        {filteredHandbags.map((handbag) => (
          <li key={handbag.id} style={{ marginBottom: 30, padding: 15, border: "1px solid #ccc", borderRadius: 6, backgroundColor: "#fafafa" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>{handbag.name}</h3>
              <div>
                <em>{handbag.range || "N/A"}</em> | <span>{handbag.season || "N/A"}</span> | <span>{handbag.releaseDate || "N/A"}</span>
              </div>
            </div>

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
                    <div>Category: {Array.isArray(design.categories) ? design.categories.split : []} | Price: £{design.price ?? "0.00"}</div>
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

export default HandbagSearch;
