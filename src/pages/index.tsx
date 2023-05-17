import { Inter } from "next/font/google";
import React from "react";
import axios from "axios";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

export default function Home() {
  const recorderControls = useAudioRecorder();
  const addAudioElement = async (blob: Blob | MediaSource) => {
    console.log("Here");
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);

    const base_url = "https://api.assemblyai.com/v2";

    const headers = {
      authorization: "6ace73dddf7241c691e3a5590e43d138",
    };
    console.log("In Step 2");

    const response = await axios.post(`${base_url}/upload`, blob, { headers });
    const upload_url = response.data.upload_url;

    const data = {
      audio_url: upload_url,
      auto_chapters: true,
      punctuate: true
    };
    const final_url = base_url + "/transcript";
    const final_response = await axios.post(final_url, data, {
      headers: headers,
    });
    console.log("Entering transcript");
    const transcriptId = final_response.data.id;
    const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
    while (true) {
      const pollingResponse = await axios.get(pollingEndpoint, {
        headers: headers,
      });
      const transcriptionResult = pollingResponse.data;
      if (transcriptionResult.status === "completed") {
        console.log(transcriptionResult.text);
        break;
      } else if (transcriptionResult.status === "error") {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  };

  return (
    <div>
      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
      />
      <button onClick={recorderControls.stopRecording}>Stop recording</button>
    </div>
  );
}
