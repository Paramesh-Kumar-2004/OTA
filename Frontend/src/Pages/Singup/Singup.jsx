import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./../../images/ota-logo.svg";
import styles from "../../Styles/UserEntry.module.css"

import { enqueueSnackbar } from "notistack";
import { useRegisterUserMutation } from "../../api/api";




function Singup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerUser] = useRegisterUserMutation();

  const navigate = useNavigate();

  const signUpUser = (event) => {
    event.preventDefault();
    registerUser({
      firstName: firstName,
      lastName: lastName,
      userEmail: userEmail,
      password: password,
    })
      .unwrap()
      .then((res) => {
        enqueueSnackbar("User created successfully. Please Login", {
          variant: "success",
        });
        navigate("/");
      })
      .catch((er) => {
        enqueueSnackbar("Could Not create a user", { variant: "error" });
      });
  };
  return (
    <>

      <div id={styles.mainDiv}>

        <div id={styles.contentDiv}>

          <div className={styles.Fields}>

            <div id={styles.datacontents}>

              <div id={styles.infoFields}>
                <img src={logo} alt="logo" />
                <h2>Registration</h2>
              </div>

              <div>

                <form onSubmit={signUpUser} id={styles.formDiv}>

                  <div className={styles.LabelAndInputFields}>
                    <label htmlFor="firstname" className={styles.labels}>
                      First Name
                    </label>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      id="firstname"
                      placeholder="Enter Your First Name Here"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.LabelAndInputFields}>
                    <label htmlFor="lastname" className={styles.labels}>
                      Last Name
                    </label>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      id="lastname"
                      placeholder="Enter Your Last Name Here"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>

                  <div className={styles.LabelAndInputFields}>
                    <label htmlFor="email" className={styles.labels}>
                      Email
                    </label>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      id="email"
                      placeholder="Enter Your Your Email Here"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>

                  <div className={styles.LabelAndInputFields}>
                    <label htmlFor="password" className={styles.labels}>
                      Password
                    </label>
                    <TextField
                      fullWidth
                      size="small"
                      type="password"
                      id="password"
                      placeholder="Enter Your Password Here"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className={styles.LabelAndInputFields}>
                    <label htmlFor="confirmpassword" className={styles.labels}>
                      Confirm Password
                    </label>
                    <TextField
                      fullWidth
                      size="small"
                      id="confirmpassword"
                      type="password"
                      placeholder="Enter Your Confirm Password Here"
                      required
                      value={confirmPassword}
                      error={confirmPassword !== password}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      helperText={
                        confirmPassword !== password
                          ? "Confirm Password Should Match Password"
                          : ""
                      }
                    />
                  </div>

                  <div className={styles.LabelAndInputFields}>
                    <input
                      type="checkbox"
                      required
                      id="rememberme"
                      name="rememberMe"
                      value="Remeberme"
                    />
                    <label htmlFor="rememberme" className={styles.labels}>
                      I agree terms & conditions
                    </label>
                  </div>

                  <div id={styles.forgotPasswordAndRegister} className={styles.LabelAndInputFields}>
                    <div id={styles.Register}>
                      <p>Already Have An Account :</p>
                      <Link to="/" className={styles.forgotPasswordandRegisterText}>
                        &#160;LogIn Now!
                      </Link>
                    </div>
                  </div>

                  <Button
                    id={styles.submitbutton}
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={[firstName, password, userEmail].some(
                      (item) => item.trim() === ""
                    )}
                  >
                    Create Account
                  </Button>
                </form>


              </div>

            </div>

          </div>

          <div id={styles.RegisterImgField} ></div>

        </div>
      </div>

    </>
  );
}

export default Singup;


