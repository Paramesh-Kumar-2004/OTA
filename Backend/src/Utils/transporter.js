  import nodemailer from "nodemailer";
 
// export const transporter = nodemailer.createTransport({
//   host: "smtp-mail.outlook.com",
//   port: 587,
//   secureConnection: false,
//   auth: {
//     user: process.env.OTPEMAIL,
//     pass: process.env.EMAILPASSWORD,
//   },

//   tls: {
//     ciphers: "SSLv3",
//   },
// });

// export const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secureConnection: true,
//   auth: {
//     user: process.env.OTPEMAIL,
//     pass: process.env.EMAILPASSWORD,
//   },

//   tls: {
//     ciphers: "SSLv3",
//   },
// });