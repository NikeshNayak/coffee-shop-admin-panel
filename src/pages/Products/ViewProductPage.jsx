import { useEffect, useState } from "react";
import {
  APIRoutes,
  BASEURL,
  formatToLocalTime,
  MEDIA_URL,
} from "../../configs/globalConfig";
import { Card, CardBody, Col, Container, Label, Row } from "reactstrap";
import Breadcrumbs from "../../components/Breadcrumb";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function ViewProductPage() {
  const { productId } = useParams(); // Extract productId from the URL
  const [productDetails, setProductDetails] = useState(null); // State to store product details
  const [isLoaded, setIsLoaded] = useState(false);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });
  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";

  useEffect(() => {
    // Fetch the product details when the component mounts
    async function fetchProductDetails() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getProductDetails}/${productId}`
        );
        if (response.status === 200 && response.data.success) {
          setIsLoaded(true);
          setProductDetails(response.data.product);
        } else {
          setIsLoaded(true);
          setSnackMsg({
            isOpen: true,
            isSuccess: false,
            message: response.data.message,
          });
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setIsLoaded(true);
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      }
    }
    fetchProductDetails();
  }, [productId]);

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
            title={"View Product"}
            breadcrumbItems={[
              { title: "Products", link: "/products" },
              { title: "View Product", link: "#" },
            ]}
          />
          <Container fluid>
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            {productDetails && (
              <>
                <Card>
                  <CardBody>
                    <div>
                      {productDetails.image && (
                        <Row>
                          <div className="mb-5">
                            <center>
                              <div>
                                <img
                                  src={`${MEDIA_URL}${productDetails.image}`}
                                  alt="Product"
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
                            <Label className="form-label">TITLE</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {productDetails.title}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">SUBTITLE</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {productDetails.subtitle}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">PRICE</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              ${productDetails.price.toFixed(2)}
                            </p>
                          </Col>
                        </Row>
                      </div>
                      <div className="mb-2">
                        <Row>
                          <Col>
                            <Label className="form-label">TYPE</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {productDetails.type}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">SUBTYPE</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {productDetails.subType}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">IS MILK ADDED</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {productDetails.isMilkAdded ? "Yes" : "No"}
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
                            {productDetails.description}
                          </p>
                        </Row>
                      </div>
                      <div className="mb-2">
                        <Row>
                          <Col>
                            <Label className="form-label">
                              CREATED DATE
                            </Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {formatToLocalTime(productDetails.createdAt)}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">UPDATED DATE</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {formatToLocalTime(productDetails.updatedAt)}
                            </p>
                          </Col>
                        </Row>
                      </div>
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
