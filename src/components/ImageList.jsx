import { Button, Card, Col, Label, Row } from "reactstrap";
import MediaDropzone from "./UI/MediaDropZone";

export default function ImageList({
  baseUrl,
  imagesList,
  oldImages = [],
  handleImageFilesChange,
  handleImageDelete,
  handleOldImageDelete,
}) {
  return (
    <div className="mb-5">
      <MediaDropzone
        hintText="Drop image files here or click to select."
        mediaList={imagesList}
        handleFilesUpload={(images) => handleImageFilesChange(images)}
        acceptedFileTypes="image"
        maxFiles={4}
      />
      <p className="form-text text-muted">
        Allowed file extensions: .png, .jpg, .jpeg - (Maximum size 250 KB per
        image)
      </p>
      {imagesList.length > 0 && (
        <Row className="mt-5">
          <Row>
            <Label className="form-label">SELECTED IMAGES</Label>
          </Row>
          {imagesList.map((value, i) => (
            <Col lg="3" key={i + "-category"}>
              <div className="mb-3">
                <Card
                  className="shadow border"
                  style={{
                    borderRadius: "12px",
                  }}
                >
                  <img
                    alt={value}
                    src={`${value.preview}`}
                    style={{
                      maxHeight: "150px",
                      maxWidth: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                  <div className="mb-3" />
                  <div
                    className="mb-3"
                    style={{
                      textAlign: "center",
                      maxWidth: "100%",
                    }}
                  >
                    <Button
                      color="primaryPurple"
                      className="waves-effect waves-light"
                      onClick={() => {
                        window.open(value.preview, "_blank");
                      }}
                    >
                      <i className="ri-eye-line"></i>
                      <span className="ms-2">View</span>
                    </Button>
                    <span className="ms-3"></span>
                    <Button
                      type="button"
                      onClick={() => handleImageDelete(value)}
                      color="danger"
                    >
                      <i className="ri-delete-bin-line"></i>
                      <span className="ms-2">Remove</span>
                    </Button>
                  </div>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      )}
      {oldImages.length > 0 && (
        <Row className="mt-5">
          <Row>
            <Label className="form-label">UPLOADED IMAGES</Label>
          </Row>
          {oldImages.map((value, i) => (
            <Col lg="3" key={i + "-category"}>
              <div className="mb-3">
                <Card
                  className="shadow border"
                  style={{
                    borderRadius: "12px",
                  }}
                >
                  <img
                    alt={value}
                    src={`${baseUrl}${value}`}
                    style={{
                      maxHeight: "150px",
                      maxWidth: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                  <div className="mb-3" />
                  <div
                    className="mb-3"
                    style={{
                      textAlign: "center",
                      maxWidth: "100%",
                    }}
                  >
                    <Button
                      color="primaryPurple"
                      className="waves-effect waves-light"
                      onClick={() => {
                        window.open(`${baseUrl}${value}`, "_blank");
                      }}
                    >
                      <i className="ri-eye-line"></i>
                      <span className="ms-2">View</span>
                    </Button>
                    <span className="ms-3"></span>
                    <Button
                      type="button"
                      onClick={() => handleOldImageDelete(value)}
                      color="danger"
                    >
                      <i className="ri-delete-bin-line"></i>
                      <span className="ms-2">Remove</span>
                    </Button>
                  </div>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
