import { createTheme, Tab, Tabs, ThemeProvider, useTheme } from "@mui/material";
import { useMemo } from "react";

export default function CustomTabBar({ children, tabValue, onTabChange, mode }) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode, // Use 'light' or 'dark' depending on the mode
          primary: {
            main: mode === "dark" ? "#1976d2" : "#1976d2", // Set different primary colors for light and dark themes
          },
        },
        typography: {
          fontFamily: "Nunito, Inter, Arial, sans-serif", // Define fallback fonts as needed
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        aria-label="keys tabs"
        sx={{
          pb: 2,
          "& .MuiTabs-flexContainer": {
            justifyContent: "center",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
            height: "100%", // Make the indicator span the height of the tab
            borderRadius: "30px", // Make the indicator corners rounded
            zIndex: -1, // Put the indicator behind the text
          },
          "& .MuiTab-root.Mui-selected": {
            color: "white",
            backgroundColor: "primary.main", // Background color changes based on the theme
            borderRadius: "30px", // Match the border radius of the indicator
            p: 1,
          },
          "& .MuiTab-root": {
            minHeight: "30px",
            minWidth: "120px", // Customize tab width
            textTransform: "none",
            p: 1,
            color: theme.palette.mode === "dark" ? "white" : "black", // Text color changes based on the theme
          },
        }}
      >
        {children}
      </Tabs>
    </ThemeProvider>
  );
}
