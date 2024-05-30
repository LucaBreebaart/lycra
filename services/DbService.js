import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export const createNewBucketItem = async (Competetion) => {

    try {
        const docRef = await addDoc(collection(db, "Competetion"), Competetion);
        console.log("Document written with ID: ", docRef.id);
        return true
    } catch (e) {
        console.error("Error adding document: ", e);
        return false
    }
}


export const getMyBucketList = async () => {
    var allCompetetion = []
    var q = query(collection(db, "Competetion"), orderBy("date")); 
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        allCompetetion.push({ ...doc.data(), id: doc.id });
    });

    return allCompetetion;
}