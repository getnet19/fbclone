import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { Add } from "@material-ui/icons";
import { Remove } from "@material-ui/icons";

export default function Rightbar({ users }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={`${PF}gift.png`} alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src={`${PF}ad.png`} alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);
    const [friends, setFriends] = useState([]);
    const [followed, setFollowed] = useState(false);

    useEffect(() => {
      const getFriends = async () => {
        try {
          const res = await axios.get("/users/friends/" + users._id);
          setFriends(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      getFriends();
    }, [users._id]);

    useEffect(() => {
      setFollowed(currentUser.followings.includes(users?._id));
    }, [currentUser, users._id]);

    const handleClick = async () => {
      try {
        if (followed) {
          axios.put(
            "/users/" + users._id + "/unfollow",
            { userId: currentUser._id },
            { headers: { token: `Bearer ${currentUser.tokens}` } }
          );
          console.log(currentUser.tokens);
        } else {
          axios.put(
            "/users/" + users._id + "/follow",
            { userId: currentUser._id },
            { headers: { token: `Bearer ${currentUser.tokens}` } }
          );
          console.log(currentUser.tokens);
        }
      } catch (error) {
        console.log(error);
      }
      setFollowed(!followed);
    };

    return (
      <>
        {users._id
          ? currentUser._id !== users._id && (
              <button className="followButton" onClick={handleClick}>
                {followed ? "unfollow" : "Follow"}
                {followed ? <Remove /> : <Add />}
              </button>
            )
          : ""}

        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{users.currentCity}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{users.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {users.relationship === 1
                ? "Single"
                : users.relationship === 2
                ? "Maried"
                : " "}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={`/profile/${friend._id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePictcher
                      ? PF + friend.profilePictcher
                      : PF + "person/noProfile.jpg"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">
                  {friend.firstName}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {users ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
