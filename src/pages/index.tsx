import React, { useState, useEffect } from "react";
import axios from "axios";
import { CopyIcon, DeleteIcon } from "@chakra-ui/icons";
import { useAudioRecorder } from "react-audio-voice-recorder";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import { Button } from "@chakra-ui/react";
import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci";

export default function Home() {
  const [transcriptionText, setTranscriptionText] = useState("");
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = useAudioRecorder();

  useEffect(() => {
    if (recordingBlob) {
      addAudioElement(recordingBlob);
    }
  }, [recordingBlob]);

  const addAudioElement = async (blob: any) => {
    console.log("Step 1 ");
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

    const final_url = `${base_url}/transcript`;
    const final_response = await axios.post(final_url, data, { headers });
    console.log("Entering transcript");
    const transcriptId = final_response.data.id;
    const pollingEndpoint = `${base_url}/transcript/${transcriptId}`;

    while (true) {
      const pollingResponse = await axios.get(pollingEndpoint, { headers });
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

  const handleRecordingComplete = () => {
    console.log("Recording complete");
    stopRecording();
  };

  const handleDelete = () => {
    setTranscriptionText("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcriptionText);
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
        {isRecording ? (
          <button onClick={handleRecordingComplete}>
            <CiMicrophoneOff size={60} color="green" />
          </button>
        ) : (
          <button onClick={startRecording}>
            <CiMicrophoneOn size={60} color="green" />
          </button>
        )}

        <div
          style={{
            height: "20vh",
            width: "50vw",
            borderRadius: "md",
            borderColor: "gray.300",
            borderWidth: "1px",
            padding: "2",
            overflow: "auto",
          }}
        >
          {transcriptionText}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "8px",
            marginBottom: "8px",
          }}
        >
          <Button onClick={handleCopy} mr={2} leftIcon={<CopyIcon />}>
            Copy
          </Button>
          <Button onClick={handleDelete} leftIcon={<DeleteIcon />}>
            Delete
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
