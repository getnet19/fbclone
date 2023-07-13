import { useRef } from "react";
import "./register.css";
import axios from 'axios'
import {useNavigate,Link} from "react-router-dom"

export default function Register() {
  const email = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const phoneNumber = useRef();
  const password = useRef();
  const passwordAgain = useRef();

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (password.current.value !== passwordAgain.current.value) {
      passwordAgain.current.setCustomValidity("password don't match!");
    } else {
      const user = {
        email: email.current.value,
        firstName: firstName.current.value,
        lastName: lastName.current.value,
        phoneNumber: phoneNumber.current.value,
        password: password.current.value,
        passwordAgain: passwordAgain.current.value,
      };
      try {
        const response = await axios.post("auth/register", user);
          navigate("/login");
        }
       catch (error) {
          console.log(error);
      }
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">Ashewa Media</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on Ashewa Media.
          </span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleClick}>
            <input
              placeholder="firstName"
              type="text"
              className="registerInput"
              required
              pattern=".{4,20}"
              ref={firstName}
            />
            <input
              placeholder="lastName"
              type="text"
              className="registerInput"
              required
              pattern=".{4,20}"
              ref={lastName}
            />
            <input
              placeholder="Email"
              type="email"
              className="registerInput"
              required
              pattern=".{10,50}"
              ref={email}
            />
            <input
              placeholder="phoneNumber"
              type="tel"
              className="registerInput"
              required
              pattern="(?=^(\+251-?09|\+2519)[0-9]{8}$)^.*$"
              ref={phoneNumber}
            />
            <input
              placeholder="Password"
              type="password"
              className="registerInput"
              required
              pattern=".{8,}"
              ref={password}
            />
            <input
              placeholder="Password Again"
              type="password"
              className="registerInput"
              required
              pattern=".{8,}"
              ref={passwordAgain}
            />
            <button className="registerButton" type="submit">
              Sign Up
            </button>
            <Link to="/login">
            <button className="registerRegisterButton">Log into Account</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
