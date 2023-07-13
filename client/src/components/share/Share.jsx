import { useContext, useRef, useState } from "react";
import axios from "axios";
import "./share.css";
import { PermMedia, Label, Room, EmojiEmotions } from "@material-ui/icons";
import { AuthContext } from "../../context/authContext";

export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log(user);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc,
    };
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("name", file.name);
      newPost.image = file.name;
      try {
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      await axios.post("/post/add", newPost, {
        headers: { token: `Bearer ${user.tokens}` },
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="share">
      <form className="shareWrapper" onSubmit={handleSubmit}>
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePictcher
                ? PF + user.profilePictcher
                : PF + "person/noProfile.jpg"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.firstName + "?"}
            className="shareInput"
            type="text"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
          />
        </div>
        <hr className="shareHr" />
        <div className="shareBottom">
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                type="file"
                style={{ display: "none" }}
                id="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button
            className="shareButton"
            type="submit"
            style={{
              cursor:
                (!desc || desc.length === 0) && (!file || file.length === 0)
                  ? "not-allowed"
                  : "pointer",
            }}
            disabled={
              (!desc || desc.length === 0) && (!file || file.length === 0)
            }
          >
            * Share
          </button>
        </div>
      </form>
    </div>
  );
}
