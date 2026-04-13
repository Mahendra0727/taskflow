import { Box, CircularProgress, Typography } from "@mui/material";

export default function AppLoader({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <Box
      sx={{
        minHeight: "40vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
