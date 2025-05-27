import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(document.getElementById("root"));
const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#6B46C1",
    },
    secondary: {
      main: "#364152",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        fontFamily: "Montserrat",
        fontWeight: "500",
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
        },
      },
    },
    MuiTextField:{
      styleOverrides:{
        root:{
          
          borderRadius: "8px",
          border: "1px solid #DADFE7",
          background: "#FFF",
          boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        }
      }
    },
    MuiFormLabel:{
      styleOverrides:{
          root:{
            margin: "14px 0px 6px 0px ",
            color: "#364152",
            fontSize: "12px",
            lineHeight: "20px",
            letterSpacing: "0.35px",
          }
      }
    },

    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: "#364152",
          fontSize: "12px",
          lineHeight: "20px",
          letterSpacing: "0.35px",
        },
        root: {
          color: "red",
        },
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <SnackbarProvider
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      r
    >
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </SnackbarProvider>
  </React.StrictMode>
);

reportWebVitals();