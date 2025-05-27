import { Button, TextField } from "@mui/material";
import logo from "./../../images/ota-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserLoginMutation } from "../../api/api";
import { enqueueSnackbar } from "notistack";
import styles from "../../Styles/UserEntry.module.css"



function SignIn() {


  const [userLogin] = useUserLoginMutation();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false)

  const navigate = useNavigate();


  function HandlePasswordVisible() {
    setPasswordVisible(!passwordVisible)
  }


  const handleLogin = (e) => {
    e.preventDefault();
    userLogin({ userEmail: userEmail, password: userPassword })
      .unwrap()
      .then((res) => {
        localStorage.setItem("theme", "black")
        console.log("Log In Succes", "\nLog In User Role :", res.data.user.role);
        if (res.data.user.role) {
          localStorage.setItem("Role", res.data.user.role)
          localStorage.setItem("Email", res.data.user.userEmail)
          navigate("/dashboard");
          window.location.reload()
        }
      })
      .catch((er) => {
        console.log("err", er);
        enqueueSnackbar("Error Occured", { variant: "error" });
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
                <h2>Let’s Login To Your Management</h2>
                <p>Welcome Back! Please Enter Your Details</p>
              </div>

              <div>

                <form onSubmit={handleLogin} id={styles.formDiv}>

                  <div className={styles.LabelAndInputFields} >

                    <label htmlFor="userEmail" className={styles.labels}>
                      Email :
                    </label>
                    <TextField
                      fullWidth
                      size="small"
                      id="userEmail"
                      label={null}
                      variant="outlined"
                      type="email"
                      required
                      placeholder="Enter Your Email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>


                  <div className={styles.LabelAndInputFields}>

                    <label htmlFor="password" className={styles.labels}>
                      Password :
                    </label>
                    <TextField
                      fullWidth
                      size="small"
                      type={!passwordVisible ? "password" : "text"}
                      id="password"
                      placeholder="Enter Your Password"
                      required
                      value={userPassword}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div id={styles.PasswordView} onClick={HandlePasswordVisible}>
                      {!passwordVisible ? "Show" : "Hide"} Password
                    </div>
                  </div>

                  <div id={styles.forgotPasswordAndRegister} className={styles.LabelAndInputFields}>
                    <div id={styles.Register}>
                      <p>Don't Have an account :</p>
                      <Link to="/register" className={styles.forgotPasswordandRegisterText}>
                        &#160;Register here!
                      </Link>
                    </div>
                    <Link to="forgot" className={styles.forgotPasswordandRegisterText}>
                      Forgot Password
                    </Link>
                  </div>

                  <Button type="submit" variant="contained" fullWidth id={styles.submitbutton}>
                    Log In
                  </Button>
                </form>

              </div>

            </div>

          </div>

          <div id={styles.LoginimgField} ></div>

        </div>
      </div>
    </>
  );
}

export default SignIn;


