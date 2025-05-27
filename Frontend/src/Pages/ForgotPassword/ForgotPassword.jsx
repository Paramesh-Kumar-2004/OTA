import { Button, TextField } from "@mui/material";
import logo from "./../../images/ota-logo.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "../../Styles/UserEntry.module.css"



function ForgotPassword() {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidUser, setIsValidUser] = useState(false);
  const [otp, setOtp] = useState("")



  const handlePasswordReset = () => {
    if (!isValidUser) {
      axios
        .post("/users/reset", { userEmail: userEmail })
        .then((res) => {
          setIsValidUser(true);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios.post('/users/updatePassword', { otp: otp, password: password, userEmail: userEmail }).then((res) => {
        console.log('res', res)
      }).catch((err) => {
        console.log(err)
      })
    }
  };


  return (
    <>

      <div id={styles.mainDiv}>

        <div id={styles.contentDiv}>

          <div className={styles.Fields}>

            <div id={styles.datacontents}>

              <div id={styles.infoFields}>
                <img src={logo} alt="logo" />
                <h2>Did you forget your password?</h2>
                <p>Enter your email address below and we will send you a password reset link</p>
              </div>

              <div>

                <form id={styles.formDiv}>

                  <div className={styles.LabelAndInputFields}>
                    <label htmlFor="email" className={styles.labels}>
                      Email :
                    </label >
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      id="email"
                      placeholder="Enter Your Email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>

                  {
                    isValidUser && (
                      <div className={styles.LabelAndInputFields}>
                        <label htmlFor="otp" className={styles.labels}>
                          OTP :
                        </label>
                        <TextField
                          fullWidth
                          size="small"
                          type="text"
                          id="otp"
                          placeholder="Enter new password"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />

                        <label htmlFor="password" className={styles.labels}>
                          New Passowrd :
                        </label>
                        <TextField
                          fullWidth
                          size="small"
                          type="password"
                          id="password"
                          placeholder="Enter new password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="confirmPassword" className={styles.labels}>
                          Confirm Password
                        </label>
                        <TextField
                          fullWidth
                          size="small"
                          type="password"
                          id="email"
                          placeholder="Confirm your password"
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
                      </div>
                    )
                  }
                  <Button
                    id={styles.submitbutton}
                    variant="contained"
                    fullWidth
                    onClick={handlePasswordReset}
                  >
                    Reset password
                  </Button>
                </form >

                <Link to="/" style={{ textDecoration: "none" }}>
                  <Button fullWidth> Back to Log In</Button>
                </Link>


              </div>

            </div>

          </div>

          <div id={styles.ForgotImgField} ></div>

        </div>
      </div>

    </>
  );
}

export default ForgotPassword;























// {/* <Box
//   sx={{
//     display: "grid",
//     justifyItems: "center",
//     padding: "20px",
//   }}
// >
//   <img src={logo} alt="logo" />
//   <Typography
//     variant="h6"
//     component="span"
//     color={"#121926"}
//     sx={{
//       lineHeight: "38px",
//       fontSize: "30px",
//       textAlign: "center",
//     }}
//   >
//     Did you forget your password?
//   </Typography>
//   <Typography
//     variant="subtitle1"
//     component="span"
//     sx={{
//       color: "rgba(75, 85, 101, 0.80)",
//       textAlign: "center",
//       padding: "10px 30px ",
//       fontWeight: "500",
//       fontSize: "18px",
//       lineHeight: "24px",
//     }}
//   >
// Enter your email address you're using account below and we will
// send you a password reset link.
//   </Typography>
//   <form style={{ margin: "30px" }}>
//     <label
//       htmlFor="email"
//       style={{
//         display: "block",
//         marginBottom: "6px",
//         color: "#364152",
//         fontSize: "12px",
//         lineHeight: "20px" /* 166.667% */,
//   letterSpacing: "0.35px",
//       }}
//     >
//   Email
//     </label >
//   <TextField
//     fullWidth
//     size="small"
//     type="email"
//     id="email"
//     style={{
//       borderRadius: "8px",
//       border: "1px solid #DADFE7",
//       background: "#FFF",
//       boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
//     }}
//     placeholder="Enter Your Email"
//     required
//     value={userEmail}
//     onChange={(e) => setUserEmail(e.target.value)}
//   />
// {
//   isValidUser && (
//     <div>

//       <label htmlFor="otp"
//         style={{
//           display: "block",
//           marginBottom: "6px",
//           color: "#364152",
//           fontSize: "12px",
//           lineHeight: "20px" /* 166.667% */,
//           letterSpacing: "0.35px",
//         }}
//       >
//         OTP
//       </label>
//       <TextField
//         fullWidth
//         size="small"
//         type="text"
//         id="otp"
//         style={{
//           borderRadius: "8px",
//           border: "1px solid #DADFE7",
//           background: "#FFF",
//           boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
//         }}
//         placeholder="Enter new password"
//         required
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//       />

//       <label
//         htmlFor="password"
//         style={{
//           display: "block",
//           marginBottom: "6px",
//           color: "#364152",
//           fontSize: "12px",
//           lineHeight: "20px" /* 166.667% */,
//           letterSpacing: "0.35px",
//         }}
//       >
//         New Passowrd
//       </label>
//       <TextField
//         fullWidth
//         size="small"
//         type="password"
//         id="password"
//         style={{
//           borderRadius: "8px",
//           border: "1px solid #DADFE7",
//           background: "#FFF",
//           boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
//         }}
//         placeholder="Enter new password"
//         required
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <label
//         htmlFor="confirmPassword"
//         style={{
//           display: "block",
//           marginBottom: "6px",
//           color: "#364152",
//           fontSize: "12px",
//           lineHeight: "20px" /* 166.667% */,
//           letterSpacing: "0.35px",
//         }}
//       >
//         Confirm Password
//       </label>
//       <TextField
//         fullWidth
//         size="small"
//         type="password"
//         id="email"
//         style={{
//           borderRadius: "8px",
//           border: "1px solid #DADFE7",
//           background: "#FFF",
//           boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
//         }}
//         placeholder="Confirm your password"
//         required
//         value={confirmPassword}
//         error={confirmPassword !== password}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         helperText={
//           confirmPassword !== password
//             ? "Confirm Password should match password"
//             : ""
//         }
//       />
//     </div>
//   )
// }
// <Button
//   variant="contained"
//   fullWidth
//   sx={{ marginTop: "20px" }}
//   onClick={handlePasswordReset}
// >
//   Reset password
// </Button>
//   </form >

//   <Link to="/" style={{ textDecoration: "none" }}>
//     <Button fullWidth> Back to Log In</Button>
//   </Link>
// </Box > */}