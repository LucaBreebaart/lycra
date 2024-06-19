import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { handleUploadOfImage } from './BucketService';

export const handleRegister = async ({ username, email, password, profilePhoto }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Upload profile photo to Firebase Storage and get the download URL
    const photoURL = await handleUploadOfImage(profilePhoto, user.uid);

    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username: username,
      email: user.email,
      profilePhoto: photoURL,
      createdAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error("Error in handleRegister:", error.message);
    return false;
  }
};

export const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log('User signed out successfully');
    })
    .catch((error) => {
      console.log('Error signing out:', error);
    });
};


export const handlelogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("logged in user: " + user.email);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
}
