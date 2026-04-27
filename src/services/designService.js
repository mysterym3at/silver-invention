import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";

const designsCollectionRef = collection(db, "designs");

const DesignService = {
  // Fetch all designs with Firestore references resolved
  getAllDesigns: async () => {
    const snapshot = await getDocs(designsCollectionRef);
    const designs = await Promise.all(
      snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();

        if (data.details && data.details._key) {
          try {
            const shapeDoc = await getDoc(data.details);
            data.details = shapeDoc.exists()
              ? { id: shapeDoc.designid, ...shapeDoc.data() }
              : null;
          } catch {
            data.details = null;
          }
        }

        return {
          id: docSnapshot.id,
          ...data,
        };
      })
    );
    return designs;
  },

  getDesignById: async (id) => {
    const docRef = doc(db, "designs", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data?.details && data.details._key) {
        const shapeDoc = await getDoc(data.details);
        data.details = shapeDoc.exists()
          ? { id: shapeDoc.id, ...shapeDoc.data() }
          : null;
      }
      return { id: docSnap.id, ...data };
    } else {
      throw new Error(`Design not found with ID ${id}`);
    }
  },

  addDesign: async (designData) => {
    const docRef = await addDoc(designsCollectionRef, designData);
    return docRef.id;
  },

  updateDesign: async (id, designData) => {
    const docRef = doc(db, "designs", id);
    await updateDoc(docRef, designData);
  },

  deleteDesign: async (id) => {
    const docRef = doc(db, "designs", id);
    await deleteDoc(docRef);
  },
};

export default DesignService;
