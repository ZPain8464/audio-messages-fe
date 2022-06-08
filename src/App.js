import React, { useState, useEffect } from "react";
import './App.css';
import Cookies from "universal-cookie";

import 'stream-chat-react/dist/css/index.css';
import { StreamChat } from "stream-chat";
import { Chat, Channel, ChannelList, ChannelHeader, MessageInput, MessageList, Window } from "stream-chat-react";
import { Auth } from "./Auth";
import { demoUsers } from "./stream-config";
import { CustomInput } from "./CustomInput";
import { CustomAttachment } from "./CustomAttachment";

const vivi = demoUsers.userVivi.id;
const eiko = demoUsers.userEiko.id;
const apiKey = process.env.REACT_APP_STREAM_API_KEY;


const cookies = new Cookies();
const streamToken = cookies.get("streamToken");
const id = cookies.get("id");
const image = cookies.get("image");
const name = cookies.get("name");

const filters = { members: { $in: [ vivi, eiko ] } };
const sort = { last_message_at: -1 };
const options = { limit: 10 };

const Logout = ({ logout }) => {
  return (
    <button
      className='logout_button'
      onClick={logout}
    >
      Logout
    </button>
  )
}

function App() {

  // Get Stream client instance
  const client = StreamChat.getInstance(apiKey);
  let [channel, setChannel] = useState(null);

  // Connect user to stream
  if(streamToken) {
    client.connectUser(
        {
          id: id,
          name: name,
          image: image
        },
        streamToken,
    );
  }

  useEffect(() => {
    if (streamToken) {
      const channel = client.channel(`messaging`, `ff9_chat`, {
        name: 'FF9 Chat',
        members: [vivi, eiko]
      });
      setChannel(channel);
      channel.watch();
    }
  }, []);

  const logout = () => {
    cookies.remove("streamToken");
    cookies.remove("id");
    cookies.remove("image");
    cookies.remove("name");
    window.location.reload();
  }

  if (!streamToken) return <Auth />

  return (
    <div className="App">
      <Chat client={client}>
        <div className="sidebar_container">
          <Logout logout={logout}/>
        </div>
          <ChannelList 
            filters={filters} 
            sort={sort} 
            options={options}
          />
        <Channel 
          channel={channel} 
          Input={CustomInput}
          Attachment={CustomAttachment}
        >
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
}

export default App;
