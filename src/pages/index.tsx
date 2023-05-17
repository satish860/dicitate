import React from "react";
import { useState } from "react";
import axios from "axios";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Header from "./components/Header";


export default function Home() {
  const [transcriptionText, setTranscriptionText] = useState("");

  const recorderControls = useAudioRecorder();

  const addAudioElement = async (blob: Blob | MediaSource) => {
    const base_url = "https://api.assemblyai.com/v2";

    const headers = {
      authorization: process.env.NEXT_PUBLIC_ASSEMBLY_AI_KEY,
    };

    const response = await axios.post(`${base_url}/upload`, blob, { headers });
    const upload_url = response.data.upload_url;

    const data = {
      audio_url: upload_url,
      auto_chapters: true,
      punctuate: true,
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
        setTranscriptionText(transcriptionResult.text);
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
    <>
      <Header />
      <Hero />
      <div
        className="App"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "25px",
        }}
      >
        <AudioRecorder
          onRecordingComplete={(blob) => addAudioElement(blob)}
          recorderControls={recorderControls}
        />
        <textarea
          style={{
            height: "20vh",
            width: "50vw",
            borderRadius: "md",
            borderColor: "gray.300",
            borderWidth: "1px",
            padding: "2",
            resize: "none",
          }}
          value={transcriptionText}
          readOnly
        />
      </div>
      <Footer />
    </>
  );
}
