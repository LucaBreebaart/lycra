import { collection, addDoc, getDocs, query, orderBy, where, doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";  // Import auth from the Firebase configuration

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

// Function to join competition
export const joinCompetition = async (competitionId, userId) => {
    try {
        const docRef = await addDoc(collection(db, "competitionParticipants"), {
            competitionId,
            userId
        });
        console.log("Participant added with ID: ", docRef.id);
        return true;
    } catch (e) {
        console.error("Error adding participant: ", e);
        return false;
    }
};

// Fetch competition participants
export const getCompetitionParticipants = async (competitionId) => {
    try {
        const q = query(collection(db, "competitionParticipants"), where("competitionId", "==", competitionId));
        const querySnapshot = await getDocs(q);
        const participants = [];
        querySnapshot.forEach((doc) => {
            participants.push(doc.data().userId);
        });
        return participants;
    } catch (e) {
        console.error("Error getting participants: ", e);
        return [];
    }
};

// Fetch user details
export const getUserDetails = async (userId) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such user!");
            return null;
        }
    } catch (e) {
        console.error("Error getting user details: ", e);
        return null;
    }
};

export const submitScores = async (competitionId, scores) => {
    try {
        const userId = auth.currentUser.uid;
        const scoresRef = doc(collection(db, "competitionScores"), `${competitionId}_${userId}`);
        await setDoc(scoresRef, { competitionId, userId, scores });
        console.log("Scores submitted successfully");
        return true;
    } catch (e) {
        console.error("Error submitting scores: ", e);
        return false;
    }
};