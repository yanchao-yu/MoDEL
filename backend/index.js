import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import nodewit from 'node-wit'
import { google } from 'googleapis'

const { Wit } = nodewit
const app = express();
var jsonParser = express.json();
const port = process.env.PORT || 5174;

app.use(cors());

const accessToken = process.env.WIT_TOKEN;
const keyFile = process.env.GOOGLE_APP_CREDENTIALS;
const spreadsheetId = process.env.SHEET_ID;

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

const authentication = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  const client = await auth.getClient();

  const sheets = google.sheets({
    version: "v4",
    auth: client
  });

  return { sheets };
};

const fetchData = async (range) => {
  const { sheets } = await authentication();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  });
  return response.data;
};

const writeData = async (range, values) => {
  const { sheets } = await authentication();
  const writeReq = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [values]
    }
  });
  return writeReq;
};

app.get("/demo", async (req, res) => {
  try {
    const data = await fetchData("bot_config");
    const [fieldKeys, ...rest] = data.values;
    res.send(rest);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

app.post("/demo", jsonParser, async (req, res) => {
  try {
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
    const writeReq = await writeData("bot_config", [
      botId,
      botIcon,
      botIntro,
      botName,
      consentNote,
      description,
      developmentPlatform,
      displayContent,
      embedCode,
      enableBugReport,
      enableFeedback,
      feedbackLink,
      title,
      serverURL
    ]);
    if (writeReq.status === 200) {
      return res.json({ msg: "Spreadsheet updated!" });
    }
    res.json({ msg: "Something went wrong!" });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

app.post("/bug-report", jsonParser, async (req, res) => {
  try {
    const { session_id, bug_description } = req.body;
    const writeReq = await writeData("bug_report", [
      session_id,
      bug_description
    ]);
    if (writeReq.status === 200) {
      return res.json({ msg: "Spreadsheet updated!" });
    }
    res.json({ msg: "Something went wrong!" });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

app.post("/", jsonParser, async (req, res) => {
  const { session_id, user_id, text, ...rest } = req.body;
  handleMessage(text).then((data) => {
    const response = handleQuery(data.intents);
    res.send({ session_id, user_id, nlu: { ...response, ...data }, ...rest });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
