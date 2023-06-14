import React, { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./App.css";

function App() {
  const [videoSrc, setVideoSrc] = useState("");
  const [message, setMessage] = useState("Click Start to trimming");
  const [videoUrl, setVideoUrl] = useState("");
  const [dataDownload, setDataDownload] = useState();
  const ffmpeg = createFFmpeg({
    log: true,
  });

  const doTranscode = async () => {
    setMessage("Loading ffmpeg-core.js");
    await ffmpeg.load();
    setMessage("Start trimming first 5 seconds");
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const videoUrlWithProxy = `${proxyUrl}${videoUrl}`;
    const response = await fetch(videoUrlWithProxy);
    const videoBlob = await response.blob();
    const videoFileName = videoUrl.substring(videoUrl.lastIndexOf("/") + 1);

    ffmpeg.FS("writeFile", videoFileName, await fetchFile(videoBlob));
    await ffmpeg.run(
      "-i",
      videoFileName,
      "-ss",
      "00:00:00",
      "-to",
      "00:00:05",
      "output.mp4"
    );

    setMessage("Complete trimming");

    const data = ffmpeg.FS("readFile", "output.mp4");
    setDataDownload(data);
    setVideoSrc(
      URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    );
  };

  const downloadTrimmedVideo = async () => {
    // await ffmpeg.load();
    // const data = ffmpeg.FS("readFile", "output.mp4");
    const blob = new Blob([dataDownload.buffer], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trimmed_video.mp4";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <p />
      <video src={videoSrc} controls></video>
      <br />
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter video URL"
      />
      <button onClick={doTranscode}>Start</button>
      <button onClick={downloadTrimmedVideo} disabled={!dataDownload}>
        Download Trimmed Video
      </button>
      <p>{message}</p>
    </div>
  );
}

export default App;

// https://dy6thm4g4afeg.cloudfront.net/KE-2196/Site-1__KE-2196/manual-upload/20230716/Video-Sample/174631-174651.mp4?Expires=1686582000&Signature=MWXgqNeQi4Dqlva4lBIXL0scY9ScvviZgh~fItgIlBUNyr7rG1BDiRAey7gcg8AoB-i8gSsOzjK1-urb5zUj0koza4yNOot1c9k8fvtExf-S79X10yq8jjg4-hbbLYvkdC7HYuyPteNTwD4Qz~gUaHlcLPHQYXfELvd8OrQBeqpOXgXAkS8i6fY0kBESVOSHal~Kshivmr~qdqET0PUK32hXNgw5dxlRhunzBiAdtV4-qY6elz5itwOnbfBBwshMHZBH~Qrmcp~VQfTqymbYEe86AUC-2-~-MrBrc-QQdRrAl7Gwf2D8DWhmKFgzeJxR41gpf2m838kkC9~i9QgAfg__&Key-Pair-Id=K23ZAAZND8OAF3#t=0.01
