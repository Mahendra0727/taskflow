import { Box, Container } from "@mui/material";
import type { ReactNode } from "react";
import AppNavbar from "../components/common/AppNavbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box>
      <AppNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
