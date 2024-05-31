import { collection, addDoc, getDocs, query, orderBy, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createNewBucketItem = async (Competition) => {
    try {
        const docRef = await addDoc(collection(db, "Competition"), Competition);
        console.log("Document written with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false };
    }
}

export const createNewHoleItem = async (competitionId, hole) => {
    try {
        const holeWithCompetitionId = { ...hole, competitionId };
        const docRef = await addDoc(collection(db, "holes"), holeWithCompetitionId);
        console.log("Hole added with ID: ", docRef.id);
        return true;
    } catch (e) {
        console.error("Error adding hole: ", e);
        return false;
    }
}

export const getMyBucketList = async () => {
    var allCompetition = []
    var q = query(collection(db, "Competition"), orderBy("date"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        allCompetition.push({ ...doc.data(), id: doc.id });
    });

    return allCompetition;
}

export const getCompetitionDetails = async (competitionId) => {
    const docRef = doc(db, "Competition", competitionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
        return {};
    }
}

export const getCompetitionHoles = async (competitionId) => {
    var allHoles = [];
    var q = query(collection(db, "holes"), where("competitionId", "==", competitionId), orderBy("holeNumber"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        allHoles.push(doc.data());
    });

    return allHoles;
}
