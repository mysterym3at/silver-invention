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

const HBDesignCollectionRef = collection(db, "designs");

const HBDesignService = {
  getAllHandbags: async () => {
    const snapshot = await getDocs(HBDesignCollectionRef);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  },

  getHandbagById: async (id) => {
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


  addHandbag: async (handbagData) => {
    // When adding, Firestore generates ID automatically
    const docRef = await addDoc(HBDesignCollectionRef, handbagData);
    return docRef.id;
  },

  updateHandbag: async (designId, handbagData) => {
    if (!designId) throw new Error("designId is required for update");
    const docRef = doc(db, "designs", designId);
    await updateDoc(docRef, handbagData);
  },

  deleteHandbag: async (id) => {
    const docRef = doc(db, "designs", id);
    await deleteDoc(docRef);
  },
};

export default HBDesignService;
