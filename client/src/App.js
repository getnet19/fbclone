import { useContext } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import Messenger from "./pages/messenger/Messenger";


function App() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route exact path="/" element={user ? <Home /> : <Register />} />
      <Route exact path="/profile/:userId" element={user?<Profile />:<Navigate to="/login" />} />
      <Route
        exact
        path="/login"
        element={user ? <Navigate to="/" /> : <Login />}
      />
      <Route
        exact
        path="/register"
        element={user ? <Navigate to="/" /> : <Register />}
      />
      <Route path="/chat" element={user? <Messenger/>:<Navigate to="/login"/>}/>
    </Routes>
  );
}

export default App;
