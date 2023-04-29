export default function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/*<Route path="/albums" element={<AlbumsPage />} />*/}
            {/*<Route path="/albums/:album_id" element={<AlbumInfoPage />} />*/}
            {/*<Route path="/songs" element={<SongsPage />} />*/}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
  );
}
