import { useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/useHttp";
import {
  AGENTLOGOURL,
  APIRoutes,
  BASEURL,
  CATEGORYBASEURL,
  COMPANY_IMAGES_BASEURL,
  COMPANY_PDF_BASEURL,
  COMPANY_VIDEOS_BASEURL,
  COMPANY_VIDEOSTHUMB_BASEURL,
  COMPANYBASEURL,
  COMPANYLOGOURL,
  formatToLocalTime,
} from "../../configs/globalConfig";
import { Link, useNavigate, useParams } from "react-router-dom";
import logoPlaceHolder from "../../assets/images/image_placeholder_logo.png";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import Breadcrumbs from "../../components/Breadcrumb";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import MessageModal from "../../components/UI/MessageModal";
import axios from "axios";
import { useSelector } from "react-redux";

const requestConfig = {
  method: "POST",
};

export default function ViewAgentPage() {
  const navigate = useNavigate();
  const { agentId } = useParams(); // Extract companyId from the URL
  const [agentDetails, setAgentDetails] = useState(null); // State to store company detailsx
  const [isLoaded, setIsLoaded] = useState(false);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });
  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [companyLogo, setAgentLogo] = useState(null);

  useEffect(() => {
    // Fetch the company details when the component mounts
    async function fetchAgentDetails() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getAgentDetails}?id=${agentId}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            setIsLoaded(true);
            setAgentDetails(response.data.agent);
            setAgentLogo(`${AGENTLOGOURL}${response.data.agent.logo}`);
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
        console.error("Failed to fetch agent details:", error);
        setIsLoaded(true);
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      }
    }
    fetchAgentDetails();
  }, [agentId]);

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
            title={"View Agent"}
            breadcrumbItems={[
              { title: "Agents", link: "/agents" },
              { title: "View Agent", link: "#" },
            ]}
          />
          <Container fluid>
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            {agentDetails && (
              <>
                <Card>
                  <CardBody>
                    <div>
                      {agentDetails.logo != null && (
                        <Row>
                          <div className="mb-5">
                            <center>
                              <div>
                                <img
                                  src={`${AGENTLOGOURL}${agentDetails.logo}`}
                                  alt="Agent Logo"
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
                          <Col lg={4}>
                            <Label className="form-label">AGENT NAME</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {agentDetails.agentName}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">PERSON NAME</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {agentDetails.firstName} {agentDetails.lastName}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">GST NUMBER</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {agentDetails.gstNo !== ""
                                ? agentDetails.gstNo
                                : "-"}
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
                              {agentDetails.emailId}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">MOBILE NUMBER</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {agentDetails.mobileNo}
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
                            {agentDetails.address}
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
                              {agentDetails.city}
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
                              {agentDetails.state}
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
                              {agentDetails.country}
                            </p>
                          </Col>
                        </Row>
                      </div>
                      <div className="mb-2">
                        <Row>
                          <Col>
                            <Label className="form-label">
                              COMPANY CAN ADD
                            </Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {agentDetails.companyCanAddCount}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">COMPANY ADDED</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {agentDetails.companyAddedCount}
                            </p>
                          </Col>
                          <Col>
                            <Label className="form-label">TOTAL COMPANY</Label>
                            <p
                              style={{
                                color: isDarkMode ? "#DADADA" : "black",
                              }}
                            >
                              {parseInt(agentDetails.companyCanAddCount) +
                                parseInt(agentDetails.companyAddedCount)}
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
