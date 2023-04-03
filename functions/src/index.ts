import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

admin.initializeApp();

const firestore = admin.firestore();

const corsHandler = cors({origin: true});

export const getFirestoreData = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const snapshot = await firestore.collection("myCollection").get();
      const data = snapshot.docs.map((doc) => doc.data());
      console.log(data);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
});
