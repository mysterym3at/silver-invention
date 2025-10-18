import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HandbagService from "../services/handbagService";

const categoryOptions = [
  "Tote",
  "Satchel",
  "Clutch",
  "Crossbody",
  "Shoulder",
  "Mini",
  "Backpack",
  "Handbag",
  "Wallet",
  "Purse",
  "Accessory",
];

const HandbagSearch = () => {
  const [handbags, setHandbags] = useState([]);
  const [filteredHandbags, setFilteredHandbags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollections, setSelectedCollections] = useState(new Set());
  const [selectedHandbags, setSelectedHandbags] = useState(new Set());

  // Handbag editing state
  const [editingHandbagId, setEditingHandbagId] = useState(null);
  const [editingHandbagName, setEditingHandbagName] = useState("");
  const [editingSeason, setEditingSeason] = useState("");
  const [editingRange, setEditingRange] = useState("");
  const [editingReleaseDate, setEditingReleaseDate] = useState("");
  const [editingImageUrl, setEditingImageUrl] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingVideo, setEditingVideo] = useState("");
  const [editingPin, setEditingPin] = useState("");
  const [editingInLookbook, setEditingInLookbook] = useState(false);
  const [editingSeries, setEditingSeries] = useState("");
  const [editingEdition, setEditingEdition] = useState("");
  const [editingYear, setEditingYear] = useState("");
  const [editingHandbagIdField, setEditingHandbagIdField] = useState("");

  // Design editing state
  const [editingDesignId, setEditingDesignId] = useState(null);
  const [editingDesignName, setEditingDesignName] = useState("");
  const [editingDesignShape, setEditingDesignShape] = useState("");
  const [editingDesignMeasurements, setEditingDesignMeasurements] = useState("");
  const [editingDesignProductInfo, setEditingDesignProductInfo] = useState("");
  const [editingDesignDesignId, setEditingDesignDesignId] = useState("");
  const [editingDesignPrice, setEditingDesignPrice] = useState("");
  const [editingDesignCategories, setEditingDesignCategories] = useState([]);
  const [editingDesignImageUrls, setEditingDesignImageUrls] = useState([]);
  const [editingDesignFavourite, setEditingDesignFavourite] = useState(false);
  const [editingDesignParentHandbagId, setEditingDesignParentHandbagId] =
    useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await HandbagService.getAllHandbags();
        const dataWithFav = data.map((h) => ({
          ...h,
          variations: {
            ...h.variations,
            design: (h.variations?.design || []).map((d) => ({
              ...d,
              favourite: false,
            })),
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

  const collections = React.useMemo(() => {
    const set = new Set();
    handbags.forEach((h) => {
      (h.variations?.design || []).forEach((d) => {
        if (d.collection) set.add(d.collection);
      });
    });
    return Array.from(set).sort();
  }, [handbags]);

  // Editing handlers for handbags
  const startEditHandbag = (handbag) => {
    setEditingHandbagId(handbag.id);
    setEditingHandbagName(handbag.name || "");
    setEditingSeason(handbag.season || "");
    setEditingRange(handbag.range || "");
    setEditingReleaseDate(handbag.releaseDate || "");
    setEditingImageUrl(handbag.imageUrl || "");
    setEditingDescription(handbag.description || "");
    setEditingVideo(handbag.video || "");
    setEditingPin(handbag.pin || "");
    setEditingInLookbook(handbag.inLookbook || false);
    setEditingSeries(handbag.series || "");
    setEditingEdition(handbag.edition || "");
    setEditingYear(handbag.year || "");
    setEditingHandbagIdField(handbag.handbagId || "");
  };

  const cancelEditHandbag = () => {
    setEditingHandbagId(null);
    setEditingHandbagName("");
    setEditingSeason("");
    setEditingRange("");
    setEditingReleaseDate("");
    setEditingImageUrl("");
    setEditingDescription("");
    setEditingVideo("");
    setEditingPin("");
    setEditingInLookbook(false);
    setEditingSeries("");
    setEditingEdition("");
    setEditingYear("");
    setEditingHandbagIdField("");
  };

  const saveEditHandbag = async () => {
    try {
      const updatedHandbag = {
        id: editingHandbagId,
        name: editingHandbagName,
        season: editingSeason,
        range: editingRange,
        releaseDate: editingReleaseDate,
        imageUrl: editingImageUrl,
        description: editingDescription,
        video: editingVideo,
        pin: editingPin,
        inLookbook: editingInLookbook,
        series: editingSeries,
        edition: editingEdition,
        year: editingYear,
        handbagId: editingHandbagIdField,
      };
      await HandbagService.updateHandbag(updatedHandbag);
      setHandbags((prev) =>
        prev.map((h) =>
          h.id === editingHandbagId ? { ...h, ...updatedHandbag } : h
        )
      );
      cancelEditHandbag();
    } catch (error) {
      console.error("Failed to update handbag", error);
    }
  };

  // Editing handlers for designs
  const startEditDesign = (design, parentHandbagId) => {
    setEditingDesignId(design.name);
    setEditingDesignName(design.name || "");
    setEditingDesignShape(design.shape || "");
    setEditingDesignMeasurements(design.measurements || "");
    setEditingDesignProductInfo(design.productInfo || "");
    setEditingDesignDesignId(design.designId || "");
    setEditingDesignPrice(design.price || "");
    setEditingDesignCategories(design.categories || []);
    setEditingDesignImageUrls(design.imageUrls || []);
    setEditingDesignFavourite(design.favourite || false);
    setEditingDesignParentHandbagId(parentHandbagId);
  };

  const cancelEditDesign = () => {
    setEditingDesignId(null);
    setEditingDesignName("");
    setEditingDesignShape("");
    setEditingDesignMeasurements("");
    setEditingDesignProductInfo("");
    setEditingDesignDesignId("");
    setEditingDesignPrice("");
    setEditingDesignCategories([]);
    setEditingDesignImageUrls([]);
    setEditingDesignFavourite(false);
    setEditingDesignParentHandbagId(null);
  };

  const saveEditDesign = async () => {
    try {
      setHandbags((prev) =>
        prev.map((h) => {
          if (h.id === editingDesignParentHandbagId) {
            const updatedDesigns = h.variations.design.map((d) =>
              d.name === editingDesignId
                ? {
                    ...d,
                    name: editingDesignName,
                    shape: editingDesignShape,
                    measurements: editingDesignMeasurements,
                    productInfo: editingDesignProductInfo,
                    designId: editingDesignDesignId,
                    price: editingDesignPrice,
                    categories: editingDesignCategories,
                    imageUrls: editingDesignImageUrls,
                    favourite: editingDesignFavourite,
                  }
                : d
            );
            const updatedHandbag = {
              ...h,
              variations: { ...h.variations, design: updatedDesigns },
            };
            HandbagService.updateHandbag(updatedHandbag).catch(console.error);
            return updatedHandbag;
          }
          return h;
        })
      );
      cancelEditDesign();
    } catch (error) {
      console.error("Failed to update design", error);
    }
  };

  const toggleHandbagSelection = (handbagId) => {
    setSelectedHandbags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(handbagId)) newSet.delete(handbagId);
      else newSet.add(handbagId);
      return newSet;
    });
  };

  const toggleCollection = (collection) => {
    setSelectedCollections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(collection)) newSet.delete(collection);
      else newSet.add(collection);
      return newSet;
    });
  };

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = handbags
      .map((h) => {
        const filteredDesigns = (h.variations?.design || []).filter((d) => {
          const nameMatch =
            typeof d.name === "string" && d.name.toLowerCase().includes(term);

          const catField = d.category || d.categories || "";
          const categories = Array.isArray(catField)
            ? catField
            : typeof catField === "string"
            ? catField.split(/[,/]/).map((c) => c.trim())
            : [];

          const catMatch = categories.some(
            (c) => c && c.toLowerCase().includes(term)
          );

          const collectionMatch =
            selectedCollections.size === 0 ||
            (d.collection && selectedCollections.has(d.collection));

          return (nameMatch || catMatch) && collectionMatch;
        });

        if (filteredDesigns.length > 0) {
          return { ...h, variations: { ...h.variations, design: filteredDesigns } };
        }
        return null;
      })
      .filter(Boolean);

    const finalFiltered = selectedHandbags.size
      ? filtered.filter((h) => selectedHandbags.has(h.id))
      : filtered;

    finalFiltered.sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
      const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
      return dateB - dateA;
    });

    setFilteredHandbags(finalFiltered);
  }, [searchTerm, handbags, selectedCollections, selectedHandbags]);

  const handbagsBySeason = React.useMemo(() => {
    const group = {};
    filteredHandbags.forEach((handbag) => {
      const season = handbag.season || "Unknown Season";
      if (!group[season]) group[season] = [];
      group[season].push(handbag);
    });
    return group;
  }, [filteredHandbags]);

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Search handbags or designs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            borderRight: "1px solid #ddd",
            paddingRight: 2,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            sx={{ marginBottom: 1 }}
            onClick={() => {
              setSelectedCollections(new Set());
              setSelectedHandbags(new Set());
            }}
          >
            Clear Filters
          </Button>

          {/* <h3>Filter by Collection</h3>
          <FormGroup>
            {collections.length === 0 && <p>No collections found</p>}
            {collections.map((col) => (
              <FormControlLabel
                key={col}
                control={
                  <Checkbox
                    checked={selectedCollections.has(col)}
                    onChange={() => toggleCollection(col)}
                  />
                }
                label={col}
              />
            ))}
          </FormGroup> */}

          <h3>Handbags by Season</h3>
          {Object.entries(handbagsBySeason).map(([season, handbagsInSeason]) => (
            <Accordion key={season}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  {season} ({handbagsInSeason.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {handbagsInSeason.map((handbag) => (
                  <Typography
                    key={handbag.id}
                    sx={{
                      cursor: "pointer",
                      paddingLeft: 1,
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      userSelect: "none",
                      bgcolor: selectedHandbags.has(handbag.id)
                        ? "action.selected"
                        : "transparent",
                      borderRadius: 1,
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => toggleHandbagSelection(handbag.id)}
                    title={handbag.name}
                  >
                    {handbag.name}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Box sx={{ flexGrow: 1, paddingLeft: 2 }}>
          {filteredHandbags.length === 0 ? (
            <p>No results found.</p>
          ) : (
            filteredHandbags.map((handbag) => (
              <Box key={handbag.id} sx={{ mb: 3 }}>
                {editingHandbagId === handbag.id ? (
                  <>
                    <TextField
                      label="Name"
                      value={editingHandbagName}
                      onChange={(e) => setEditingHandbagName(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Season"
                      value={editingSeason}
                      onChange={(e) => setEditingSeason(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Range"
                      value={editingRange}
                      onChange={(e) => setEditingRange(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Release Date"
                      value={editingReleaseDate}
                      onChange={(e) => setEditingReleaseDate(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Image URL"
                      value={editingImageUrl}
                      onChange={(e) => setEditingImageUrl(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Description"
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      size="small"
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Video URL"
                      value={editingVideo}
                      onChange={(e) => setEditingVideo(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Pin"
                      value={editingPin}
                      onChange={(e) => setEditingPin(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editingInLookbook}
                          onChange={(e) => setEditingInLookbook(e.target.checked)}
                        />
                      }
                      label="In Lookbook"
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Series"
                      value={editingSeries}
                      onChange={(e) => setEditingSeries(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Edition"
                      value={editingEdition}
                      onChange={(e) => setEditingEdition(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Year"
                      value={editingYear}
                      onChange={(e) => setEditingYear(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                      type="number"
                    />
                    <TextField
                      label="Handbag Id"
                      value={editingHandbagIdField}
                      onChange={(e) => setEditingHandbagIdField(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                    <Box sx={{ my: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={saveEditHandbag}
                        sx={{ mr: 1 }}
                      >
                        Save
                      </Button>
                      <Button size="small" onClick={cancelEditHandbag}>
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>
                      {handbag.name}
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => startEditHandbag(handbag)}
                    >
                      Edit
                    </Button>
                  </Box>
                )}

                {(handbag.variations?.design || []).map((design) => (
                  <Box
                    key={design.name}
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    {editingDesignId === design.name &&
                    editingDesignParentHandbagId === handbag.id ? (
                      <>
                        <TextField
                          label="Name"
                          value={editingDesignName}
                          onChange={(e) => setEditingDesignName(e.target.value)}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <TextField
                          label="Shape"
                          value={editingDesignShape}
                          onChange={(e) => setEditingDesignShape(e.target.value)}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <TextField
                          label="Measurements"
                          value={editingDesignMeasurements}
                          onChange={(e) =>
                            setEditingDesignMeasurements(e.target.value)
                          }
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          multiline
                          rows={2}
                        />
                        <TextField
                          label="Product Info"
                          value={editingDesignProductInfo}
                          onChange={(e) =>
                            setEditingDesignProductInfo(e.target.value)
                          }
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          multiline
                          rows={2}
                        />
                        <TextField
                          label="Design Id"
                          value={editingDesignDesignId}
                          onChange={(e) => setEditingDesignDesignId(e.target.value)}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <TextField
                          label="Price"
                          value={editingDesignPrice}
                          onChange={(e) => setEditingDesignPrice(e.target.value)}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          type="number"
                        />
                        <Autocomplete
                          multiple
                          freeSolo
                          options={categoryOptions}
                          value={editingDesignCategories}
                          onChange={(event, newValue) =>
                            setEditingDesignCategories(newValue)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Categories"
                              size="small"
                              sx={{ mb: 1 }}
                            />
                          )}
                          sx={{ mr: 1, width: 300 }}
                        />
                        <TextField
                          label="Image URLs (comma separated)"
                          value={editingDesignImageUrls.join(", ")}
                          onChange={(e) =>
                            setEditingDesignImageUrls(e.target.value.split(/\s*,\s*/))
                          }
                          multiline
                          rows={2}
                          size="small"
                          fullWidth
                          sx={{ mb: 1 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={editingDesignFavourite}
                              onChange={(e) =>
                                setEditingDesignFavourite(e.target.checked)
                              }
                            />
                          }
                          label="Favourite"
                          sx={{ mb: 1 }}
                        />

                        <Box sx={{ my: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={saveEditDesign}
                            sx={{ mr: 1 }}
                          >
                            Save
                          </Button>
                          <Button size="small" onClick={cancelEditDesign}>
                            Cancel
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography sx={{ flexGrow: 1 }}>
                          <strong>{design.name}</strong> - Collection: {design.collection}
                        </Typography>

                        <Button
                          size="small"
                          variant="text"
                          onClick={() => startEditDesign(design, handbag.id)}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HandbagSearch;
