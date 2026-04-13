import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useContext } from "react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SnackbarProvider } from "./context/SnackbarContext";
import {
  ThemeModeContext,
  ThemeModeProvider,
} from "./context/ThemeModeContext";
import { getAppTheme } from "./theme/muiTheme";

function RootApp() {
  const themeMode = useContext(ThemeModeContext);

  if (!themeMode) {
    return null;
  }

  return (
    <ThemeProvider theme={getAppTheme(themeMode.mode)}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeModeProvider>
    <RootApp />
  </ThemeModeProvider>,
);
