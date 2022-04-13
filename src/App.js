import { Routes, Route } from "react-router-dom";
import Home from "./components/Room/Home";
import About from "./components/Room/About";
import Editor from "./components/Room/Editor";
import Settings from "./components/Room/Settings";
import Whiteboard from "./components/Room/Whiteboard";
import Room from "./pages/Room";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Main from "./pages/Main";
import PageNotFound from "./pages/PageNotFound";
import UserBlocked from "./pages/UserBlocked";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/rooms/:meetingId/" element={<Room />}>
        <Route path="home" element={<Home />} />
        <Route path="whiteboard" element={<Whiteboard />} />
        <Route path="editor" element={<Editor />} />
        <Route path="settings" element={<Settings />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/room/blocked" element={<UserBlocked />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
