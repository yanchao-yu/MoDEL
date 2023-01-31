# Modular Dialogue Evaluation & Demo Interface  (Backend)
This is the repository of the backend implementation of Modular Chat Interface

## Built with
Node & ExpressJS

## Setting up project

### 1) Replace `.env.example` with `.env` and follow the steps below to get secret values
- `WIT_TOKEN`: Signup with your facebook account at wit.ai, create an app and check your settings under the management tab for the server access token. This is your WIT_TOKEN

- `GOOGLE_APP_CREDENTIALS`: Follow this [link](https://developers.google.com/workspace/guides/create-credentials#service-account) to learn how to generate the `secrets.json` file. Once generated and downloaded, add it to the root of your project

- `SHEET_ID`: When you create a sheet from https://sheets.google.com/, this is the `id` in your URL `https://docs.google.com/spreadsheets/d/{id}`

*[Recommendation]: The use of Google Sheets as backend in this project should be replaced with a better database system. I have shared the current sheet to get a view of how the data is structured. Consider the use of [Supabase](https://supabase.com/)*

### 2)  Install packages and dependencies
`npm install`

### 3) Start Server
`npm run server`

## Author
🧑🏿‍💻 Damilola Oduronbi ~
[GitHub](https://github.com/oracleot) . [LinkedIn](https://www.linkedin.com/in/doduronbi/)

## License
Released under the MIT license.