import React from "react";
import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase.js";
import designJson from "../services/designJson.js";

const AddOrUpdateDesignsButton = () => {
  const addOrUpdateDesigns = async () => {
    const batch = writeBatch(db);
    try {
      const designsCollection = collection(db, "designs");

      // For each design key, set/update a document with the design ID or key as document ID
      for (const key in designJson) {
        if (designJson.hasOwnProperty(key)) {
          const designData = designJson[key];
          // Use designId or key as the document ID (adjust as needed)
          const docRef = doc(designsCollection, designData.designId?.toString() || key);
          batch.set(docRef, designData, { merge: true }); // Use merge: true to update existing docs
        }
      }

      await batch.commit();
      alert("Designs added/updated successfully.");
    } catch (error) {
      console.error("Error batch writing designs:", error);
      alert("Failed to add/update designs. See console for details.");
    }
  };

  return (
    <button onClick={addOrUpdateDesigns}>
      Add or Update Multiple Designs in Firestore
    </button>
  );
};

export default AddOrUpdateDesignsButton;
