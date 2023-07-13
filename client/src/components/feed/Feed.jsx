import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

export default function Feed({ userId }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const res = userId
  //       ? await axios.get("/post/profile/" + userId)
  //       : await axios.get(`post/allpost/${user._id}`);
  //     setPosts(
  //       res.data.sort((p1, p2) => {
  //         return new Date(p2.createdAt) - new Date(p1.createdAt);
  //       })
  //     );
  //   };
  //   fetchPosts();
  // }, [userId, user._id]);

  //get all post
  useEffect(() => {
    const fetchPosts = async () => {
      const res = userId
        ? await axios.get("/post/profile/" + userId)
        : await axios.get(`post/allpost`);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [userId, user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {userId ? userId === user._id && <Share /> : <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
