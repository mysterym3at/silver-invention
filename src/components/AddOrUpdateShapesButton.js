import React from "react";
import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase.js";
import shapeJson from "../services/shapeJson.js";

const AddOrUpdateShapesButton = () => {
  const addOrUpdateShapes = async () => {
    const batch = writeBatch(db);
    try {
      const shapesCollection = collection(db, "shapes");

      // For each shape key, set/update a document with the shape ID or key as document ID
      for (const key in shapeJson) {
        if (shapeJson.hasOwnProperty(key)) {
          const shapeData = shapeJson[key];
          // Use shapeId or key as the document ID (adjust as needed)
          const docRef = doc(shapesCollection, shapeData.shapeId?.toString() || key);
          batch.set(docRef, shapeData, { merge: true }); // Use merge: true to update existing docs
        }
      }

      await batch.commit();
      alert("Shapes added/updated successfully.");
    } catch (error) {
      console.error("Error batch writing shapes:", error);
      alert("Failed to add/update shapes. See console for details.");
    }
  };

  return (
    <button onClick={addOrUpdateShapes}>
      Add or Update Multiple Shapes in Firestore
    </button>
  );
};

export default AddOrUpdateShapesButton;
