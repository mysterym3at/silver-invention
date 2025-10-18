import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.js"; 
import handbagJson from "../services/handbagJson.js";

const AddHandbagButton = () => {
  const addHandbag = async () => {
    try {
      const docRef = await addDoc(collection(db, "handbags"), handbagJson);
      alert(`Handbag added with ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding handbag:", error);
      alert("Failed to add handbag. See console for details.");
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
      onClick={addHandbag}
    >
      Add Handbag JSON to Firestore
    </button>
  );
};

export default AddHandbagButton;
