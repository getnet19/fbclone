import React, { useContext, useEffect, useRef, useState } from "react";
import Topbar from "../../components/topbar/Topbar";
import "./messenger.css";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { io } from "socket.io-client";
import { Search } from "@material-ui/icons";

export default function Messenger() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setnewMessages] = useState("");
  const [arriavalMessage, setArriavalMessage] = useState("");

  // const [socket, setSocket] = useState(null);
  const socket = useRef();
  const scroolRef = useRef();

  useEffect(()=>{
    socket.current= io("ws://localhost:8900");
    socket.current.on("getMessage",(data)=>{
      setArriavalMessage({
        senderId:data.senderId,
        text:data.text,
        createdAt:Date.now()
      })
    })
  },[]);
  

  useEffect(()=>{
    arriavalMessage && currentChat?.members.includes(arriavalMessage.senderId) &&
    setMessages(prev=>[...prev,arriavalMessage])
  },[arriavalMessage,currentChat])
    
    //take message from server
    useEffect(()=>{
      socket.current.emit("addUser",user._id)
      socket.current.on("getUser",(users)=>{
        
      })
    },[user]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await axios.get("/conversations/find/" + user._id);
        setConversation(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [user._id]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.get("/messages/find/" + currentChat?._id);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  //create new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    const Message = {
      conversationId: currentChat._id,
      senderId: user._id,
      text: newMessages,
    };
  
    const receiverId = currentChat?.members.find((member) => member !== user._id);
   console.log(receiverId)
   console.log("hello")
      socket.current.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text: newMessages,
      });
  
    try {
      const res = await axios.post("/messages/create", Message);
      setMessages([...messages, res.data]);
      setnewMessages("");
    } catch (error) {
      console.error(error);
    }
  };

  //message scrollTop
  useEffect(() => {
    scroolRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      <Topbar />
      <div className="messenger">
        <form className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="searchbarChatMenu">
              <Search className="searchIcon" />
              <input placeholder="find friends...." className="chatMenuInput" />
            </div>
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation
                  conversations={c}
                  currentUser={user}
                  key={c._id}
                />
              </div>
            ))}
          </div>
        </form>

        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxTop">
              {messages?.map((m) => (
                <div ref={scroolRef}>
                  <Message
                    message={m}
                    own={m.senderId === user._id}
                    key={m._id}
                  />
                </div>
              ))}
            </div>
            {currentChat ? (
              <>
                <form className="chatBoxBottom">
                  <textarea
                    placeholder="write a message..."
                    className="chatMessageInput"
                    onChange={(e) => setnewMessages(e.target.value)}
                    value={newMessages}
                  ></textarea>
                  <button
                    className="chatSubmitButton"
                    type="submit"
                    onClick={handleSubmit}  
                    style={{cursor:newMessages.length===0?"not-allowed":"pointer"}}
                    disabled={newMessages.length === 0}
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <p className="offlineChat">open conversation to start chat!</p>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
            <ChatOnline />
            <ChatOnline />
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
}
