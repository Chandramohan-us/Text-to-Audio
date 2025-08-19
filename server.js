import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const VOICERSS_API_KEY = process.env.VOICERSS_API_KEY;
const MYMEMORY_USER_EMAIL = process.env.MYMEMORY_USER_EMAIL || "default@gmail.com";

// ✅ Translation Route (English ↔ Tamil)
app.post("/translate", async (req, res) => {
  try {
    const { text, source, target } = req.body;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${source}|${target}&de=${MYMEMORY_USER_EMAIL}`;

    const response = await axios.get(url);
    const translatedText = response.data.responseData.translatedText;

    res.json({ translatedText });
  } catch (err) {
    console.error("Translation Error:", err.message);
    res.status(500).json({ error: "Translation failed" });
  }
});

// ✅ Text-to-Speech Route
app.post("/tts", async (req, res) => {
  try {
    const { text, lang, gender } = req.body;

    // Choose a voice based on gender
    const voice = gender === "male" ? "John" : "Linda";

    const url = `https://api.voicerss.org/?key=${VOICERSS_API_KEY}&hl=${lang}&v=${voice}&c=MP3&f=44khz_16bit_stereo&src=${encodeURIComponent(
      text
    )}`;

    const response = await axios.get(url, { responseType: "arraybuffer" });

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(response.data);
  } catch (err) {
    console.error("TTS Error:", err.message);
    res.status(500).json({ error: "TTS failed" });
  }
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("✅ Text ↔ Audio Backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
