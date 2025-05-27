import { Menu, MenuItem } from "@mui/material";
import React, { MouseEventHandler } from "react";

 
function UserMenu({
  openMenu,
  anchorEl,
  handleMenuClose,
  logOutUser,
}) {
  return (
    <Menu
      id="user-menu"
      aria-labelledby="user-button"
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
    >
      {/* <MenuItem onClick={handleMenuClose}>Logout</MenuItem> */}
    </Menu>
  );
}

export default UserMenu;
