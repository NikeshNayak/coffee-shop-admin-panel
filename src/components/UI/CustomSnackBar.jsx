import { CheckCircle, Close, Error } from "@mui/icons-material";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";

export default function CustomSnackBar({ snackBarMsg, setSnackMsg }) {
  return (
    <Snackbar
      open={snackBarMsg.isOpen}
      autoHideDuration={2000}
      onClose={() => {
        setSnackMsg({
          isOpen: false,
          isSuccess: null,
          message: "",
        });
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <SnackbarContent
        style={{
          borderRadius: "12px",
          backgroundColor:
            snackBarMsg.isSuccess === true
              ? "darkgreen"
              : snackBarMsg.isSuccess === false
              ? "darkred"
              : "gray", // Custom background color
        }}
        message={
          <span style={{ display: "flex", alignItems: "center" }}>
            {snackBarMsg.isSuccess === true && (
              <CheckCircle style={{ marginRight: "8px" }} />
            )}
            {snackBarMsg.isSuccess === false && (
              <Error style={{ marginRight: "8px" }} />
            )}
            {snackBarMsg.message}
          </span>
        }
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => {
              setSnackMsg({
                isOpen: false,
                isSuccess: null,
                message: "",
              });
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Snackbar>
  );
}
