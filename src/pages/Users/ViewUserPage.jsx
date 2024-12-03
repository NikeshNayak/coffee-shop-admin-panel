import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, CardBody, Col, Row, Label } from "reactstrap";
import Breadcrumbs from "../../components/Breadcrumb";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import { useSelector } from "react-redux";
import { BASEURL, APIRoutes } from "../../configs/globalConfig";

export default function ViewUserPage() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Extract userId from the URL
  const [userDetails, setUserDetails] = useState(null); // State to store user details
  const [isLoaded, setIsLoaded] = useState(false);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });
  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";

  useEffect(() => {
    // Fetch user details when the component mounts
    async function fetchUserDetails() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getUserDetails}/${userId}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            setIsLoaded(true);
            setUserDetails(response.data.user);
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
        console.error("Failed to fetch user details:", error);
        setIsLoaded(true);
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      }
    }
    fetchUserDetails();
  }, [userId]);

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
            title={"View User"}
            breadcrumbItems={[
              { title: "Users", link: "/users" },
              { title: "View User", link: "#" },
            ]}
          />
          <Container fluid>
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            {userDetails && (
              <>
                <Card>
                  <CardBody>
                    <div>
                      <div className="mb-2">
                        <Row>
                          <Col lg={4}>
                            <Label className="form-label">USER NAME</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {userDetails.name}
                            </p>
                          </Col>
                          <Col lg={4}>
                            <Label className="form-label">EMAIL ID</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {userDetails.emailId}
                            </p>
                          </Col>
                        </Row>
                      </div>
                      <div className="mb-2">
                        <Row>
                          <Col lg={4}>
                            <Label className="form-label">USER ID</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {userDetails._id}
                            </p>
                          </Col>
                          <Col lg={4}>
                            <Label className="form-label">CREATED AT</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {new Date(userDetails.createdAt).toLocaleString()}
                            </p>
                          </Col>
                          <Col lg={4}>
                            <Label className="form-label">UPDATED AT</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {new Date(userDetails.updatedAt).toLocaleString()}
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
