// api/convert.js
import ytdl from "ytdl-core";

export default async function handler(req, res) {
  try {
    const url = req.query.url || req.body?.url;
    if (!url) {
      return res.status(400).json({ ok: false, error: "Missing ?url=<youtube_link>" });
    }
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ ok: false, error: "Invalid YouTube URL" });
    }

    const info = await ytdl.getInfo(url);

    // Ищем формат с видео+аудио в контейнере mp4
    const fmt =
      info.formats.find(f => f.hasVideo && f.hasAudio && f.container === "mp4" && f.url) ||
      info.formats.find(f => f.hasVideo && f.hasAudio && f.url);

    if (!fmt?.url) {
      return res.status(404).json({ ok: false, error: "No downloadable mp4 found" });
    }

    // Это прямой временный URL YouTube (подходит для скачивания сторонним сервисом)
    return res.status(200).json({
      ok: true,
      mp4Url: fmt.url,
      contentLength: fmt.contentLength || null,
      itag: fmt.itag,
      mimeType: fmt.mimeType || null
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Conversion failed" });
  }
}
