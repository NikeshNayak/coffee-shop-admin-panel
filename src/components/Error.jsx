import { Close, Error } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function ErrorMessage({ message, onClose }) {
  return (
    <div className="error">
      <Error
        sx={{
          color: "#6d0b0b",
          height: "20px",
        }}
      />
      <p>{message}</p>
      <IconButton onClick={onClose}>
        <Close
          sx={{
            color: "#6d0b0b",
            height: "18px",
          }}
        />
      </IconButton>
    </div>
  );
}
