import { useEffect, useState } from "react";
import {
  APIRoutes,
  BASEURL,
  COMPANY_MEDIA_BASEURL,
  formatToLocalTime,
} from "../../configs/globalConfig";
import { Card, CardBody, Col, Container, Label, Row } from "reactstrap";
import Breadcrumbs from "../../components/Breadcrumb";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function ViewCompanyPage() {
  const { companyId } = useParams(); // Extract companyId from the URL
  const [companyDetails, setCompanyDetails] = useState(null); // State to store company detailsx
  const [isLoaded, setIsLoaded] = useState(false);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });
  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";

  const [, setCompanyLogo] = useState(null);

  useEffect(() => {
    // Fetch the company details when the component mounts
    async function fetchCompanyDetails() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getCompanyDetails}?id=${companyId}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            setIsLoaded(true);
            setCompanyDetails(response.data.company);
            setCompanyLogo(`${COMPANY_MEDIA_BASEURL}${response.data.company.logo}`);
          } else {
            setIsLoaded(true);
            setSnackMsg({
              isOpen: true,
              isSuccess: false,
              message: response.data.message,
            });
          }
        } else {
          setIsLoaded(true);
          setSnackMsg({
            isOpen: true,
            isSuccess: false,
            message: response.data.message,
          });
        }
      } catch (error) {
        console.error("Failed to fetch company details:", error);
        setIsLoaded(true);
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      }
    }
    fetchCompanyDetails();
  }, [companyId]);

  return (
    <>
      {!isLoaded && (
        <div className="page-content">
          <div id="status">
            <div className="spinner">
              <i className="ri-loader-line spin-icon"></i>
            </div>
          </div>
        </div>
      )}
      {isLoaded && (
        <div className="page-content">
          <Breadcrumbs
            title={"View Company"}
            breadcrumbItems={[
              { title: "Companies", link: "/companies" },
              { title: "View Company", link: "#" },
            ]}
          />
          <Container fluid>
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            {companyDetails && (
              <>
                <Card>
                  <CardBody>
                    <div>
                      {companyDetails.logo != null && (
                        <Row>
                          <div className="mb-5">
                            <center>
                              <div>
                                <img
                                  src={`${COMPANY_MEDIA_BASEURL}${companyDetails.logo}`}
                                  alt="Company Logo"
                                  style={{
                                    maxHeight: "150px",
                                    borderRadius: "15px",
                                  }}
                                />
                              </div>
                            </center>
                          </div>
                        </Row>
                      )}
                      <div className="mb-2">
                        <Row>
                          <Col>
                            <Label className="form-label">COMPANY NAME</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {companyDetails.companyName}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">PERSON NAME</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {companyDetails.firstName}{" "}
                              {companyDetails.lastName}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">GST NUMBER</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {companyDetails.gstNo}
                            </p>
                          </Col>
                        </Row>
                      </div>
                      <div className="mb-2">
                        <Row>
                          <Col lg={4}>
                            <Label className="form-label">EMAIL ID</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {companyDetails.emailId}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">MOBILE NUMBER</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {companyDetails.mobileNo}
                            </p>
                          </Col>
                        </Row>
                      </div>

                      <div className="mb-2">
                        <Row>
                          <Label className="form-label">ADDRESS</Label>
                          <p
                            style={{
                              color: isDarkMode ? "#DADADA" : "black",
                            }}
                          >
                            {companyDetails.address}
                          </p>
                        </Row>
                      </div>
                      <div className="mb-2">
                        <Row>
                          <Col>
                            <Label className="form-label" htmlFor="companyName">
                              CITY
                            </Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {companyDetails.city}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label" htmlFor="firstName">
                              STATE
                            </Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {companyDetails.state}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label" htmlFor="firstName">
                              COUNTRY
                            </Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {companyDetails.country}
                            </p>
                          </Col>
                        </Row>
                      </div>
                      <div className="mb-2">
                        <Row>
                          <Label className="form-label">PRODUCT KEY</Label>
                          <p
                            style={{
                              color: isDarkMode ? "#DADADA" : "black",
                            }}
                          >
                            {companyDetails.productKey}
                          </p>
                        </Row>
                      </div>
                      <div className="mb-2">
                        <Row>
                          <Col>
                            <Label className="form-label">
                              REGISTERED DATE
                            </Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {formatToLocalTime(companyDetails.createdAt)}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">EXPIRY DATE</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {formatToLocalTime(companyDetails.expiredAt)}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">RENEW DATE</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {formatToLocalTime(companyDetails.renewDate)}
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <div>
                      <div className="mb-1">
                        <Row className="align-items-center">
                          <Label
                            className="form-label font-size-20"
                            style={{ textAlign: "center" }}
                          >
                            <strong>MAIN CATALOGUE</strong>
                          </Label>
                        </Row>
                      </div>
                      <div className="mb-4">
                        <Row>
                          <Label className="form-label">PDF</Label>
                        </Row>
                        <div className="mb-3">
                          <Card className="mt-1 mb-0 shadow border">
                            <div className="p-2">
                              <Row className="align-items-center">
                                <Col className="col-auto">
                                  <i className="mdi mdi-pdf-box text-danger display-4"></i>
                                </Col>
                                <Col>
                                  <p
                                    className="mb-1"
                                    style={{
                                      color: isDarkMode ? "#DADADA" : "black",
                                    }}
                                  >
                                    <strong>{`${companyDetails.companyName} - Main Catalogue`}</strong>
                                  </p>
                                  <a
                                    href={`${COMPANY_MEDIA_BASEURL}${companyDetails.mainCatalogue.pdfLink}`}
                                    className="text-primary fw-bold text-decoration-none"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {"View PDF"}
                                  </a>
                                </Col>
                              </Row>
                            </div>
                          </Card>
                        </div>
                      </div>
                      {companyDetails.mainCatalogue.images.length > 0 && (
                        <div className="mb-4">
                          <Row>
                            <Label className="form-label">IMAGES</Label>
                          </Row>
                          {companyDetails.mainCatalogue.images.map(
                            (value, i) => (
                              <div className="mb-3" key={i + "-category"}>
                                <Card className="mt-1 mb-0 shadow border">
                                  <div className="p-2">
                                    <Row className="align-items-center">
                                      <Col className="col-auto">
                                        <img
                                          data-dz-thumbnail=""
                                          height="100"
                                          className="avatar-sm rounded bg-light"
                                          alt={value}
                                          src={`${COMPANY_MEDIA_BASEURL}${value}`}
                                        />
                                      </Col>
                                      <Col>
                                        <p
                                          className="mb-1"
                                          style={{
                                            color: isDarkMode
                                              ? "#DADADA"
                                              : "black",
                                          }}
                                        >
                                          <strong>{`Image ${i + 1}`}</strong>
                                        </p>
                                        <a
                                          href={`${COMPANY_MEDIA_BASEURL}${value}`}
                                          className="text-primary fw-bold text-decoration-none"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {"View Image"}
                                        </a>
                                      </Col>
                                    </Row>
                                  </div>
                                </Card>
                              </div>
                            )
                          )}
                        </div>
                      )}
                      {companyDetails.mainCatalogue.videos.length > 0 && (
                        <div className="mb-3">
                          <Row>
                            <Label className="form-label">VIDEOS</Label>
                          </Row>
                          {companyDetails.mainCatalogue.videos.map(
                            (value, i) => (
                              <div className="mb-3" key={i + "-category"}>
                                <Card className="mt-1 mb-0 shadow border">
                                  <div className="p-2">
                                    <Row className="align-items-center">
                                      <Col className="col-auto">
                                        <img
                                          data-dz-thumbnail=""
                                          height="100"
                                          className="avatar-sm rounded bg-light"
                                          alt={value.thumbnail}
                                          src={`${COMPANY_MEDIA_BASEURL}${value.thumbnail}`}
                                        />
                                      </Col>
                                      <Col>
                                        <p
                                          className="mb-1"
                                          style={{
                                            color: isDarkMode
                                              ? "#DADADA"
                                              : "black",
                                          }}
                                        >
                                          <strong>{`Video ${i + 1}`}</strong>
                                        </p>
                                        <a
                                          href={`${COMPANY_MEDIA_BASEURL}${value.video}`}
                                          className="text-primary fw-bold text-decoration-none"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {"View Video"}
                                        </a>
                                      </Col>
                                    </Row>
                                  </div>
                                </Card>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </>
            )}
          </Container>
        </div>
      )}
    </>
  );
}
