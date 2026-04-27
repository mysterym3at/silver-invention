import React from "react";
import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase.js";
import colorJson from "../services/colorJson.js";

const AddOrUpdateColorsButton = () => {
  const addOrUpdateColors = async () => {
    const batch = writeBatch(db);
    try {
      const colorsCollection = collection(db, "colors");

      // For each color key, set/update a document with the color ID or key as document ID
      for (const key in colorJson) {
        if (colorJson.hasOwnProperty(key)) {
          const colorData = colorJson[key];
          // Use colorId or key as the document ID (adjust as needed)
          const docRef = doc(colorsCollection, colorData.colorId?.toString() || key);
          batch.set(docRef, colorData, { merge: true }); // Use merge: true to update existing docs
        }
      }

      await batch.commit();
      alert("Colors added/updated successfully.");
    } catch (error) {
      console.error("Error batch writing colors:", error);
      alert("Failed to add/update colors. See console for details.");
    }
  };

  return (
    <button onClick={addOrUpdateColors}>
      Add or Update Multiple Colors in Firestore
    </button>
  );
};

export default AddOrUpdateColorsButton;
