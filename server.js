const express = require("express");
const fs = require("fs");
const multer = require("multer");
const speech = require("@google-cloud/speech");

const app = express();
const upload = multer({ dest: "uploads/" });
let client;

try {
  client = new speech.SpeechClient({ keyFilename: "service-account.json" });
  console.log("Google client loaded successfully.");
} catch (err) {
  console.error("Google client failed:", err);
}
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const file = req.file;
    const audioBytes = fs.readFileSync(file.path).toString("base64");

    const audio = { content: audioBytes };
    const config = {
      encoding: "LINEAR16",
      languageCode: "en-US",
      alternativeLanguageCodes: ["ar-SA"],
    };
    const request = { audio, config };

    const [operation] = await client.longRunningRecognize(request);
    const [response] = await operation.promise();

    const transcription = response.results
      .map((r) => r.alternatives[0].transcript)
      .join("\n");

    res.json({ text: transcription });
    fs.unlinkSync(file.path);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.get("/transcribe-test", async (req, res) => {
  try {
    const filePath = "non-scam-arabic.wav";
    const audioBytes = fs.readFileSync(filePath).toString("base64");

    const audio = { content: audioBytes };
    const config = {
      encoding: "LINEAR16",
      sampleRateHertz: 24000,
      languageCode: "en-US",
      alternativeLanguageCodes: ["ar-SA"],
    };

    const request = { audio, config };
    const [operation] = await client.longRunningRecognize(request);
    const [response] = await operation.promise();

    const transcription = response.results
      .map((r) => r.alternatives[0].transcript)
      .join("\n");

    res.json({ text: transcription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transcription failed" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
