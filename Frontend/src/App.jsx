import React, { useState, useEffect, useCallback } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import SignIn from "./Pages/SignIn/SignIn";
import Singup from "./Pages/Singup/Singup";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import Dashboard from "./Pages/Dashboard/Dashboard";
import VehicalManagement from "./Pages/Vehical Management/VehicalManagement";
import UserDetails from "./Pages/UsersDetails/UserDetails";
import SoftwareCreation from "./Pages/Software Creation/SoftwareCreation";
import Camapign from "./Pages/Campaign/Camapign";
import Settings from "./Pages/Settings/Settings";
import "./App.css";
import "./Styles/ToggleBackground.css"

// Normal User Routes
import NormalVehicalManagement from './Pages/Vehical Management/NormalVehicalManagement';
import NormalSoftwareList from './Pages/Software Creation/NormalSoftwareList';
import NormalCamapign from './Pages/Campaign/NormalCampaignList';
import Sidebar from "./Components/Sidebar/Sidebar";
import GetThemeColor from "./Util/GetThemColor";
import { getTextColor } from "./Util/GetTextColors";
import InvalidURL from "./Pages/Unknow_Page/InvalidURL";



function App() {

  const [role, setRole] = useState(localStorage.getItem('Role') || null); // Initialize state with localStorage value
  // State to force re-render
  // const [forceRender, setForceRender] = useState(true);
  const [clickCount, setClickCount] = useState(0)
  const { theme } = GetThemeColor()
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const storedRole = localStorage.getItem('Role');
      setRole(storedRole); // Update the role state dynamically
    };

    window.addEventListener('storage', handleStorageChange);

    const initialRole = localStorage.getItem('Role');
    if (!initialRole && window.location.pathname !== "/register" && window.location.pathname !== "/forgot") {
      navigate('/');
    } else {
      setRole(initialRole); // Update the role if it exists
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  // // The function that forces a re-render by toggling state
  // const forceReRender = () => {
  //   // setForceRender(prevState => !prevState); // Toggle the state value
  //   setForceRender(!forceRender)
  // };

  // // Event listener function to listen for 'click' event
  // function call(e) {
  //   // console.log("clicked");
  //   if (e.target.id === "input") {
  //     console.log("Theme Change Button clicked!");
  //     setClickCount(clickCount + 1)
  //   }
  //   forceReRender(); // Force a re-render when clicked
  // }

  const call = useCallback(() => {
    console.log("Clicked!");
    setClickCount(prev => prev + 1);
  }, []); // Memoize the function, it won't change unless necessary


  // UseEffect to add and remove the event listener
  useEffect(() => {
    window.addEventListener('click', call);

    // Cleanup : Remove event listener when component unmounts
    return () => {
      window.removeEventListener('click', call);
    };
  }, [clickCount, call]);

  const locationPath = (window.location.pathname !== "/" && window.location.pathname !== "/register" && window.location.pathname !== "/forgot")


  return (

    <div className="App"
      style={{
        width: locationPath ? "90%" : '100%',
        background: (theme === "black" || theme === null || theme === undefined) ? "black" : theme,
        color: getTextColor(theme),
      }}
    >

      {locationPath && (
        <div style={{ maxWidth: '7%', width: "auto", position: "fixed", height: '100%', zIndex: 6 }}>
          <Sidebar role={role} />
        </div>
      )}

      <div id="routes"
        style={{
          left: locationPath ? "10%" : '0',
        }}
      >

        {/* <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<Singup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Dashboard/users" element={<UserDetails />} />
          <Route path="/Dashboard/vehicles" element={<VehicalManagement />} />
          <Route path="/Dashboard/software" element={<SoftwareCreation />} />
          <Route path="/Dashboard/campaign" element={<Camapign />} />
          <Route path="/Dashboard/settings" element={<Settings />} />

          <Route path="*" element={<div id="InvalidURL">Invalid URL</div>} />
        </Routes> */}

        <Routes>
          {/* Login Route */}
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<Singup />} />
          <Route path="/forgot" element={<ForgotPassword />} />

          {/* Admin Route */}
          {role === "Admin" && (
            <>
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Dashboard/users" element={<UserDetails />} />
              <Route path="/Dashboard/vehicles" element={<VehicalManagement />} />
              <Route path="/Dashboard/software" element={<SoftwareCreation />} />
              <Route path="/Dashboard/campaign" element={<Camapign />} />
              <Route path="/Dashboard/settings" element={<Settings />} />
            </>
          )}

          {/* Campaign Manager Route */}
          {role === "Campaign Manager" && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/vehicles" element={<VehicalManagement />} />
              <Route path="/dashboard/software" element={<SoftwareCreation />} />
              <Route path="/dashboard/campaign" element={<Camapign />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </>
          )}

          {/* Normal User Route */}
          {role === "Normal" && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* <Route path="/dashboard/users" element={<NormalUserDetails />} /> */}
              <Route path="/dashboard/vehicles" element={<NormalVehicalManagement />} />
              <Route path="/dashboard/software" element={<NormalSoftwareList />} />
              <Route path="/dashboard/campaign" element={<NormalCamapign />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </>
          )}

          {/* It Helps To Catch All Invalid URLs */}
          <Route path="*" element={<InvalidURL />} />

        </Routes>

      </div>
    </div>

  );
}

export default App;

