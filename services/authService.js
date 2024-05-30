import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

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

export const handleRegister = async ({ username, email, password }) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            email: user.email,
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
}