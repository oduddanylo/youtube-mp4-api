import express from "express";
import { exec } from "child_process";
import util from "util";

const app = express();
const execPromise = util.promisify(exec);

app.get("/", (req, res) => {
  res.send("YouTube to MP4 API is running 🚀");
});

app.get("/convert", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const { stdout } = await execPromise(`yt-dlp -g -f mp4 "${videoUrl}"`);
    const downloadUrl = stdout.trim();
    res.json({ download_url: downloadUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Conversion failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

