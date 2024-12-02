/* eslint-disable jsx-a11y/anchor-is-valid */
import { Card, Label, Row } from "reactstrap";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export default function PdfFileComponent({
  baseUrl,
  label,
  pdfFile,
  handlePdfFileChange,
  handlePdfDelete,
  oldPDF = null,
  isUpdate = false,
  required = true,
}) {
  const theme = useSelector((state) => state.Layout.theme);

  const onDropLogo = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          handlePdfFileChange([
            {
              file,
              preview: URL.createObjectURL(file),
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    },
    [handlePdfFileChange]
  );

  const {
    getRootProps: getRootLogoProps,
    getInputProps: getLogoInputProps,
    isDragActive: isLogoDragActive,
    open: openDropZone,
  } = useDropzone({
    onDrop: onDropLogo,
    accept: {
      "application/pdf": [],
    },
    maxFiles: 1,
    multiple: false,
  });

  const cardStyles = {
    backgroundColor: theme === "dark" ? "#2d3448" : "#ffffff",
    color: theme === "dark" ? "#ffffff" : "#000000",
    borderColor: theme === "dark" ? "#444444" : "#e0e0e0",
  };

  const dropzoneStyles = {
    border: theme === "dark" ? "1px dashed #888" : "1px dashed #ccc",
    backgroundColor: theme === "dark" ? "#2d3448" : "#f8f8f8",
  };

  const textMutedStyle = {
    color: theme === "dark" ? "#999999" : "#6c757d",
  };

  return (
    <div className="mb-5">
      {!isUpdate && pdfFile === null && (
        <div className="mb-4">
          <div
            {...getRootLogoProps()}
            className={`dropzone ${isLogoDragActive ? "active" : ""}`}
            style={{
              ...dropzoneStyles,
              borderRadius: "12px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              type="file"
              accept="application/pdf"
              {...getLogoInputProps()}
              onChange={(e) => {
                openDropZone();
              }}
              style={{ display: "none" }}
            />
            <div className="dz-message needsclick">
              <div className="mb-2">
                <i className="ri-upload-cloud-2-line display-4" style={textMutedStyle}></i>
              </div>
              <h5>
                Drop a pdf file here or click to select.
                {required && <span style={{ color: "red" }}>*</span>}
              </h5>
            </div>
          </div>
        </div>
      )}
      {pdfFile !== null && (
        <div className="mb-3">
          <Row>
            <Label className="form-label">SELECTED PDF</Label>
          </Row>
          <Card className="mt-1 mb-0 shadow" style={cardStyles}>
            <div className="d-flex justify-content-between align-items-center p-2">
              <div className="d-flex align-items-center">
                <i className="mdi mdi-pdf-box text-danger display-4 me-2"></i>
                <div>
                  <p className="mb-1">
                    <strong>{label}</strong>
                  </p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(pdfFile.preview, "_blank");
                    }}
                    className="text-primary fw-bold text-decoration-none"
                  >
                    View PDF
                  </a>
                </div>
              </div>
              {!isUpdate && (
                <button
                  type="button"
                  className="btn btn-link text-danger"
                  onClick={handlePdfDelete}
                >
                  <i className="mdi mdi-close-circle font-size-24"></i>
                </button>
              )}
              {isUpdate && (
                <button
                  type="button"
                  className="btn btn-link text-danger"
                  onClick={() => {
                    openDropZone();
                  }}
                >
                  <i className="mdi mdi-pencil font-size-24"></i>
                </button>
              )}
            </div>
          </Card>
        </div>
      )}
      {pdfFile === null && oldPDF !== null && (
        <div className="mb-3">
          <Row>
            <Label className="form-label">UPLOADED PDF</Label>
          </Row>
          <Card className="mt-1 mb-0 shadow" style={cardStyles}>
            <div className="d-flex justify-content-between align-items-center p-2">
              <div className="d-flex align-items-center">
                <i className="mdi mdi-pdf-box text-danger display-4 me-2"></i>
                <div>
                  <p className="mb-1">
                    <strong>{label}</strong>
                  </p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(`${baseUrl}${oldPDF}`, "_blank");
                    }}
                    className="text-primary fw-bold text-decoration-none"
                  >
                    View PDF
                  </a>
                </div>
              </div>
              {!isUpdate && (
                <button
                  type="button"
                  className="btn btn-link text-danger"
                  onClick={handlePdfDelete}
                >
                  <i className="mdi mdi-close-circle font-size-24"></i>
                </button>
              )}
              {isUpdate && (
                <button
                  type="button"
                  className="btn btn-link text-danger"
                  onClick={() => {
                    openDropZone();
                  }}
                >
                  <i className="mdi mdi-pencil font-size-24"></i>
                </button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
