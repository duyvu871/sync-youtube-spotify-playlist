import { addDoc, collection, updateDoc, getDoc, setDoc, doc } from "firebase/firestore";
import { database } from "../configs/firebase.js";

export async function setUser(userId = "", data = {}) {
    try {
        const docRef = await setDoc(doc(database, "users", userId), {
            ...data,
        });

        console.log("Document written with ID: ", docRef);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function updateUser(userId = "", dataUpdate = {}) {
    try {
        const updateRef = await updateDoc(doc(database, "users", userId), {
            ...dataUpdate
        });
    } catch (e) {
        console.error("Error update document: ", e);
    }
}

export async function getUser(userId = "") {
    try {
        const userDoc = await getDoc(doc(database, "users", userId));
        return userDoc;
    } catch (e) {
        console.log("Error get document:", e);
    }
}


