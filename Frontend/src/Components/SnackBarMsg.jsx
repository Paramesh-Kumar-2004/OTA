import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import React from "react";



function SnackBarMsg({ message, severity, open }) {
  const [, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event,
      reason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        X
      </IconButton>
    </React.Fragment>
  );
  return (
    <>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Note archived"
        action={action}
      >
        <Alert variant="filled" severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SnackBarMsg;
