import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [users, setUsers] = useState({});

  const location = useLocation();
  const userId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("/users/find/" + userId);
      setUsers(res.data);
    };
    fetchUser();
  }, [location]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={users.coverPicture|| PF+"person/noCover.png"}
                alt=""
              />
              <img
                className="profileUserImg"
                src={users.profilePictcher? PF + users.profilePictcher: PF + "person/noProfile.jpg"}
                alt=""
              />
            </div>
            
            <div className="profileInfo">
              <h4 className="profileInfoName">{users.firstName} {users.lastName}</h4>
              <span className="profileInfoDesc">{users.description}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed userId={users._id}/>
            <Rightbar users={users}/>
          </div>
        </div>
      </div>
    </>
  );
}
