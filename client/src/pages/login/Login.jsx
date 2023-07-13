import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/authContext";
import { CircularProgress } from "@material-ui/core";

export default function Login() {
  const email = useRef();
  const password = useRef();

  const { user, isFeaching, error, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall({ email:email.current.value, password:password.current.value },dispatch);
    
  };
  console.log(user)
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Ashewa Media</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Ashewa Media.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              name="email"
              className="loginInput"
              required
              ref={email}
              pattern=".{10,50}"
            />
            <input
              placeholder="Password"
              type="password"
              name="password"
              ref={password}
              className="loginInput"
              required
              pattern=".{8,}"
            />
            <button className="loginButton" type="submit" disabled={isFeaching}>{isFeaching?<CircularProgress color="white" size="25px"/>:"login"}</button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
              Create a New Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
