// src/services/rangeService.js

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
import { db } from "../firebase.js"; 




const RangeCollectionRef = collection(db, "ranges");

const RangeService = {
  // Fetch all ranges from Firestore
  getAllRanges: async () => {
    const snapshot = await getDocs(RangeCollectionRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Fetch a single range by document ID
  getRangeById: async (id) => {
    const docRef = doc(db, "ranges", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Range not found with ID: " + id);
    }
  },

  // Add a new range document
  addRange: async (rangeData) => {
    const docRef = await addDoc(RangeCollectionRef, rangeData);
    return docRef.id;
  },

  // Update existing range document by ID
  updateRange: async (id, rangeData) => {
    const docRef = doc(db, "ranges", id);
    // Use updateDoc if you want to patch fields selectively, or setDoc for full overwrite
    await updateDoc(docRef, rangeData);
  },

  // Delete a range document by ID
  deleteRange: async (id) => {
    const docRef = doc(db, "ranges", id);
    await deleteDoc(docRef);
  },


};

export default RangeService;
