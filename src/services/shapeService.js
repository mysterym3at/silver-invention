import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const ShapeCollectionRef = collection(db, "shapes");

const ShapeService = {
  // Fetch all shapes from Firestore
  getAllShapes: async () => {
    const snapshot = await getDocs(ShapeCollectionRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Fetch a single shape by document ID
  getShapeById: async (id) => {
    const docRef = doc(db, "shapes", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error(`Shape not found with ID ${id}`);
    }
  },

  // Add a new shape document
  addShape: async (shapeData) => {
    const docRef = await addDoc(ShapeCollectionRef, shapeData);
    return docRef.id;
  },

  // Update existing shape document by ID
  updateShape: async (id, shapeData) => {
    const docRef = doc(db, "shapes", id);
    // Use updateDoc to patch fields or setDoc if full overwrite is needed
    await updateDoc(docRef, shapeData);
  },

  // Delete a shape document by ID
  deleteShape: async (id) => {
    const docRef = doc(db, "shapes", id);
    await deleteDoc(docRef);
  },
};

export default ShapeService;
