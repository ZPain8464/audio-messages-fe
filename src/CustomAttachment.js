import React from "react";
import { Attachment } from "stream-chat-react";

const AudioAttachment = (audioAttachments) => {
    const srcUrl = audioAttachments.audioAttachments.asset_url;

    return (
      <div className="str-chat__message-attachment--audio">
        <div className="str-chat__attachment">
          <div className="str-chat__audio">
            <div className="str-chat__audio__wrapper">
              <audio controls>
                <source data-testid="audio-source" src={srcUrl} type="audio/mp3"/>
              </audio>
            </div>
          </div>
        </div>
      </div>
    )

  }

export const CustomAttachment = (props) => {
    const { attachments } = props;

    if (attachments[0].type === 'audio') {
      return <AudioAttachment audioAttachments={attachments[0]}/>
    }

    return <Attachment {...props} />

  };