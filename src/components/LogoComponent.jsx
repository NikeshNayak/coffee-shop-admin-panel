import { useDropzone } from "react-dropzone";
import { Button, Col } from "reactstrap";
import { useSelector } from "react-redux";

export default function LogoComponent({
  baseUrl,
  logo,
  alt,
  onDropLogo,
  handleRemove,
  oldUrl = null,
  isUpdate = false,
}) {
  const theme = useSelector((state) => state.Layout.theme);

  const {
    getRootProps: getRootLogoProps,
    getInputProps: getLogoInputProps,
    isDragActive: isLogoDragActive,
    open: openDropZone,
  } = useDropzone({
    onDrop: onDropLogo,
    maxFiles: 1,
    multiple: false,
    useFsAccessApi: false,
  });

  const dropzoneStyles = {
    border: theme === "dark" ? "1px dashed #888" : "1px dashed #ccc",
    backgroundColor: theme === "dark" ? "#2d3448" : "#f8f8f8",
    color: theme === "dark" ? "#ffffff" : "#000000",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px", // Add a minimum height to ensure the center alignment
    textAlign: "center",
  };

  const buttonStyles = {
    minWidth: "140px",
  };

  const imageStyles = {
    maxHeight: "160px",
    maxWidth: "100%",
    borderRadius: "15px",
    objectFit: "contain", // Change to "contain" to maintain aspect ratio and fit within the box
  };

  return (
    <center>
      <div className="mb-4">
        <div
          {...getRootLogoProps()}
          className={`dropzone ${isLogoDragActive ? "active" : ""}`}
          style={dropzoneStyles}
        >
          <Col lg="6">
            {!isUpdate && logo ? (
              <img src={logo} alt={alt} style={imageStyles} />
            ) : null}

            {isUpdate && oldUrl !== null && logo === null && (
              <img src={`${baseUrl}${oldUrl}`} alt={alt} style={imageStyles} />
            )}

            {isUpdate && logo !== null && (
              <img src={logo} alt={alt} style={imageStyles} />
            )}

            {logo === null && oldUrl === null && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  {...getLogoInputProps()}
                  onChange={() => openDropZone()}
                  style={{ display: "none" }}
                />
                <div className="dz-message needsclick">
                  <div className="mb-2">
                    <i className="display-4 text-muted ri-upload-cloud-2-line"></i>
                  </div>
                  <h5>Drop logo here or click to upload.</h5>
                </div>
              </>
            )}
          </Col>
        </div>
      </div>
      {(logo !== null || oldUrl !== null) && (
        <Col lg="6">
          <div className="mt-3" style={{ textAlign: "center" }}>
            <Button
              type="button"
              color="primaryPurple"
              className="waves-effect waves-light"
              style={buttonStyles}
              onClick={() => openDropZone()}
            >
              <i className="ri-edit-fill"></i>
              <span className="ms-1">Change Logo</span>
              <input
                type="file"
                accept="image/*"
                {...getLogoInputProps()}
                onChange={() => openDropZone()}
                style={{ display: "none" }}
              />
            </Button>
            <span className="ms-3"></span>
            <Button
              type="button"
              color="danger"
              style={buttonStyles}
              onClick={handleRemove}
            >
              <i className="ri-delete-bin-fill"></i>
              <span className="ms-1">Remove</span>
            </Button>
          </div>
        </Col>
      )}
    </center>
  );
}
