import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { pink, amber } from '@mui/material/colors';
import { createTheme } from "@mui/material/styles";

import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import DepartmentPage from "./pages/DepartmentPage";
import CollectionsPage from "./pages/CollectionsPage";
import DepAndArtistInfoPage from "./pages/DepAndArtistInfoPage";
import LoginPage from "./pages/LoginPage";


export const theme = createTheme({
    palette: {
        primary: pink,
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
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path = "/login" element={<LoginPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/department" element={<DepartmentPage />} />
                    <Route path="/artist/:groupId" element={<DepAndArtistInfoPage isArtist={true} />} />
                    <Route path="/department/:groupId" element={<DepAndArtistInfoPage isArtist={false} />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
