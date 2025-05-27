import React, { useState, useEffect } from "react";
import { Grid, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import LogOut from "../../images/Icons/LogOutIcon.png"
import { useLogoutUserMutation } from "../../api/api";
import { useNavigate } from "react-router";
import GetThemeColor from "../../Util/GetThemColor";
import ThemeToggleButton from "../ToggleBackground";
import "../../Styles/LogoutButton.css"
import { getTextColor } from "../../Util/GetTextColors";



function Header({ title }) {


  const Role = localStorage.getItem("Role")

  const [themes, setTheme] = useState(localStorage.getItem('theme') || 'black'); // Default theme is light
  const [hoverRole, setHoverRole] = useState(false)

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [logOutUser] = useLogoutUserMutation();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Check the role from localStorage on mount
  useEffect(() => {
    const role = localStorage.getItem("Role");
    if (!role) {
      setIsAuthenticated(false);
    }
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = themes === 'white' ? 'black' : 'white';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save the theme in localStorage
  };


  // // Apply the theme to the body tag
  // useEffect(() => {
  //   document.body.className = theme; // Apply the class based on theme
  // }, [themes]);


  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogOutUser = () => {
    logOutUser()
      .unwrap()
      .then(() => {
        // localStorage.removeItem("Role"); // Remove the Role from localStorage
        localStorage.clear()
        setIsAuthenticated(false); // Dynamically update the authentication state
        navigate("/"); // Redirect to login page
        setAnchorEl(null);
      })
      .catch((er) => {
        navigate("/");
      });
  };

  // function gotousers() {
  //   alert("Function Call Working")
  //   alert("Navigate Not Working")
  //   // navigate("/dashboard/users")
  // }

  const { theme } = GetThemeColor();

  // const Now = dayjs().format("DD : MM : YYYY")



  return (

    <div
      style={{
        // width: '100%',
        display: "flex",
        flexWrap: 'wrap',
        justifyContent: "space-between",
        alignItems: 'center',
        gap: "20px",
        background: "transparent",
        // background: 'red',
        padding: '10px',
        marginBottom: '2%'
      }
      }
    >

      <div>
        <Typography variant="h1"
          style={{
            fontWeight: "bold",
            fontSize: "28px",
            color: theme === "black" ? "White" : getTextColor(theme),
          }}
        >
          {title}
        </Typography>
      </div>


      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          columnGap:'14px'
        }}>

        <ThemeToggleButton onToggle={toggleTheme} />

        {isAuthenticated && (
          <IconButton
            id="logout-button"
            aria-controls={openMenu ? "logout-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            onClick={handleUserMenuClick}
            style={{
              // border: "1px solid Green",
              color: theme === "black" ? "White" : getTextColor(theme),
              // background: theme === 'dark' ? "#333333" : 'White'
            }}
            onMouseEnter={() => setHoverRole(true)}
            onMouseLeave={() => setHoverRole(false)}
          >
            <img src={LogOut} alt="LogOutIconErr" width={"40px"} height={"40px"} />
            {hoverRole && (
              <p
                style={{
                  position: 'absolute',
                  top: '50px',
                  display: 'flex',
                  fontSize: '10px',
                  fontWeight: 'bolder'
                }}
              >{Role}</p>
            )}
          </IconButton>
        )}

        <Menu
          id="logout-menu"
          MenuListProps={{
            "aria-labelledby": "logout-button",
          }}
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          style={{
            marginTop: "50px",
            marginLeft: "-50px",
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>

            <div
              style={{
                display: 'flex',
                flexDirection: "column",
                gap: 5,
                padding: 10,
                cursor: 'default'
              }}>
              <div><b>Email :</b> {localStorage.getItem("Email")}</div>
              <div><b>Role &#160; : </b>{localStorage.getItem("Role")}</div>
            </div>

            <MenuItem className="LogoutButton" onClick={handleLogOutUser}><b>Logout</b></MenuItem>
          </div>


        </Menu>
      </div>

    </div>
  );
}

export default Header;

