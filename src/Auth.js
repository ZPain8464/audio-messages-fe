import React from "react";
import { url, demoUsers } from "./stream-config";
import Cookies from "universal-cookie";

export const Auth = () => {

    const cookies = new Cookies();

    const handleSubmit = async (e) => {
        
        const demoUser = demoUsers[e.target.id];
        const userId = demoUser.id;
        const image = demoUser.image;
        const name = demoUser.name;

          try {
          const request = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({ userId })
          });
    
          const response = await request.json();
          const streamToken = response.token;

          cookies.set("streamToken", streamToken);
          cookies.set("id", userId);
          cookies.set("name", name);
          cookies.set("image", image);

          window.location.reload();

        } catch(error) {
          console.log(error);
        }
        
      }

    return (
    <div className="Auth">
      <h2>Select a user:</h2>
      <div className="user_selection">
        <button
          id="userVivi"
          onClick={(e) => handleSubmit(e)}
        >
          {demoUsers.userVivi.name}
        </button>
        <button
          id="userEiko"
          onClick={(e) => handleSubmit(e)}
        >
          {demoUsers.userEiko.name}
        </button>
      </div>
    </div>
    )
}