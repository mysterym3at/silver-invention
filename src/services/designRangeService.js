import {
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const designsCollectionRef = collection(db, "designs");

const DesignRangesService = {
  getDesignById: async (id) => {
    if (!id) return null;
    try {
      const docRef = doc(db, "designs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching design by ID:", error);
      return null;
    }
  },

  // Optionally, other methods like getAllDesigns defined previously

};

export default DesignRangesService;
