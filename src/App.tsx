import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  let mediaRecorder;
  const recordedChunks = [];
  const videoElement = useRef<HTMLVideoElement>();
  const startButton = useRef<HTMLButtonElement>();
  const stopButton = useRef<HTMLButtonElement>();
  const sourceSelector = useRef<HTMLButtonElement>();
  const [source, setSource] = useState(null);
  const getVideo = async () => {
    if (sourceSelector.current && source) {
      sourceSelector.current.innerText = source.name;

      const constrains: MediaStreamConstraints = {
        audio: false,
        video: {
          //@ts-ignore
          mandatory: {
            chromeMediaSource: "desktop",
            chromseMediaSourceId: source.id ? source.id : "",
          },
        },
      };
      console.log(source);
      const stream = await navigator.mediaDevices.getUserMedia(constrains);
      console.log("stream");
      videoElement.current.srcObject = stream;
      videoElement.current.play();
      const options = { mimeType: "video/webm; codecs=vp9" };
      mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.ondataavailable = handleDataAvaible;
      mediaRecorder.onstop = handleStop;
      console.log(mediaRecorder);
    }
  };
  function handleDataAvaible(e) {
    console.log("video data avaible");
    recordedChunks.push(e.data);
  }
  async function handleStop() {
    const blob = new Blob(recordedChunks, {
      type: "video/webm; codecs=vp9",
    });
    console.log(blob);
    // Send the file to the main process
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    window.electron.ipcRenderer.invoke("open-file-dialog", uint8Array);
  }
  useEffect(() => {
    getVideo();
  }, [source]);
  const startRecording = () => {
    // Disable the Start button
    startButton.current.disabled = true;

    // Enable the Stop button
    stopButton.current.disabled = false;

    // Clear any previously recorded chunks
    recordedChunks.length = 0;

    // Start recording
    mediaRecorder.start();
  };
  const stopRecording = () => {
    // Disable the Stop button
    stopButton.current.disabled = true;

    // Stop recording
    mediaRecorder.stop();
  };
  //sends the invokes the event on the ipcMain to retunr us the source
  const message = async () => {
    await window.electron.ipcRenderer.invoke("openMenu");
    window.electron.listner("source", (event, response) => {
      console.log(event);
      setSource(response);
    });
  };
  return (
    <>
      <h1>Electron Screen Recorder</h1>
      <video ref={videoElement}></video>
      <button ref={startButton} onClick={startRecording} id="startBtn">
        Start
      </button>
      <button ref={stopButton} onClick={stopRecording} id="stopBtn">
        Stop
      </button>
      <hr />
      <button ref={sourceSelector} onClick={message} id="videoSelectBtn">
        Choose a Video Source
      </button>
    </>
  );
}

export default App;
