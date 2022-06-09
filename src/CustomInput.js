import React, { useState, useRef } from "react";
import micIcon from "./assets/mic-icon.png";
import stopIcon from "./assets/stop-recording.png";
import { SendButton, ChatAutoComplete, FileUploadIconFlat, useChannelStateContext } from "stream-chat-react";
import { FileUploadButton, ImageDropzone } from "react-file-utils";
import TextareaAutosize from 'react-textarea-autosize';


const AudioIcon = ({
    openAudioUI,
    isRecording
}) => {

    return(
        <span
            className="audio_span"
            onClick={openAudioUI}
        >
            <img className={isRecording ? "stop_icon" : "mic_icon"} src={isRecording ? stopIcon : micIcon}/>
        </span>
    )
}



export const CustomInput = () => { 

    let [audioUI, setShowAudioUI] = useState(false);
    let [recorder, setRecorder] = useState(null);
    let [audioSignedUrl, setAudioSignedUrl] = useState("");

    const audioRef = useRef();
    const { channel } = useChannelStateContext();

    const openAudioUI = () => {
        setShowAudioUI(true);
        if (recorder) {
            stopMicrophone();
        } else {
            getMicrophone();
        }
    };

    const closeAudioUI = () => {
        if (recorder) {
            stopMicrophone();
        }
        setAudioSignedUrl("");
        setShowAudioUI(false);
    }

    const getMicrophone = async () => {
        let recorder;
        let stream = null;
        let chunks = [];

        try {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });
            recorder = new MediaRecorder(stream);
            recorder.start();
            
            recorder.ondataavailable = async (e) => {
                chunks.push(e.data);
                //create the Blob from the chunks
                let audioBlob = new Blob(chunks, { type: 'audio/webm' });
                let file = new File([audioBlob], "audioMessage", {type: "audio/webm"});

                // Send file object to Stream's CDN
                const attachment = await channel.sendFile(file);
                const audioUrl = attachment.file;
                
                // Set signed Stream Url to state
                setAudioSignedUrl(audioUrl);

                if(audioRef.current){
                    audioRef.current.pause();
                    audioRef.current.load();
                }
            }
            setRecorder(recorder);
        } catch(err) {
            console.log(err);
        }
    }

    const stopMicrophone = async () => {
        const audioTrack = await recorder.stream.getTracks();
        // Stop audio capture
        audioTrack.forEach(track => track.stop());
        setRecorder(null);
    }

    const sendAudioAttachment = async () => {
        await channel.sendMessage({
            attachments: [
                {
                    type: "audio",
                    asset_url: audioSignedUrl
                }
            ]
        });

        setAudioSignedUrl("");
        setShowAudioUI(false);
    }

    return (
        <div className="custom_input">
            {audioUI && (
                <div className="audio_container">
                    <div className="audio_player">
                        <audio ref={audioRef} controls>
                            <source src={audioSignedUrl} type="audio/mp3" />
                        </audio>
                        <button className="close_audio_button" onClick={closeAudioUI}>X</button>
                        {audioSignedUrl && (
                        <button
                            className="send_button"
                            onClick={sendAudioAttachment}
                        >
                            Send
                        </button>
                        )}
                    </div>
                </div>
            )}
            <ImageDropzone>
                <FileUploadButton>
                        <FileUploadIconFlat />
                </FileUploadButton>
                <AudioIcon 
                    openAudioUI={openAudioUI}
                    isRecording={recorder}
                />
                <ChatAutoComplete>
                    <TextareaAutosize />
                </ChatAutoComplete>
                <SendButton />
            </ImageDropzone>
        </div>
    )
}