import React from "react";
import { collection, addDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase.js"; 
import handbagJson from "../services/handbagJson.js";


const AddOrUpdateHandbagsButton = () => {
  const addOrUpdateHandbags = async () => {
    const batch = writeBatch(db);
    try {
      const handbagsCollection = collection(db, "handbags");

      // For each handbag key, set/update a document with the handbag ID or key as document ID
      for (const key in handbagJson) {
        if (handbagJson.hasOwnProperty(key)) {
          const handbagData = handbagJson[key];
          // Use handbagId or key as the document ID (adjust as needed)
          const docRef = doc(handbagsCollection, handbagData.handbagId?.toString() || key);
          batch.set(docRef, handbagData, { merge: true }); // Use merge: true to update existing docs
        }
      }

      await batch.commit();
      alert("Handbags added/updated successfully.");
    } catch (error) {
      console.error("Error batch writing handbags:", error);
      alert("Failed to add/update handbags. See console for details.");
    }
  };

  return (
     <button
      style={{
        padding: "10px 20px",
        backgroundColor: "#0069d9",
        color: "white",
        border: "none",
        borderRadius: 5,
        cursor: "pointer",
        marginTop: 20
      }}
      onClick={addOrUpdateHandbags}
    >
   Add or Update Multiple Handbags in Firestore
    </button>
  );
};


export default AddOrUpdateHandbagsButton;
