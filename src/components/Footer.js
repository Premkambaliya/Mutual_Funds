"use client";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ mt: 4, py: 2, textAlign: "center", bgcolor: "grey.200" }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} Mutual Funds App. All rights reserved.
      </Typography>
    </Box>
  );
}
