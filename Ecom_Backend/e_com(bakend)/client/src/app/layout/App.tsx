import { useEffect, useState } from "react";
//import {Product} from "../models/product";
//import { Outlet } from "react-router-dom";
//import Catalog from "../../features/catalog/Catalog";
//import Typography from "@mui/material/Typography";
import Header from "./Header";
import { Container,CssBaseline, ThemeProvider, createTheme } from "@mui/material";
//import Catalog from "../../features/catalog/Catalog";
import { Outlet } from "react-router-dom";
//import Catalog from "../../features/catalog/Catalog";


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }
 
   return (
    <ThemeProvider theme={theme} >
    <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
      <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App
