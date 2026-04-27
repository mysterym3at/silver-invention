import React, { useEffect, useState } from "react";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase.js"; // adjust path to your firebase config

const HandbagsJsonViewer = () => {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHandbags() {
      try {
        const snapshot = await getDocs(collection(db, "handbags"));
        const data = [];

        // Helper to check if value is Firestore document reference
        const isFirestoreRef = (val) =>
          val && typeof val === "object" && val.firestore && val._key;

        for (const docSnapshot of snapshot.docs) {
          const docData = docSnapshot.data();

          // Resolve reference fields by fetching referenced docs
          for (const key in docData) {
            if (isFirestoreRef(docData[key])) {
              try {
                const refDoc = await getDoc(docData[key]);
                if (refDoc.exists()) {
                  docData[key] = { id: refDoc.id, ...refDoc.data() };
                } else {
                  docData[key] = null;
                }
              } catch {
                docData[key] = null;
              }
            }
            // Special handling for designIds array of references
            else if (
              key === "designIds" &&
              Array.isArray(docData[key]) &&
              docData[key].length > 0 &&
              isFirestoreRef(docData[key][0])
            ) {
              const resolvedDesigns = await Promise.all(
                docData[key].map(async (ref) => {
                  try {
                    const designDoc = await getDoc(ref);
                    return designDoc.exists()
                      ? { id: designDoc.id, ...designDoc.data() }
                      : null;
                  } catch {
                    return null;
                  }
                })
              );
              docData[key] = resolvedDesigns.filter(Boolean);
            }
          }

          // Optionally add the document id inside the object or omit this line if you want no IDs at all
          // docData.id = docSnapshot.id;

          data.push(docData);
        }

        setJsonData(data);
      } catch (err) {
        setError(err.message || "Failed to fetch handbags");
      } finally {
        setLoading(false);
      }
    }
    fetchHandbags();
  }, []);

  // Function to trigger download of JSON file
  const downloadJsonFile = () => {
    if (!jsonData) return;
    const fileName = "handbags-export.json";
    const jsonStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  if (loading) return <p>Loading handbags JSON...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <button onClick={downloadJsonFile}>Download JSON</button>
      <pre>{JSON.stringify(jsonData, null, 2)}</pre>
    </div>
  );
};

export default HandbagsJsonViewer;
