import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useAuth } from "../../hooks/useAuth";
import { useContext } from "react";
import { ThemeModeContext } from "../../context/ThemeModeContext";

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const themeMode = useContext(ThemeModeContext);

  if (!themeMode) {
    throw new Error("ThemeModeContext missing");
  }

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Taskflow
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton onClick={themeMode.toggleMode}>
            {themeMode.mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          <Typography variant="body2" color="text.secondary">
            {user?.name}
          </Typography>

          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
