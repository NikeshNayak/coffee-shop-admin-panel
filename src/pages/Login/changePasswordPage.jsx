/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/useHttp";
import {
  APIRoutes,
  BASEURL,
  COMPANY_IMAGES_BASEURL,
  COMPANYBASEURL,
} from "../../configs/globalConfig";
import logoPlaceHolder from "../../assets/images/image_placeholder_logo.png";
import { Form, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumb";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import Select from "react-select";
import MessageModal from "../../components/UI/MessageModal";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import axios from "axios";
import ErrorMessage from "../../components/Error";
import InputField from "../../components/UI/InputField";
import InputDropDownField from "../../components/UI/InputDropDownField";
import MediaDropzone from "../../components/UI/MediaDropZone";
import { useDropzone } from "react-dropzone";
import ImageList from "../../components/ImageList";
import VideoList from "../../components/VideoList";
import PdfFileComponent from "../../components/PdfFileComponent";
import LogoComponent from "../../components/LogoComponent";
import { useSelector } from "react-redux";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staffId");

  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });
  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileNumberPattern = /^\d{10}$/;

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [validateForm, setValidateForm] = useState(false);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // const onDropLogo = useCallback((acceptedFiles) => {
  //   const acceptedFormats = ["image/jpeg", "image/png", "image/jpg"];

  //   const file = acceptedFiles[0];
  //   const isFileValid = file && acceptedFormats.includes(file.type);
  //   if (!isFileValid) {
  //     return;
  //   }
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setCompanyLogoFile(file);
  //       setCompanyLogo(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }, []);

  const formRef = useRef(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
    clearError,
  } = useHttp(`${BASEURL}${APIRoutes.changepassword}?staffId=${staffId}`, requestConfig);

  const handleInputChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit() {
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

    const fd = new FormData();
    // Append form data fields
    Object.keys(formData).forEach((key) => {
      fd.append(key, formData[key]);
    });
    const data = Object.fromEntries(fd.entries());
    sendRequest(JSON.stringify(data));
  }

  function handleFinish() {
    setIsMessageModalOpen(false);
    clearData();
    if (formRef.current) {
      formRef.current.reset();
    }
    navigate("/dashboard");
  }

  let actions = (
    <div className="mb-2" style={{ textAlign: "center" }}>
      <Button
        type="button"
        color="primaryPurple"
        className="waves-effect waves-light"
        onClick={() => {
          handleSubmit();
        }}
      >
        Update Password
      </Button>
      <span className="ms-2"></span>
      <Button
        type="button"
        onClick={() => {
          navigate("/companies");
        }}
        color="secondary"
      >
        Cancel
      </Button>
    </div>
  );

  useEffect(() => {
    if (data && !error) {
      setIsMessageModalOpen(true);
    } else if (error) {
      setSnackMsg({
        isOpen: true,
        isSuccess: false,
        message: error,
      });
      clearData();
      clearError();
    }
  }, [data, error, clearData, clearError]);

  return (
    <>
      {isSending && (
        <div className="page-content">
          <div id="status">
            <div className="spinner">
              <i className="ri-loader-line spin-icon"></i>
            </div>
          </div>
        </div>
      )}
      {!isSending && (
        <div className="page-content">
          <Breadcrumbs title={"Change Password"} breadcrumbItems={[]} />
          <Container fluid>
            <MessageModal
              title={"Success!"}
              message={"Password was changed successfully."}
              isOpen={isMessageModalOpen}
              handleModalClose={handleFinish}
            />
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            <form ref={formRef}>
              <Card>
                <CardBody>
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
                      invalid={formData.newPassword === "" && validateForm}
                      passwordLength={
                        formData.newPassword.length < 8 && validateForm
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
                        formData.confirmPassword === "" && validateForm
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
                      invalid={formData.confirmPassword === "" && validateForm}
                      sameConfirmPassword={
                        formData.confirmPassword !== formData.newPassword &&
                        validateForm
                      }
                      required
                      placeholder="Enter Confirm Password"
                      onChange={handleInputChange}
                    />
                    <i
                      className={`ri-eye${
                        showConfirmPassword ? "-line" : "-off-line"
                      } ${
                        formData.confirmPassword === "" && validateForm
                          ? "auti-password-toggle-icon-error"
                          : "auti-password-toggle-icon"
                      }`}
                      onClick={toggleConfirmPasswordVisibility}
                    ></i>
                  </div>
                  {!isSending && actions}
                </CardBody>
              </Card>
            </form>
          </Container>
        </div>
      )}
    </>
  );
}
