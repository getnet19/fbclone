import React, { useEffect, useState } from "react";
import "./message.css";
import { format } from "timeago.js";
import axios from "axios";

export default function Message({ message, own }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [chatUser, setChatUser] = useState();
  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get("/users/find/" + message.senderId);
      setChatUser(res.data);
    };
    getUser();
  }, [message]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={
            chatUser?.profilePictcher
              ? PF + chatUser.profilePictcher
              : PF + "person/noProfile.jpg"
          }
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
