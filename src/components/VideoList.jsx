import { Button, Card, Col, Label, Row } from "reactstrap";
import MediaDropzone from "./UI/MediaDropZone";

export default function VideoList({
  baseUrl,
  videosList,
  oldVideos = [],
  handleVideoFilesChange,
  handleVideoDelete,
  handleOldVideoDelete,
}) {
  return (
    <div className="mb-4">
      <div className="mb-3">
        <MediaDropzone
          mediaList={videosList}
          hintText="Drop video files here or click to select."
          handleFilesUpload={(videos) => handleVideoFilesChange(videos)}
          acceptedFileTypes="video"
          maxFiles={1}
        />
        <p className="form-text text-muted">
          Allowed file extensions: .mp4, .mov - (Maximum size 6 MB per video)
        </p>
      </div>
      {videosList.length > 0 && (
        <Row className="mb-2">
          <Row>
            <Label className="form-label">SELECTED VIDEOS</Label>
          </Row>
          {videosList.map((value, i) => (
            <Col lg="3" key={i + value.preview + "-category"}>
              <div className="mb-2">
                <Card
                  className="shadow border"
                  style={{
                    borderRadius: "12px",
                  }}
                >
                  <video
                    controls
                    style={{
                      maxHeight: "150px",
                      maxWidth: "100%",
                      borderRadius: "12px",
                    }}
                  >
                    <source src={value.preview} />
                  </video>
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
                      onClick={() => handleVideoDelete(value)}
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
      {oldVideos.length > 0 && (
        <Row className="mt-5">
          <Row>
            <Label className="form-label">UPLOADED VIDEOS</Label>
          </Row>
          {oldVideos.map((value, i) => (
            <Col lg="3" key={i + value.video + "-category"}>
              <div className="mb-2">
                <Card
                  className="shadow border"
                  style={{
                    borderRadius: "12px",
                  }}
                >
                  <video
                    controls
                    style={{
                      maxHeight: "150px",
                      maxWidth: "100%",
                      borderRadius: "12px",
                    }}
                  >
                    <source src={`${baseUrl}${value.video}`} />
                  </video>
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
                        window.open(`${baseUrl}${value.videoe}`, "_blank");
                      }}
                    >
                      <i className="ri-eye-line"></i>
                      <span className="ms-2">View</span>
                    </Button>
                    <span className="ms-3"></span>
                    <Button
                      type="button"
                      onClick={() => handleOldVideoDelete(value)}
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
