import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Input, Button, Alert, Container, Label } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import logodark from "../../assets/app-logo.png";
import logolight from "../../assets/app-logo.png";
import useHttp from "../../hooks/useHttp";
import { APIRoutes, BASEURL } from "../../configs/globalConfig";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import InputField from "../../components/UI/InputField";
import axios from "axios";
import MessageModal from "../../components/UI/MessageModal";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const ResetPasswordPage = () => {
  const { token } = useParams();

  const navigate = useNavigate();
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [isUsed, setIsUsed] = useState(false);
  const [emailId, setEmail] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const formRef = useRef(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [validateForm, setValidateForm] = useState(false);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleInputChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  function handleFinish() {
    setIsMessageModalOpen(false);
    clearData();
    if (formRef.current) {
      formRef.current.reset();
    }
    navigate("/");
  }

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
    clearError,
  } = useHttp(
    `${BASEURL}${APIRoutes.resetpassword}?token=${token}`,
    requestConfig
  );

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.post(
          `${BASEURL}${APIRoutes.validateToken}`,
          { token }
        );
        if (response.status === 200 && response.data.success) {
          setIsUsed(response.data.resetPasswordRequest.isUsed);
          setEmail(response.data.resetPasswordRequest.emailId);
          setIsValid(true);
        } else {
          setIsExpired(true);
        }
      } catch (error) {
        console.log(error);
        setIsExpired(true);
      }
    };
    validateToken();
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();

    setValidateForm(true); // Trigger validation on all fields

    // Perform validation check
    const isValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    if (!isValid) {
      setSnackMsg({
        isOpen: true,
        isSuccess: false,
        message: "Please fill out all required fields.",
      });
      return;
    }
    const fd = new FormData(event.target);
    fd.append("emailId", emailId);
    const keysData = Object.fromEntries(fd.entries());
    console.log(keysData);
    sendRequest(JSON.stringify(keysData));
  }

  useEffect(() => {
    if (data && !error) {
      setIsMessageModalOpen(true);
    } else if (error) {
      setSnackMsg({
        isOpen: true,
        isSuccess: false,
        message: error,
      });
      clearError();
      clearData();
    }
  }, [clearData, clearError, data, error, navigate]);

  if (isExpired) {
    return (
      <div
        className="row justify-content-center align-items-center"
        style={{
          minHeight: "100vh", // Makes sure the container takes up the full height of the viewport
          paddingTop: "2rem",
          paddingLeft: "30px",
          paddingRight: "30px",
        }}
      >
        <Col lg="6">
          <div className="text-center">
            <div className="mb-4">
              <i className="mdi mdi-alert-circle text-danger display-4"></i>
            </div>
            <div>
              <h5>Link Expired</h5>
              <p className="text-muted">
                The link you followed has expired. If you have any questions or
                need further assistance, feel free to contact our support team.
              </p>
            </div>
          </div>
        </Col>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="page-content">
        <div id="status">
          <div className="spinner">
            <i className="ri-loader-line spin-icon"></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div>
        <Container fluid className="p-0">
          <MessageModal
            title={"Success!"}
            message={"Password was reset successfully."}
            isOpen={isMessageModalOpen}
            handleModalClose={handleFinish}
          />
          <CustomSnackBar snackBarMsg={snackBarMsg} setSnackMsg={setSnackMsg} />
          <Row className="g-0">
            <Col lg={4}>
              <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                <div className="w-100">
                  <Row className="justify-content-center">
                    <Col lg={9}>
                      <div>
                        <div className="text-center">
                          <div>
                            <Link to="/" className="">
                              <img
                                src={logodark}
                                alt=""
                                height="50"
                                className="auth-logo logo-dark mx-auto"
                              />
                              <img
                                src={logolight}
                                alt=""
                                height="50"
                                className="auth-logo logo-light mx-auto"
                              />
                            </Link>
                            <h4 className="font-size-18 mt-5">
                              Reset Password
                            </h4>
                            <p className="text-muted">
                              Reset your password to Snap Share.
                            </p>
                          </div>
                        </div>
                        <div className="p-2 mt-4">
                          <form ref={formRef} onSubmit={handleSubmit}>
                            <div className="auth-form-group-custom mb-4">
                              <i
                                className={`ri-lock-2-line ${
                                  formData.newPassword === "" && validateForm
                                    ? "auti-custom-input-icon-error"
                                    : "auti-custom-input-icon"
                                }`}
                              />
                              <InputField
                                id="newPassword"
                                name="newPassword"
                                label="New Password"
                                type={showNewPassword ? "text" : "password"}
                                defaultValue={formData.newPassword}
                                invalid={
                                  formData.newPassword === "" && validateForm
                                }
                                passwordLength={
                                  formData.newPassword.length < 8 &&
                                  validateForm
                                }
                                required
                                placeholder="Enter New Password"
                                onChange={handleInputChange}
                              />
                              <i
                                className={`ri-eye${
                                  showNewPassword ? "-line" : "-off-line"
                                } ${
                                  formData.newPassword === "" && validateForm
                                    ? "auti-password-toggle-icon-error"
                                    : "auti-password-toggle-icon"
                                }`}
                                onClick={toggleNewPasswordVisibility}
                              ></i>
                            </div>
                            <div className="auth-form-group-custom mb-4">
                              <i
                                className={`ri-lock-2-line ${
                                  formData.confirmPassword === "" &&
                                  validateForm
                                    ? "auti-custom-input-icon-error"
                                    : "auti-custom-input-icon"
                                }`}
                              />
                              <InputField
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                defaultValue={formData.confirmPassword}
                                invalid={
                                  formData.confirmPassword === "" &&
                                  validateForm
                                }
                                sameConfirmPassword={
                                  formData.confirmPassword !==
                                    formData.newPassword && validateForm
                                }
                                required
                                placeholder="Enter Confirm Password"
                                onChange={handleInputChange}
                              />
                              <i
                                className={`ri-eye${
                                  showConfirmPassword ? "-line" : "-off-line"
                                } ${
                                  formData.confirmPassword === "" &&
                                  validateForm
                                    ? "auti-password-toggle-icon-error"
                                    : "auti-password-toggle-icon"
                                }`}
                                onClick={toggleConfirmPasswordVisibility}
                              ></i>
                            </div>
                            {isSending && <p>Please Wait...</p>}
                            {!isSending && (
                              <div className="mt-4 text-center">
                                <Button
                                  color="primaryPurple"
                                  className="w-md waves-effect waves-light"
                                >
                                  Reset
                                </Button>
                              </div>
                            )}
                            <div className="mt-4 text-center">
                              <p>
                                Already have an account ?{" "}
                                <Link
                                  to="/login"
                                  className="fw-medium text-primary"
                                >
                                  {" "}
                                  Log in{" "}
                                </Link>{" "}
                              </p>
                            </div>
                          </form>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col lg={8}>
              <div className="authentication-bg">
                <div className="bg-overlay"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ResetPasswordPage;
