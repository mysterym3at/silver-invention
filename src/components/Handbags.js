import React, { useState, useEffect } from "react";
import HandbagService from "../services/handbagService.js";
import {
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
  IconButton,
  Checkbox,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

 

 function toLowerCaseFormat(str) {
          return str
            .replace(/ |\(|'|\)/g, match => (match === "(" ? "-" : ""))
            .toLowerCase()
            .trim();
        }

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

const emptyDesign = {
  name: "",
  shape: "",
  measurements: "",
  productInfo: "",
  designId: "",
  price: "",
  categories: [],
  imageUrls: [],
  favourite: false,
};

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
  "Accessory"
];

const rangeOptions = [
  "Shopfront",
  "Boutique",
  "Special & Limited Edition"

];

const Handbags = () => {
  // State variables
  const [handbags, setHandbags] = useState([]);

  // Form states
  const [name, setName] = useState("");
  const [season, setSeason] = useState("");
  const [range, setRange] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [pin, setPin] = useState("");
  const [inLookbook, setInLookbook] = useState(false);
  const [series, setSeries] = useState("");
  const [edition, setEdition] = useState("");
  const [year, setYear] = useState("");
   const [handbagId, setHandbagId] = useState("");

  // Variations states
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [version, setVersion] = useState("");
  const [themes, setThemes] = useState("");
  const [categories, setCategories] = useState("");
  const [designs, setDesigns] = useState([{ ...emptyDesign }]);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editingIdFavourite, setEditingIdFavourite] = useState(false);

  // Add these to your useEffect in Handbags.js


  useEffect(() => {

    fetchHandbags();
  }, []);

  const fetchHandbags = async () => {
    try {
      const data = await HandbagService.getAllHandbags();
      const sortedData = data.sort((a, b) => {
        const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
        const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
        return dateB - dateA;
      });
      setHandbags(sortedData);
    } catch (error) {
      console.error("Failed to fetch handbags:", error);
    }
  };

  const startEdit = (handbag) => {
    setEditingId(handbag.id);
    setName(handbag.name);
    setSeason(handbag.season || "");
    setRange(handbag.range || "");
    setReleaseDate(handbag.releaseDate || "");
    setImageUrl(handbag.imageUrl || "");
    setDescription(handbag.description || "");
    setVideo(handbag.video || "");
    setPin(handbag.pin || "");
    setInLookbook(handbag.inLookbook || false);
    setSeries(handbag.series|| "");
    setEdition(handbag.edition || "");
    setYear(handbag.year || "");
    setHandbagId(handbag.handbagId || "")
     

    setColors((Array.isArray(handbag.variations?.color) ? handbag.variations.color : []).join(", "));
    setSizes((Array.isArray(handbag.variations?.size) ? handbag.variations.size : []).join(", "));
    setVersion(handbag.variations?.version || "");
    setThemes((Array.isArray(handbag.variations?.theme) ? handbag.variations.theme : []).join(", "));
    setEditingIdFavourite(handbag.favourite || false);
    setCategories((Array.isArray(handbag.categories) ? handbag.categories : []).join(", "));

    // setDesigns(
    //   Array.isArray(handbag.variations?.design) && handbag.variations.design.length > 0
    //     ? handbag.variations.design.map((d) => ({
    //         name: d.name || "",
    //          designId: d.designId || "",
    //         shape: d.shape || "",
    //         measurements: d.measurements || "",
    //         productInfo: d.productInfo || "",
    //         price: d.price != null ? d.price.toString() : "",
    //         categories: Array.isArray(d.categories)
    //           ? d.categories
    //           : typeof d.categories === "string" && d.categories !== ""
    //           ? d.categories.split(",").map((x) => x.trim())
    //           : [],
    //         imageUrls: Array.isArray(d.imageUrls)
    //           ? d.imageUrls
    //           : typeof d.imageUrl === "string" && d.imageUrl !== ""
    //           ? [d.imageUrl]
    //           : [],
    //         favourite: d.favourite || false,
    //       }))
    //     : [{ ...emptyDesign }]
    // );
  };

  const handleAddOrUpdateHandbag = async () => {
    if (!name) return alert("Handbag name is required");

    const cleanDesigns = designs
      .filter(
        (d) =>
          d.name ||
          d.shape ||
          d.measurements ||
          d.productInfo ||
          d.designId ||
          d.price ||
          (Array.isArray(d.categories) && d.categories.length > 0) ||
          (Array.isArray(d.imageUrls) && d.imageUrls.length > 0)
      )
      .map((d) => ({
        name: typeof d.name === "string" ? d.name.trim() : "",
        shape: typeof d.shape === "string" ? d.shape.trim() : "",
        designId: typeof d.designId === "string" ? d.designId.trim() : "",
         measurements: typeof d.measurements === "string" ? d.measurements.trim() : "",
        productInfo: typeof d.productInfo === "string" ? d.productInfo.trim() : "",
        price: parseFloat(d.price) || 0,
        categories: Array.isArray(d.categories) ? d.categories.filter(Boolean) : [],
        imageUrls: Array.isArray(d.imageUrls) ? d.imageUrls.filter(Boolean) : [],
        favourite: d.favourite || false,
      }));

    const variations = {
      color: colors.split(",").map((c) => c.trim()).filter(Boolean),
      size: sizes.split(",").map((s) => s.trim()).filter(Boolean),
      version: version.trim() || null,
      theme: themes.split(",").map((t) => t.trim()).filter(Boolean),
      design: cleanDesigns,
    };


    const handbagData = {
      name,
      season: season.trim(),
      range: range.trim(),
      releaseDate: releaseDate || null,
      imageUrl: imageUrl.trim(),
      description: description.trim(),
      video: video.trim(),
      pin: pin.trim(),
      inLookbook: inLookbook || false,
      series: series.trim(),
      edition: edition.trim(),
      year: year || "",
      handbagId: handbagId.trim(),
      variations,
      favourite: editingIdFavourite,
      categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await HandbagService.updateHandbag(editingId, handbagData);
      } else {
        await HandbagService.addHandbag(handbagData);
      }
      resetForm();
      fetchHandbags();
    } catch (error) {
      console.error("Error saving handbag:", error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setEditingIdFavourite(false);
    setName("");
    setSeason("");
    setRange("");
    setReleaseDate("");
    setImageUrl("");
    setDescription("");
    setVideo("");
    setPin("");
    setColors("");
    setSizes("");
    setVersion("");
    setThemes("");
    setCategories("");
    setInLookbook(false);
    setSeries("");
    setEdition("");
    setYear("");
    setHandbagId("")
    setDesigns([{ ...emptyDesign }]);
  };

  const handleDesignChange = (index, field, value) => {
    const updatedDesigns = [...designs];
    updatedDesigns[index][field] = value;
    setDesigns(updatedDesigns);
  };

  const addDesign = () => setDesigns([...designs, { ...emptyDesign }]);

  const removeDesign = (index) => setDesigns(designs.filter((_, i) => i !== index));

  const toggleHandbagFavourite = async (handbag) => {
    try {
      await HandbagService.updateHandbag(handbag.id, {
        ...handbag,
        favourite: !handbag.favourite,
      });
      fetchHandbags();
    } catch (error) {
      console.error("Failed to toggle handbag favourite:", error);
    }
  };

  const toggleDesignFavourite = async (handbagId, designIndex) => {
    try {
      const handbag = handbags.find((h) => h.id === handbagId);
      if (!handbag) return;

      const updatedDesigns = Array.isArray(handbag.variations?.design) ? [...handbag.variations.design] : [];

      const currentFavourite = updatedDesigns[designIndex]?.favourite ?? false;

      updatedDesigns[designIndex] = {
        ...updatedDesigns[designIndex],
        favourite: !currentFavourite,
      };

      const updatedHandbagData = {
        ...handbag,
        variations: {
          ...handbag.variations,
          design: updatedDesigns,
        },
      };

      setHandbags((prev) =>
        prev.map((h) =>
          h.id === handbagId ? { ...h, variations: { ...h.variations, design: updatedDesigns } } : h
        )
      );

      await HandbagService.updateHandbag(handbagId, updatedHandbagData);
    } catch (error) {
      console.error("Failed to toggle design favourite:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Vendula London Handbags
      </Typography>

      {/** Form Start */}
      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateHandbag(); }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? "Edit" : "Add"} Handbag
        </Typography>

     <TextField label="Handbag ID" value={handbagId} onChange={(e) => setHandbagId(e.target.value)} fullWidth sx={{ mb: 2 }} />

        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required sx={{ mb: 2 }} />

             <TextField label="Year" value={year} onChange={(e) => setYear(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Season" value={season} onChange={(e) => setSeason(e.target.value)} fullWidth sx={{ mb: 2 }} />
              <TextField label="Series" value={series} onChange={(e) => setSeries(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Edition" value={edition} onChange={(e) => setEdition(e.target.value)} fullWidth sx={{ mb: 2 }} />

        <TextField label="Range" value={range} onChange={(e) => setRange(e.target.value)} fullWidth sx={{ mb: 2 }} />

             
        <TextField label="Release Date" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
        <TextField label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} fullWidth sx={{ mb: 2 }} />
        <TextField label="Video URL" value={video} onChange={(e) => setVideo(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Pin" value={pin} onChange={(e) => setPin(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Colors (comma separated)" value={colors} onChange={(e) => setColors(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Sizes (comma separated)" value={sizes} onChange={(e) => setSizes(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Version" value={version} onChange={(e) => setVersion(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Themes (comma separated)" value={themes} onChange={(e) => setThemes(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Categories (comma separated)" value={categories} onChange={(e) => setCategories(e.target.value)} fullWidth sx={{ mb: 2 }} />

        {/** Designs Section */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Designs
        </Typography>

        {designs.map((design, index) => (
          <Box key={index} sx={{ border: "1px solid #ccc", borderRadius: 1, p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle2">Design #{index + 1}</Typography>
              <IconButton
                aria-label="Toggle Favourite"
                onClick={() => {
                  const updated = [...designs];
                  updated[index].favourite = !updated[index].favourite;
                  setDesigns(updated);
                }}
                color={design.favourite ? "primary" : "default"}
              >
                {design.favourite ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Box>

            <TextField label="Name" value={design.name} onChange={(e) => handleDesignChange(index, "name", e.target.value)} fullWidth sx={{ mb: 1 }} />
                 <TextField label="Design ID" value={design.designId} onChange={(e) => handleDesignChange(index, "designId", e.target.value)} fullWidth sx={{ mb: 1 }} />
            <TextField label="Shape" value={design.shape} onChange={(e) => handleDesignChange(index, "shape", e.target.value)} fullWidth sx={{ mb: 1 }} />
            <TextField label="Measurements" value={design.measurements} onChange={(e) => handleDesignChange(index, "measurements", e.target.value)} fullWidth sx={{ mb: 1 }} />
               <TextField label="Product Info" value={design.productInfo} onChange={(e) => handleDesignChange(index, "productInfo", e.target.value)} fullWidth sx={{ mb: 1 }} />
            <TextField label="Price" type="number" inputProps={{ step: "0.01" }} value={design.price} onChange={(e) => handleDesignChange(index, "price", e.target.value)} fullWidth sx={{ mb: 1 }} />
            <Autocomplete
              freeSolo
              multiple
              options={categoryOptions}
              value={Array.isArray(design.categories) ? design.categories : []}
              onChange={(event, newValue) => handleDesignChange(index, "categories", newValue)}
              renderInput={(params) => <TextField {...params} label="Categories" />}
              sx={{ mb: 1 }}
            />
            <TextField
              label="Image URLs (comma separated)"
              value={Array.isArray(design.imageUrls) ? design.imageUrls.join(", ") : ""}
              onChange={(e) =>
                handleDesignChange(
                  index,
                  "imageUrls",
                  e.target.value.split(",").map((x) => x.trim()).filter(Boolean)
                )
              }
              fullWidth
            />
            {designs.length > 1 && (
              <Button variant="outlined" color="secondary" onClick={() => removeDesign(index)} sx={{ mt: 1 }}>
                Remove Design
              </Button>
            )}
          </Box>
        ))}

        <Button variant="outlined" onClick={addDesign} sx={{ mb: 3 }}>
          Add Another Design
        </Button>

        <Box>
          <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
            {editingId ? "Update Handbag" : "Add Handbag"}
          </Button>
          <Button variant="outlined" onClick={resetForm}>
            Cancel
          </Button>
        </Box>
      </Box>




      {/** Handbag list display */}
      {/* <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Vendula Collection List
      </Typography> */}

      {handbags.length === 0 && <Typography>No handbags found.</Typography>}

 
         

      
      {handbags.map((h) => {
        
        return (
          <Box key={h.id}>

 
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">
              {h.name} {h.favourite && "⭐"}
            </Typography>
              <Box>
                <Button onClick={() => toggleHandbagFavourite(h)} sx={{ mr: 1 }}>
                  {h.favourite ? "Unfavourite" : "Favourite"}
                </Button>
                <Button variant="outlined" onClick={() => startEdit(h)}>
                  Edit
                </Button>
              </Box>
            </Box>



            <Typography variant="body2">
              id:  {h.id || "N/A"} | handbagId:  {h.handbagId || "N/A"} | Year: {h.year || "N/A"} | Season: {h.season || "N/A"} | Range: {" "}  {Array.isArray(h.range) ? h.range.join(", ") : "N/A"}  | Release Date:{" "}
              {h.releaseDate ? new Date(h.releaseDate).toLocaleDateString() : "N/A"}
              | Series:{h.series || "N/A"}
              | Edition:{h.edition || "N/A"}

            </Typography>
            <Typography variant="body2">
              Colors: {(Array.isArray(h.variations?.color) ? h.variations.color : []).join(", ") || "N/A"} | Sizes:{" "}
            {(Array.isArray(h.variations?.size) ? h.variations.size : []).join(", ") || "N/A"} | Themes:{" "}
              {(Array.isArray(h.variations?.theme) ? h.variations.theme : []).join(", ") || "N/A"}
              | Version: {h.variations?.version || "N/A"}
            </Typography>
            <Typography variant="body2">Description: {h.description || "N/A"}</Typography>
            
                      {h.imageUrl && (
                        <Box sx={{ my: 1 }}>
                          <img src={h.imageUrl} alt={h.name} style={{ maxWidth: "200px" }} />
                        </Box>
                      )}

            {h.video && (
              <Box sx={{ my: 1 }}>
                <a href={h.video} target="_blank" rel="noopener noreferrer">
                  Video Link
                </a>
              </Box>
            )}

            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Designs:
            </Typography>

            {Array.isArray(h.variations?.design) && h.variations.design.length > 0 ? (
              h.variations.design.map((design, idx) => (
                <Box key={idx} >
                  <Button
                          onClick={() => toggleDesignFavourite(h.id, idx)}
                          color={design.favourite ? "primary" : "default"}
                          aria-label={design.favourite ? "Unfavourite design" : "Favourite design"}
                          title={design.favourite ? "Unfavourite design" : "Favourite design"}
                          sx={{ mr: 1, minWidth: 0, p: 0.5 }}
                        >
                          {design.favourite ? <StarIcon /> : <StarBorderIcon />}
                        </Button> 
                  <b>{design.name || "N/A"} </b> | 
                  {design.shape || "N/A"} | Price:{" "} 
                  {gbpFormatter.format(design.price)} | Measurements: {design.measurements || "N/A"} | Categories:{" "} 
                  {Array.isArray(design.categories) ? design.categories.join(", ") : "N/A"}

                   {/* Render all design images as small thumbnails */}
                   {Array.isArray(design.imageUrls) && design.imageUrls.length > 0 && (
                          <Box component="span" sx={{ ml: 1, display: "flex", gap: 1, alignItems: "left" }}>
                            {design.imageUrls.map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt={`${design.name} image ${i + 1}`}
                                style={{ maxHeight: "50px", maxWidth: "50px", objectFit: "contain" }}
                              />
                            ))}
                          </Box>
                        )}
                </Box>
              ))
            ) : (
              <Typography>No designs available</Typography>
            )}

          </Box>
        );
      })}
    </Box>
  );
};

export default Handbags;
