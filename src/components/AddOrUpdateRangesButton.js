import React from "react";
import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase.js";
import rangeJson from "../services/rangeJson.js";

const AddOrUpdateRangesButton = () => {
  const addOrUpdateRanges = async () => {
    const batch = writeBatch(db);
    try {
      const rangesCollection = collection(db, "ranges");

      // For each range key, set/update a document with the range ID or key as document ID
      for (const key in rangeJson) {
        if (rangeJson.hasOwnProperty(key)) {
          const rangeData = rangeJson[key];
          // Use rangeId or key as the document ID (adjust as needed)
          const docRef = doc(rangesCollection, rangeData.rangeId?.toString() || key);
          batch.set(docRef, rangeData, { merge: true }); // Use merge: true to update existing docs
        }
      }

      await batch.commit();
      alert("Ranges added/updated successfully.");
    } catch (error) {
      console.error("Error batch writing ranges:", error);
      alert("Failed to add/update ranges. See console for details.");
    }
  };

  return (
    <button onClick={addOrUpdateRanges}>
      Add or Update Multiple Ranges in Firestore
    </button>
  );
};

export default AddOrUpdateRangesButton;
