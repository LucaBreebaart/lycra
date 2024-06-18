import { collection, addDoc, getDocs, query, orderBy, where, doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

export const createNewCompetitionItem = async (Competition) => {
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

export const getMyCompetitionList = async () => {
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
    try {
        if (!competitionId) {
            throw new Error("CompetitionId is undefined or null");
        }

        var allHoles = [];
        var q = query(collection(db, "holes"), where("competitionId", "==", competitionId), orderBy("holeNumber"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            allHoles.push(doc.data());
        });

        return allHoles;
    } catch (e) {
        console.error("Error getting competition holes: ", e);
        throw e; // Re-throw the error to be handled where the function is called
    }
}


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

// Submit scores to db
export const submitScoresToDb = async (competitionId, userId, scores) => {
    try {
        const batch = writeBatch(db);
        Object.keys(scores).forEach((holeNumber) => {
            const scoreRef = doc(collection(db, "scores"));
            batch.set(scoreRef, {
                competitionId,
                userId,
                holeNumber: parseInt(holeNumber),
                score: parseInt(scores[holeNumber])
            });
        });
        await batch.commit();
        console.log("All scores submitted successfully");
        return true;
    } catch (e) {
        console.error("Error submitting all scores: ", e);
        return false;
    }
};

// Fetch scores for a specific competition
export const getScoresForCompetition = async (competitionId) => {
    try {
        const q = query(collection(db, "scores"), where("competitionId", "==", competitionId));
        const querySnapshot = await getDocs(q);
        const scores = [];
        querySnapshot.forEach((doc) => {
            scores.push(doc.data());
        });
        return scores;
    } catch (e) {
        console.error("Error getting scores: ", e);
        return [];
    }
};
