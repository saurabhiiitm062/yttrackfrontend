import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import FormInput from "./component/FormInput";
import MonitorForm from "./component/MonitorForm";
import Register from "./component/Register";
import UserProfile from "./component/UserProfile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Exact path for the home page */}
        <Route path="/" element={<FormInput />} />

        {/* Path for the Login page */}
        <Route path="/login" element={<Login />} />

        {/* Path for the Monitor page */}
        <Route path="/register" element={<Register />} />
        <Route path="/monitor" element={<MonitorForm />} />
        <Route path="/userprofile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
