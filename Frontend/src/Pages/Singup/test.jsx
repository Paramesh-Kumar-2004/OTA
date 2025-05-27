import {
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormLabel,
  FormControlLabel,
  FormControl,
  Box,
} from "@mui/material";
import logo from "./../../images/ota-logo.svg";
import cloudimg from "./../../images/lognImage.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useRegisterUserMutation } from "../../api/api";
import { enqueueSnackbar } from "notistack";
import { validateEmail } from "../../Util/util";

function Singup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tosAgreement, setTosAgreement] = useState(false);
  const [registerUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const signUpUser = (event) => {
    event.preventDefault();

    const test = validateEmail(userEmail);

    if (!tosAgreement) {
      enqueueSnackbar("Please Check term and condiation", { variant: "error" });
    }
    console.log("test", test);

    // registerUser({
    //   firstName: firstName,
    //   lastName: lastName,
    //   userEmail: userEmail,
    //   password: password,
    // })
    //   .unwrap()
    //   .then((res) => {
    //     enqueueSnackbar("User created successfully. Please Login", {
    //       variant: "success",
    //     });
    //     navigate("/");
    //   })
    //   .catch((er) => {
    //     enqueueSnackbar("Could Not create a user", { variant: "error" });
    //   });
  };
  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Paper
            // sx={{
            //   display: "flex",
            //   flexDirection: "column",
            //   alignItems: "center",
            // }}
            elevation={0}
          >
            <Box style={{background:'green'}}>
              <img src={logo} alt="logo" />
              <Typography
                variant="h6"
                component="span"
                color={"#121926"}
                sx={{
                  lineHeight: "38px",
                  fontSize: "30px",
                  textAlign: "center",
                }}
              >
                Registration
              </Typography>
            </Box>
            <Box>
            <FormControl
              style={{ marginTop: "30px", background: "red" }}
              onSubmit={signUpUser}
            >
              <FormLabel htmlFor="firstname">First Name</FormLabel>
              <TextField
                fullWidth
                size="small"
                type="text"
                id="firstname"
                placeholder="Your first name here"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <FormLabel htmlFor="lastname">Last Name</FormLabel>
              <TextField
                fullWidth
                size="small"
                type="text"
                id="lastname"
                placeholder="Your last name here"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />

              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                fullWidth
                size="small"
                type="email"
                id="email"
                placeholder="Your your email here"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />

              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                fullWidth
                size="small"
                type="password"
                id="password"
                placeholder="Your your password here"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <FormLabel htmlFor="confirmpassword">Confirm Password</FormLabel>
              <TextField
                fullWidth
                size="small"
                id="confirmpassword"
                type="password"
                placeholder="Your confirm password here"
                required
                value={confirmPassword}
                error={confirmPassword !== password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                helperText={
                  confirmPassword !== password
                    ? "Confirm Password should match password"
                    : ""
                }
              />

              <FormControlLabel
                sx={{
                  display: "flex",
                  "& .MuiTypography-root": {
                    color: "#697586",
                    textAlign: "center",
                    fontSize: "12px",
                    lineHeight: "20px",
                  },
                }}
                required
                control={
                  <Checkbox
                    checked={tosAgreement}
                    size="small"
                    onChange={(e) => setTosAgreement(!tosAgreement)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="  I agree terms & conditions"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={[firstName, password, userEmail].some(
                  (item) => item.trim() === ""
                )}
              >
                Create Account
              </Button>
            </FormControl>
            <Box>
            <Typography
              variant="subtitle2"
              component={"span"}
              color={"#4B5565;"}
              sx={{ margin: "32px 0px" }}
            >
              Already have an account?{" "}
              <Link to="/" style={{ textDecoration: "none", color: "#6B46C1" }}>
                Login
              </Link>
            </Typography>
            </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid xs={12} sm={6}>
          <img
            alt="cloudimg"
            src={cloudimg}
            style={{
              maxWidth: "100%",
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Singup;
