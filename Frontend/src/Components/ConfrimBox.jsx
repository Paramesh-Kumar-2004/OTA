import { Modal, Box, Typography, Button } from "@mui/material";
import React from "react";
import DeleteIcon from "../images/Icons/DeleteIcon";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  textAlign: "center",
  borderRadius: "16px",
  boxShadow: 24,
  p: 2,
};
 
export function ConfrimBox({open, message, title, handleClose,handleDelete}) {
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="confirmation-Box">
        <Box sx={style}>
          <DeleteIcon />
          <Typography
            id="title"
            variant="h6"
            component="h2"
            sx={{ fontSize: "20px", fontWeight: 600, letterSpacing: "0.4px" }}
          >
{title}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{
              mt: 1,
              mb: 2,
              color: "#697586",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.26px",
            }}
            component="span"
          >
            {message}
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "30px",
              marginTop: "40px",
            }}
          >
            <Button variant="outlined" onClick={handleDelete}>
              Ok
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default ConfrimBox;
