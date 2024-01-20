import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { query, collection, where, getDocs, limit } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB1EXrmSkcIXvfrBqkimhFXKpEm13_3fHw",
  authDomain: "my-tiny-blog.firebaseapp.com",
  projectId: "my-tiny-blog",
  storageBucket: "my-tiny-blog.appspot.com",
  messagingSenderId: "177463810851",
  appId: "1:177463810851:web:a4eb02d8e12e0e29b04a96",
  measurementId: "G-68KPJXR42Q",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
export const storage = getStorage(app);

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Convert Firestore Timestamp to milliseconds if they exist
    createdAt: data.createdAt ? data.createdAt.toMillis() : null,
    updatedAt: data.updatedAt ? data.updatedAt.toMillis() : null,
  };
}

export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    // No such user found
    return null;
  }

  // Return the first user document
  const userDoc = querySnapshot.docs[0];
  return userDoc;
}
