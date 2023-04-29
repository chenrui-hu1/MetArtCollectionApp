import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { indigo, amber } from '@mui/material/colors';
import { createTheme } from "@mui/material/styles";

import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import DepartmentPage from "./pages/DepartmentPage";
import CollectionsPage from "./pages/CollectionsPage";


export const theme = createTheme({
    palette: {
        primary: indigo,
        secondary: amber,
    },
});

export default function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/department" element={<DepartmentPage />} />
            {/*<Route path="/albums/:album_id" element={<AlbumInfoPage />} />*/}
            <Route path="/collections" element={<CollectionsPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
  );
}
