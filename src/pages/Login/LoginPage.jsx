import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Input, Button, Alert, Container, Label } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logodark from "../../assets/app-logo.png";
import logolight from "../../assets/app-logo.png";
import useHttp from "../../hooks/useHttp";
import { APIRoutes, BASEURL } from "../../configs/globalConfig";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import InputField from "../../components/UI/InputField";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const Login = () => {
  const navigate = useNavigate();
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  const formRef = useRef(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });
  const [validateForm, setValidateForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleInputChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
    clearError,
  } = useHttp(`${BASEURL}${APIRoutes.login}`, requestConfig);

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
    const keysData = Object.fromEntries(fd.entries());
    console.log(keysData);
    sendRequest(JSON.stringify(keysData));
  }

  useEffect(() => {
    if (data && !error) {
      console.log(data.accessToken);
      localStorage.setItem("staffId", data.userDetails._id);
      localStorage.setItem("userType", data.userDetails.userType);
      localStorage.setItem("token", data.accessToken);
      navigate("/");
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

  return (
    <React.Fragment>
      <div>
        <Container fluid className="p-0">
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
                          </div>
                          <h4 className="font-size-18 mt-4">Welcome Back !</h4>
                          <p className="text-muted">
                            Sign in to continue to Coffee Shop.
                          </p>
                        </div>
                        <div className="p-2 mt-4">
                          <form ref={formRef} onSubmit={handleSubmit}>
                            <div className="auth-form-group-custom mb-4">
                              <i
                                className={`ri-user-2-line ${
                                  (formData.emailId === "" && validateForm) ||
                                  (formData.emailId !== "" &&
                                    !emailRegex.test(formData.emailId) &&
                                    validateForm)
                                    ? "auti-custom-input-icon-error"
                                    : "auti-custom-input-icon"
                                }`}
                              />
                              <InputField
                                id="emailId"
                                name="emailId"
                                label="Email"
                                type="email"
                                defaultValue={formData.emailId}
                                invalid={
                                  formData.emailId === "" && validateForm
                                }
                                emailInvalid={
                                  formData.emailId !== "" &&
                                  !emailRegex.test(formData.emailId) &&
                                  validateForm
                                }
                                required
                                placeholder="Enter Email"
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="auth-form-group-custom mb-4">
                              <i
                                className={`ri-lock-2-line ${
                                  formData.password === "" && validateForm
                                    ? "auti-custom-input-icon-error"
                                    : "auti-custom-input-icon"
                                }`}
                              />
                              <InputField
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                defaultValue={formData.password}
                                invalid={
                                  formData.password === "" && validateForm
                                }
                                required
                                placeholder="Enter Password"
                                onChange={handleInputChange}
                              />
                              <i
                                className={`ri-eye${
                                  showPassword ? "-line" : "-off-line"
                                } ${
                                  formData.password === "" && validateForm
                                    ? "auti-password-toggle-icon-error"
                                    : "auti-password-toggle-icon"
                                }`}
                                onClick={togglePasswordVisibility}
                              ></i>
                            </div>
                            {/* <div className="form-check">
                              <Input
                                type="checkbox"
                                className="form-check-input"
                                id="customControlInline"
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customControlInline"
                              >
                                Remember me
                              </Label>
                            </div> */}
                            {isSending && <p>Please Wait...</p>}
                            {!isSending && (
                              <div className="mt-4 text-center">
                                <Button
                                  color="primaryPurple"
                                  className="w-md waves-effect waves-light"
                                >
                                  Log In
                                </Button>
                              </div>
                            )}
                            <div className="mt-4 text-center">
                              <Link
                                to="/forgot-password"
                                className="text-muted"
                              >
                                <i className="mdi mdi-lock me-1"></i> Forgot
                                your password?
                              </Link>
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

export default Login;
