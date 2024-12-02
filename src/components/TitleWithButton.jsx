import { Add, AddCircle } from "@mui/icons-material";
import Breadcrumbs from "./Breadcrumb";
import { Button, createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Nunito, Inter, Arial, sans-serif", // Define fallback fonts as needed
  },
});

export default function TitleWithButton({
  title,
  startIcon,
  label,
  onButtonClick,
}) {
  return (
    <ThemeProvider theme={theme}>
      <div className="mainRoot-topHeader">
        <h5 className="mb-0">{title}</h5>
        <div className="text-sm-end">
          <Button
            startIcon={startIcon || <Add height={"5px"} />}
            variant="contained"
            color="primary"
            onClick={onButtonClick}
            sx={{
              fontSize: "13px",
              height: "38px",
              borderRadius: "30px",
              textTransform: "none",
              color: "white",
              letterSpacing: 1.2,
              boxShadow: 0,
            }}
          >
            {label}
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}
