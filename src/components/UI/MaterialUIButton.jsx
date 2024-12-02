import { Button, createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Nunito, Inter, Arial, sans-serif", // Define fallback fonts as needed
  },
});

export default function MaterialUIButton({
  label,
  fontSize = "13px",
  height = "38px",
  borderRadius = "12px",
  onButtonClick,
}) {
  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="contained"
        color="primary"
        onClick={onButtonClick}
        sx={{
          fontSize: { fontSize },
          height: { height },
          borderRadius: { borderRadius },
          textTransform: "none",
          color: "white",
          letterSpacing: 1.2,
          boxShadow: 0,
        }}
      >
        {label}
      </Button>
    </ThemeProvider>
  );
}
