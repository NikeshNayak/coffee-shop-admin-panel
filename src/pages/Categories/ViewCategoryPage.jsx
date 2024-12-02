import { useEffect, useState } from "react";
import {
  APIRoutes,
  BASEURL,
  CATEGORY_MEDIA_BASEURL,
} from "../../configs/globalConfig";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import Breadcrumbs from "../../components/Breadcrumb";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ViewCategoryPage() {
  const { categoryId } = useParams(); // Extract companyId from the URL
  const [categoryDetails, setCategoryDetails] = useState(null); // State to store company detailsx
  const [isLoaded, setIsLoaded] = useState(false);

  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";

  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  useEffect(() => {
    // Fetch the company details when the component mounts
    async function fetchCategoryDetails() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getCategoryDetails}?id=${categoryId}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            setIsLoaded(true);
            setCategoryDetails(response.data.category);
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
    fetchCategoryDetails();
  }, [categoryId]);

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
            title={"View Category"}
            breadcrumbItems={[
              { title: "Categories", link: "/categories" },
              { title: "View Category", link: "#" },
            ]}
          />
          <Container fluid>
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            {categoryDetails && (
              <>
                <Card>
                  <CardBody>
                    <div>
                      <div className="mb-2">
                        <Row>
                          <Col lg={4}>
                            <Label className="form-label">CATEGORY NAME</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {categoryDetails.categoryName}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">CODE</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {categoryDetails.code}
                            </p>
                          </Col>
                        </Row>
                      </div>
                      <div className="mb-2">
                        <Row>
                          <Label className="form-label">DESCRIPTION</Label>
                          <p
                            style={{
                              color: isDarkMode ? "#DADADA" : "black",
                            }}
                          >
                            {categoryDetails.description}
                          </p>
                        </Row>
                      </div>
                      {categoryDetails.parentCategories.length > 0 && (
                        <div className="mb-2">
                          <Row>
                            <Label className="form-label">TOP CATEGORY</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {
                                categoryDetails.parentCategories[
                                  categoryDetails.parentCategories.length - 1
                                ].categoryName
                              }
                            </p>
                          </Row>
                        </div>
                      )}
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
                            <strong>{categoryDetails.categoryName}</strong>
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
                                    <strong>{`${categoryDetails.categoryName} - Catalogue`}</strong>
                                  </p>
                                  <a
                                    href={`${CATEGORY_MEDIA_BASEURL}${categoryDetails.pdfLink}`}
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
                      {categoryDetails.images.length > 0 && (
                        <div className="mb-4">
                          <Row>
                            <Label className="form-label">IMAGES</Label>
                          </Row>
                          {categoryDetails.images.map((value, i) => (
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
                                        src={`${CATEGORY_MEDIA_BASEURL}${value}`}
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
                                        href={`${CATEGORY_MEDIA_BASEURL}${value}`}
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
                          ))}
                        </div>
                      )}
                      {categoryDetails.videos.length > 0 && (
                        <div className="mb-3">
                          <Row>
                            <Label className="form-label">VIDEOS</Label>
                          </Row>
                          {categoryDetails.videos.map((value, i) => (
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
                                        src={`${CATEGORY_MEDIA_BASEURL}${value.thumbnail}`}
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
                                        href={`${CATEGORY_MEDIA_BASEURL}${value.video}`}
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
                          ))}
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
