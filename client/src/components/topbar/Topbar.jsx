import { Link } from "react-router-dom";
import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const handleLogout =()=>{
    localStorage.removeItem("user");
    window.location.reload();
  }
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Link to="/" style={{ cursor: "pointer", textDecoration: "none" }}>
            <span className="logo">Ashewa Media</span>
          </Link>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <Link
            to="/chat"
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <div className="topbarIconItem">
              <Chat style={{ color: "white" }} />
              <span className="topbarIconBadge">2</span>
            </div>
          </Link>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <div className="logprofile">
          <div className="logout">
            <button className="logout" onClick={handleLogout}>logout</button>
          </div>
          <div>
            <Link to={`/profile/${user._id}`}>
              <img
                src={
                  user?.profilePictcher
                    ? PF + user.profilePictcher
                    : PF + "person/noProfile.jpg"
                }
                alt=""
                className="topbarImg"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
