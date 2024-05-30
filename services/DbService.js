// All of our firestore funtionality

// TODO: Create newlist item funtion

import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export const createNewBucketItem = async (item) => {

    try {
        // docref - our refrence to our newley created document 
        // addDoc = adding a new document, which adds it to a collection which links to the db variable in firebase.js
        const docRef = await addDoc(collection(db, "items"), item);

        console.log("Document written with ID: ", docRef.id);
        return true
    } catch (e) {
        console.error("Error adding document: ", e);
        return false
    }
}

// TODO: Get All list items funtionon

export const getMyBucketList = async () => {

    var allItems = []

    var q = query(collection(db, "items"), orderBy('priority', 'desc')) //, where("priority", "==", true)
    const querySnapshot = await getDocs(q);

    // const querySnapshot = await getDocs(collection(db, "items"));

    querySnapshot.forEach((doc) => {

        // console.log(doc.id, "=>", doc.data());

        allItems.push({... doc.data(), id: doc.id})  // Push each docs data to the array I want to return

    });
    // console.log(allItems)
    return allItems
}