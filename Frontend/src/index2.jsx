import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import reportWebVitals from './reportWebVitals';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat',
    button: {
      textTransform: 'none'
    }
  },
  palette: {
    primary: {
      main: "#6B46C1",
    },
    secondary: {
      main: "#364152",
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        fontFamily: 'Montserrat',
        fontWeight: '500'
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        }
      }
    }
  }
})

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
