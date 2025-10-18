// src/services/colorService.js

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase"; 




const ColorCollectionRef = collection(db, "colors");

const ColorService = {
  // Fetch all colors from Firestore
  getAllColors: async () => {
    const snapshot = await getDocs(ColorCollectionRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Fetch a single color by document ID
  getColorById: async (id) => {
    const docRef = doc(db, "colors", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Color not found with ID: " + id);
    }
  },

  // Add a new color document
  addColor: async (colorData) => {
    const docRef = await addDoc(ColorCollectionRef, colorData);
    return docRef.id;
  },

  // Update existing color document by ID
  updateColor: async (id, colorData) => {
    const docRef = doc(db, "colors", id);
    // Use updateDoc if you want to patch fields selectively, or setDoc for full overwrite
    await updateDoc(docRef, colorData);
  },

  // Delete a color document by ID
  deleteColor: async (id) => {
    const docRef = doc(db, "colors", id);
    await deleteDoc(docRef);
  },


};

export default ColorService;
