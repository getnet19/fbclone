import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [Users, setUsers] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/find/${post.userId}`);
      setUsers(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put(
        "/post/likes/" + post._id,
        { userId: currentUser._id },
        { headers: { token: `Bearer ${currentUser.tokens}` } }
      );
    } catch (error) {
      console.log(error);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${Users._id}`}>
              <img
                className="postProfileImg"
                src={Users.profilePictcher? PF+Users.profilePictcher: PF + "person/noProfile.jpg"}
                alt=""
              />
            </Link>
            <span className="postUsername">{Users.firstName}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          {post?.desc && <span className="postText">{post?.desc}</span>}
          {post?.image && (
  <img className="postImg" src={PF + post.image} alt="wow" />
)}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src="/assets/like.png"
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src="/assets/heart.png"
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
