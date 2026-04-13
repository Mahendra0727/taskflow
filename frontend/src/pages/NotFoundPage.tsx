import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        404
      </Typography>

      <Typography color="text.secondary">
        The page you are looking for does not exist.
      </Typography>

      <Button component={RouterLink} to="/projects" variant="contained">
        Go to Projects
      </Button>
    </Box>
  );
}
