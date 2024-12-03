import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Button, Container } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import logodark from "../../assets/app-logo.png";
import logolight from "../../assets/app-logo.png";
import useHttp from "../../hooks/useHttp";
import { APIRoutes, BASEURL } from "../../configs/globalConfig";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import InputField from "../../components/UI/InputField";
import MessageModal from "../../components/UI/MessageModal";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  const formRef = useRef(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [formData, setFormData] = useState({
    emailId: "",
  });
  const [validateForm, setValidateForm] = useState(false);

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
  } = useHttp(`${BASEURL}${APIRoutes.forgotpassword}`, requestConfig);

  async function handleSubmit(event) {
    // event.preventDefault();

    // setValidateForm(true); // Trigger validation on all fields

    // // Perform validation check
    // const isValid = Object.values(formData).every(
    //   (value) => value.trim() !== ""
    // );
    // if (!isValid) {
    //   setSnackMsg({
    //     isOpen: true,
    //     isSuccess: false,
    //     message: "Please fill out all required fields.",
    //   });
    //   return;
    // }
    // const fd = new FormData(event.target);
    // const keysData = Object.fromEntries(fd.entries());
    // console.log(keysData);
    // sendRequest(JSON.stringify(keysData));
  }

  function handleFinish() {
    setIsMessageModalOpen(false);
    clearData();
    if (formRef.current) {
      formRef.current.reset();
    }
    navigate("/");
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

  return (
    <React.Fragment>
      <div>
        <Container fluid className="p-0">
        <MessageModal
              title={"Success!"}
              message={"Password reset link sent! Please check your inbox (or spam folder) to reset your password."}
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
                              Reset your password to Coffe Shop.
                            </p>
                          </div>
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
                                Don't have an account ?{" "}
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

export default ForgotPasswordPage;
