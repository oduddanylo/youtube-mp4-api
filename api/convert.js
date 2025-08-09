// api/convert.js
const ytdl = require("ytdl-core");

module.exports = async (req, res) => {
  try {
    const url = (req.query && req.query.url) || (req.body && req.body.url);
    if (!url) return res.status(400).json({ ok: false, error: "Missing ?url=<youtube_link>" });
    if (!ytdl.validateURL(url)) return res.status(400).json({ ok: false, error: "Invalid YouTube URL" });

    const info = await ytdl.getInfo(url);

    const fmt =
      info.formats.find(f => f.hasVideo && f.hasAudio && f.container === "mp4" && f.url) ||
      info.formats.find(f => f.hasVideo && f.hasAudio && f.url);

    if (!fmt || !fmt.url) return res.status(404).json({ ok: false, error: "No downloadable video URL found" });

    return res.status(200).json({
      ok: true,
      mp4Url: fmt.url,
      contentLength: fmt.contentLength || null,
      itag: fmt.itag || null,
      mimeType: fmt.mimeType || null
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Conversion failed" });
  }
};
