import React, { useEffect, useState } from "react";
import "./conversation.css";
import axios from "axios";

function Conversation({conversations,currentUser}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUsers] = useState(null);
  const friendId = conversations.members.find((m)=> m!== currentUser._id);

  useEffect(() => {
    const getFriend = async () => {
      const res = await axios.get("/users/find/"+friendId);
      setUsers(res.data);
    };
    getFriend();
  },[conversations,currentUser]);

  return (
    <div className="conversation">
      <img className="conversationImg" src={user?.profilePictcher ? PF + user.profilePictcher:PF+"person/noProfile.jpg"} alt="" />
      <span className="converationName">{user?.firstName}</span>
    </div>
  );
}

export default Conversation;
