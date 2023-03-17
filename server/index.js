import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { initializeApp } from "firebase/app";
import { doc, setDoc, getDoc} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyDv5yUd4QxeFMnYY4GQQqYJa0oPt88Ji8Q",
  authDomain: "modiet.firebaseapp.com",
  projectId: "modiet",
  storageBucket: "modiet.appspot.com",
  messagingSenderId: "2562820706",
  appId: "1:2562820706:web:61a7125746e8c47f0adf3b",
  databaseURL: "https://modiet-default-rtdb.europe-west1.firebasedatabase.app",
};

// const { Wit } = nodewit
const app = express();
var jsonParser = express.json();
const port = process.env.PORT || 3000;

app.use(cors());

// Initialize Firebase
const fire_app = initializeApp(config);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(fire_app);

/**
 * Retrieve data from the firebase using the database name and botID
 * @param range database name
 * @param id botID
 * @returns {Promise<DocumentData>}
 */
const fetchData = async (range, id) => {
  const docRef = doc(db, range, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
  return docSnap.data();
}

/**
 * Write the bot related data into the firebase
 * @param range database name
 * @param id botID
 * @param values bot related data in JSON format
 * @returns {Promise<void>}
 */
const writeData = async (range, id, values) => {
  const docRef = await setDoc(doc(db, range, id), values);
}

/**
 * Post the bot details to the storage
 */
app.post("/v1/demo", jsonParser, async (req, res) => {
  const {
      botId,
      botIcon,
      botIntro,
      botName,
      serverURL,
      consentNote,
      description,
      developmentPlatform,
      displayContent,
      embedCode,
      enableBugReport,
      enableFeedback,
      feedbackLink,
      title
    } = req.body;

  const value = {
    "botId": botId,
    "botIcon": botIcon,
    "botIntro": botIntro,
    "botName": botName,
    "serverURL": serverURL,
    "consentNote": consentNote,
    "description": description,
    "developmentPlatform": developmentPlatform,
    "displayContent": displayContent,
    "embedCode": embedCode,
    "enableBugReport": enableBugReport,
    "enableFeedback": enableFeedback,
    "feedbackLink": feedbackLink,
    "title": title
  }
  // const value = req.body;
  // console.log(`value: ` + JSON.stringify(value));
  // console.log(`botID: ` + JSON.parse(JSON.stringify(value))['botID']);
  try {
    await writeData("botConfig", value['botID'], value);
    console.log("Document written with ID: ", value['botID']);
    return res.json({ msg: "firebase updated!" });
  }
  catch (e){
    console.error("Error adding data: ", e);
    res.json({ msg: e })
  }
});

/**
 * Get Data using the particular botID: http://localhost:3012/v1/demo/?id=bn23u8r32
 */
app.get("/v1/demo", async (req, res) => {
  try {
    console.log(req.query.id);
    const data = await fetchData("botConfig", req.query.id);
    res.send(data)
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

/**
 *
 */
app.post("/v1/bug-report", jsonParser, async (req, res) => {
  try {
    const { session_id, bug_description } = req.body;
    await writeData("bug_report", session_id, {
      "session_id": session_id,
      "bug_description": bug_description
    });
    return res.json({ msg: "Database updated!" });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

/**
 * Code to generate a simple chat-bot example.
 */
app.post("/v1", jsonParser, async (req, res) => {
  const { session_id, user_id, text, ...rest } = req.body;
  handleMessage(text).then((data) => {
    const response = handleQuery(data.intents);
    res.send({ session_id, user_id, nlu: { ...response, ...data }, ...rest });
  });
});

const handleMessage = async (message) => {
  try {
    const client = new Wit({ accessToken });
    const response = await client.message(message, {});
    return response;
  } catch (err) {
    console.log(err);
  }
};

const handleQuery = (intents) => {
  if (intents.length <= 0) {
    return { response: "Can you say that again?" };
  }
  const query = intents[0].name;
  switch (query) {
    case "greeting":
      return { response: "Hello, how are you today?" };
    case "movie_recommendation":
      return { response: "Oh yes I can help recommend a movie to you" };
    case "greeting_acknowledgement":
      return { response: "Great!" };
    case "exit_greeting":
      return { response: "Talk to you later" };
    case "appreciation":
      return { response: "Awww! thanks for the kind word" };
    default:
      return { response: "Can you say that again?" };
  }
};

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
