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
};

export default function CreateCompanyPage() {
  const navigate = useNavigate();
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
    companyName: "",
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNo: "",
    address: "",
  });
  const [validateForm, setValidateForm] = useState(false);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyLogoFile, setCompanyLogoFile] = useState(null);

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
  const [pdfAttachFile, setPdfAttachFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const [imagesList, setImagesList] = useState([]);

  const [videosList, setVideosList] = useState([]);
  const [productKey, setProductKey] = useState(null);

  const [countriesList, setCountryList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
    clearError,
  } = useHttp(`${COMPANYBASEURL}${APIRoutes.createCompany}`, requestConfig);

  async function fetchCountriesList() {
    try {
      const response = await axios.get(
        `${BASEURL}${APIRoutes.getCountriesList}`
      );
      if (response.status === 200) {
        console.log(response.data);
        if (response.data.success === true) {
          setCountryList((prevState) => response.data.countriesList);
        }
      }
    } catch (error) {
      console.error("Failed to fetch countries list:", error);
    }
  }

  async function fetchStatesList(country_code) {
    try {
      const response = await axios.get(
        `${BASEURL}${APIRoutes.getStatesListByCountry}?code=${country_code}`
      );
      if (response.status === 200) {
        console.log(response.data);
        if (response.data.success === true) {
          setStatesList((prevState) => response.data.statesList);
        }
      }
    } catch (error) {
      console.error("Failed to fetch states list:", error);
    }
  }

  async function fetchCitiesList(stateId) {
    try {
      const response = await axios.get(
        `${BASEURL}${APIRoutes.getCitiesList}?state_id=${stateId}`
      );
      if (response.status === 200) {
        if (response.data.success === true) {
          setCitiesList((prevState) => response.data.cityList);
        }
      }
    } catch (error) {
      console.error("Failed to fetch cities list:", error);
    }
  }

  useEffect(() => {
    // Fetch the product key when the component mounts
    async function fetchProductKey() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getProductKey}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            setProductKey(response.data.productKey.key);
            return;
          }
        }
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: response.data.message,
        });
      } catch (error) {
        console.error("Failed to fetch company details:", error);
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      }
    }
    fetchProductKey();
    fetchCountriesList();
  }, []);

  const handleInputChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCountryChange = async (selectedOption) => {
    if (selectedOption === null) {
      console.log("Select cleared");
      return;
    }
    console.log(selectedOption);
    const selected = countriesList.find(
      (ele) => ele._id === selectedOption.value
    );
    console.log(selected);
    setSelectedCountry((prevState) => selected);
    await fetchStatesList(selected.country_code);
  };

  const handleStateChange = async (selectedOption) => {
    if (selectedOption === null) {
      console.log("Select cleared");
      return;
    }
    console.log(selectedOption);
    const selected = statesList.find((ele) => ele._id === selectedOption.value);
    console.log(selected);
    setSelectedState((prevState) => selected);
    await fetchCitiesList(selected._id);
  };

  const handleCityChange = (selectedOption) => {
    if (selectedOption === null) {
      console.log("Select cleared");
      return;
    }
    console.log(selectedOption);
    const selected = citiesList.find((ele) => ele._id === selectedOption.value);
    console.log(selected);
    setSelectedCity((prevState) => selected);
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

    if (pdfAttachFile === null) {
      setSnackMsg({
        isOpen: true,
        isSuccess: false,
        message: "Please select main catalogue pdf !!",
      });
      return;
    }

    if (!emailRegex.test(formData.emailId)) {
      return;
    }

    const fd = new FormData();
    // Append form data fields
    Object.keys(formData).forEach((key) => {
      fd.append(key, formData[key]);
    });

    if (pdfAttachFile !== null) {
      fd.append("pdfFile", pdfAttachFile);
    }

    if (companyLogoFile !== null) {
      fd.append("logo", companyLogoFile);
    }
    if (imagesList.length > 0) {
      imagesList.forEach((value, index) => {
        fd.append(`images[]`, value.file);
      });
    }

    if (videosList.length > 0) {
      videosList.forEach((value, index) => {
        fd.append(`videos[]`, value.file);
      });
    }
    fd.append("productKey", productKey);
    fd.append("city", selectedCity.name);
    fd.append("state", selectedState.name);
    fd.append("country", selectedCountry.name);
    sendRequest(fd);
  }

  function handleFinish() {
    setIsMessageModalOpen(false);
    clearData();
    if (formRef.current) {
      formRef.current.reset();
    }
    navigate("/companies");
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogoFile(file);
        setCompanyLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfFileChange = (e) => {
    // const pdfFile = list[0];
    // setPdfFile(pdfFile);
    const file = e.target.files[0];
    if (file) {
      // 5 MB size limit
      const maxSize = 5 * 1024 * 1024; // 5 MB in bytes

      if (file && file.size > maxSize) {
        alert("File size exceeds 5 MB. Please upload a smaller file.");
        return;
      }
      const reader = new FileReader();

      reader.onloadend = () => {
        const blob = new Blob([reader.result], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        setPdfFile(blobUrl);
        setPdfAttachFile(file);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleImageFilesChange = (list) => {
    const files = Array.from(list);
    if (files.length > 0) {
      const fileReaders = [];
      const imageFiles = [];

      if (files.length > 4) {
        alert("You can only upload a maximum of 4 images.");
        return;
      }
      setImagesList(files);
      // files.forEach((file, index) => {
      //   const reader = new FileReader();
      //   fileReaders.push(reader);

      //   reader.onloadend = () => {
      //     const blob = new Blob([reader.result], { type: file.type });
      //     const blobUrl = URL.createObjectURL(blob);
      //     imageFiles.push(blobUrl);
      //     if (imageFiles.length === files.length) {
      //       setImagesList(imageFiles); // or use setImageFiles or a different state function for clarity
      //     }
      //   };

      //   reader.readAsArrayBuffer(file);
      // });
    }
  };

  const handleImageDelete = (value) => {
    setImagesList((prevImageList) => {
      const newImageList = prevImageList.filter(
        (ele) => ele.file !== value.file
      );
      return newImageList;
    });

    // // Reset the file input
    // if (imageFileRef.current) {
    //   imageFileRef.current.value = null;
    // }

    // // Repopulate the file input with remaining files
    // const dataTransfer = new DataTransfer();
    // imagesList.forEach((imageUrl) => {
    //   if (imageUrl !== value) {
    //     const file = new File([], imageUrl); // Create a dummy file
    //     dataTransfer.items.add(file);
    //   }
    // });

    // if (imageFileRef.current) {
    //   imageFileRef.current.files = dataTransfer.files;
    // }
  };

  const handleVideoFilesChange = (list) => {
    const files = Array.from(list);
    if (files.length > 0) {
      const fileReaders = [];
      const videoFiles = [];

      if (files.length > 1) {
        alert("You can only upload a maximum of 1 video.");
        return;
      }
      setVideosList(files);

      // files.forEach((file, index) => {
      //   const reader = new FileReader();
      //   fileReaders.push(reader);

      //   reader.onloadend = () => {
      //     const blob = new Blob([reader.result], { type: file.type });
      //     const blobUrl = URL.createObjectURL(blob);
      //     videoFiles.push(blobUrl);
      //     if (videoFiles.length === files.length) {
      //        // or use setImageFiles or a different state function for clarity
      //     }
      //   };

      //   reader.readAsArrayBuffer(file);
      // });
    }
  };

  const handleVideoDelete = (value) => {
    setVideosList((prevVideoList) => {
      const newVideoList = prevVideoList.filter(
        (ele) => ele.file !== value.file
      );
      return newVideoList;
    });
  };

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
        Create Company
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
          <Breadcrumbs
            title={"Create New Company"}
            breadcrumbItems={[
              { title: "Companies", link: "/companies" },
              { title: "Create Company", link: "#" },
            ]}
          />
          <Container fluid>
            <MessageModal
              title={"Success!"}
              message={"Company was added successfully."}
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
                  <Row>
                    <div className="mb-3">
                      {companyLogo ? (
                        <center>
                          <div className="mt-2">
                            <img
                              src={companyLogo}
                              alt="Company Logo"
                              style={{
                                maxHeight: "100px",
                                maxWidth: "100%",
                                borderRadius: "15px",
                              }}
                              onClick={() =>
                                document.getElementById("logo").click()
                              }
                            />
                          </div>
                        </center>
                      ) : (
                        <center>
                          <div className="mt-2">
                            <div
                              style={{
                                width: "100px",
                                height: "100px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                color: "#ccc",
                                padding: "6px",
                              }}
                            >
                              <img
                                src={logoPlaceHolder}
                                alt="Company Logo"
                                style={{ maxHeight: "100px", maxWidth: "100%" }}
                                onClick={() =>
                                  document.getElementById("logo").click()
                                }
                              />
                            </div>
                          </div>
                        </center>
                      )}
                      {companyLogo !== null && (
                        <Col lg="12">
                          <div className="mt-4" style={{ textAlign: "center" }}>
                            <Button
                              type="button"
                              color="primaryPurple"
                              className="waves-effect waves-light"
                              style={{
                                minWidth: "140px",
                              }}
                              onClick={() =>
                                document.getElementById("logo").click()
                              }
                            >
                              <i className="ri-edit-fill"></i>
                              <span className="ms-1">Change Logo</span>
                            </Button>
                            <span className="ms-3"></span>
                            <Button
                              type="button"
                              color="danger"
                              style={{
                                minWidth: "140px",
                              }}
                              onClick={() => {
                                document.getElementById("logo").value = "";
                                setCompanyLogo(null);
                                setCompanyLogoFile(null);
                              }}
                            >
                              <i className="ri-delete-bin-fill"></i>
                              <span className="ms-1">Remove</span>
                            </Button>
                          </div>
                        </Col>
                      )}
                      <Label className="form-label" htmlFor="logo">
                        Company Logo
                      </Label>
                      <div className="mb-1">
                        <Input
                          id="logo"
                          type="file"
                          className="form-control"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleLogoChange}
                        />
                        <small className="form-text text-muted">
                          Allowed file extensions: .png, .jpg, .jpeg
                        </small>
                      </div>
                      <div className="file-display">
                        {companyLogoFile ? (
                          <Label>Selected file: {companyLogoFile.name}</Label>
                        ) : (
                          <Label>No file selected</Label>
                        )}
                      </div>
                    </div>
                    <Col lg="6">
                      <InputField
                        id="companyName"
                        label="Company name"
                        defaultValue={formData.companyName}
                        invalid={formData.companyName === "" && validateForm}
                        required={true}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg="6">
                      <InputField
                        id="gstNo"
                        name="gstNo"
                        label="GST Number"
                        defaultValue={formData.gstNo}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg="6">
                      <InputField
                        id="firstName"
                        name="firstName"
                        label="First name"
                        defaultValue={formData.firstName}
                        invalid={formData.firstName === "" && validateForm}
                        required
                        placeholder="Eg. Jhon"
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg="6">
                      <InputField
                        id="lastName"
                        name="lastName"
                        label="Last name"
                        defaultValue={formData.lastName}
                        invalid={formData.lastName === "" && validateForm}
                        required
                        placeholder="Eg. Carter"
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <InputField
                        id="emailId"
                        name="emailId"
                        label="Email"
                        type="email"
                        defaultValue={formData.emailId}
                        invalid={formData.emailId === "" && validateForm}
                        emailInvalid={
                          formData.emailId !== "" &&
                          !emailRegex.test(formData.emailId) &&
                          validateForm
                        }
                        required
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg="6">
                      <InputField
                        id="mobileNo"
                        name="mobileNo"
                        label="Mobile Number"
                        type="text"
                        defaultValue={formData.mobileNo}
                        value={formData.mobileNo}
                        invalid={formData.mobileNo === "" && validateForm}
                        mobileNoInvalid={
                          formData.mobileNo !== "" &&
                          !mobileNumberPattern.test(formData.mobileNo) &&
                          validateForm
                        }
                        minLength={10} // Ensure minimum length for validation if necessary
                        maxLength={10} // Limit to 10 characters
                        onInput={(e) => {
                          // Remove non-numeric characters
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10); // Limit to 10 digits
                          handleInputChange(e); // Update state or call a handler to set the value
                        }}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12">
                      <InputField
                        id="address"
                        label="Address"
                        type="textarea"
                        defaultValue={formData.address}
                        invalid={formData.address === "" && validateForm}
                        required
                        rows="3"
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <InputDropDownField
                        selectedValue={
                          selectedCountry
                            ? {
                                label: selectedCountry.name,
                                value: selectedCountry._id,
                              }
                            : null
                        }
                        label="Country"
                        onChange={handleCountryChange}
                        options={countriesList.map((ele) => ({
                          label: ele.name,
                          value: ele._id,
                        }))}
                        required={true}
                        invalid={selectedCountry == null && validateForm}
                        placeholder="Select Country"
                        noOptionsMessage="No Countries"
                        classNamePrefix="select2-selection"
                      />
                    </Col>
                    {/* <Col lg="4">
                      <InputField
                        id="country"
                        name="country"
                        label="Country"
                        placeholder="Eg. India"
                        defaultValue={formData.country}
                        invalid={formData.country === "" && validateForm}
                        required
                        onChange={handleInputChange}
                      />
                    </Col> */}
                    <Col lg="4">
                      <InputDropDownField
                        selectedValue={
                          selectedState
                            ? {
                                label: selectedState.name,
                                value: selectedState._id,
                              }
                            : null
                        }
                        label="State"
                        onChange={handleStateChange}
                        options={statesList.map((ele) => ({
                          label: ele.name,
                          value: ele._id,
                        }))}
                        required={true}
                        invalid={selectedState == null && validateForm}
                        placeholder="Select State"
                        noOptionsMessage="No States"
                        classNamePrefix="select2-selection"
                      />
                    </Col>
                    <Col lg="4">
                      <InputDropDownField
                        selectedValue={
                          selectedCity
                            ? {
                                label: selectedCity.name,
                                value: selectedCity._id,
                              }
                            : null
                        }
                        label="City"
                        onChange={handleCityChange}
                        options={citiesList.map((ele) => ({
                          label: ele.name,
                          value: ele._id,
                        }))}
                        required={true}
                        invalid={selectedCity == null && validateForm}
                        placeholder="Select City"
                        noOptionsMessage="No Cities"
                        classNamePrefix="select2-selection"
                      />
                    </Col>
                  </Row>
                  <div className="mb-3">
                    {!productKey && (
                      <ErrorMessage message={"No Product Key Available"} />
                    )}
                    {productKey && (
                      <Card className="mt-1 mb-0 shadow border">
                        <div className="d-flex justify-content-between align-items-center p-3">
                          <div className="d-flex align-items-center">
                            <i className="mdi mdi-key text-danger display-6 me-3"></i>
                            <div>
                              <p
                                className="mb-1"
                                style={{
                                  color: isDarkMode ? "#DADADA" : "black",
                                }}
                              >
                                <strong>{`Unique Product Key`}</strong>
                              </p>
                              <p
                                className="mb-1"
                                style={{
                                  color: isDarkMode ? "#DADADA" : "black",
                                }}
                              >{`${productKey}`}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div>
                    <div className="mb-3">
                      <Row>
                        <Label
                          className="form-label font-size-20"
                          style={{ textAlign: "center" }}
                        >
                          <strong>MAIN CATALOGUE</strong>
                        </Label>
                      </Row>
                    </div>
                    {/* <PdfFileComponent
                      label={`Main Catalogue`}
                      pdfFile={pdfFile}
                      handlePdfFileChange={handlePdfFileChange}
                      handlePdfDelete={() => {
                        setPdfFile(null);
                      }}
                    /> */}
                    <div className="mb-4">
                      {pdfFile !== null && (
                        <div className="mb-3">
                          <Card className="mt-1 mb-0 shadow border">
                            <div className="d-flex justify-content-between align-items-center p-2">
                              <div className="d-flex align-items-center">
                                <i className="mdi mdi-pdf-box text-danger display-4 me-2"></i>
                                <div>
                                  <p
                                    className="mb-1"
                                    style={{
                                      color: isDarkMode ? "#DADADA" : "black",
                                    }}
                                  >
                                    <strong>{`Main Catalogue`}</strong>
                                  </p>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.open(pdfFile, "_blank");
                                    }}
                                    className="text-primary fw-bold text-decoration-none"
                                  >
                                    View PDF
                                  </a>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                      <div className="mb-4">
                        <Label className="form-label" htmlFor="logo">
                          Upload PDF{<span style={{ color: "red" }}> *</span>}
                        </Label>
                        <div className="mb-1">
                          <Input
                            type="file"
                            id="pdfFile"
                            className="form-control"
                            accept="application/pdf"
                            invalid={pdfAttachFile === null && validateForm}
                            onChange={handlePdfFileChange}
                          />
                        </div>
                        <div className="file-display">
                          {pdfAttachFile ? (
                            <Label>Selected file: {pdfAttachFile.name}</Label>
                          ) : (
                            <Label>No file selected</Label>
                          )}
                        </div>
                        {pdfAttachFile === null && validateForm && (
                          <FormFeedback className="d-block">
                            PDF file is required!
                          </FormFeedback>
                        )}
                      </div>
                    </div>
                    <ImageList
                      imagesList={imagesList}
                      handleImageFilesChange={handleImageFilesChange}
                      handleImageDelete={handleImageDelete}
                    />
                    <VideoList
                      videosList={videosList}
                      handleVideoFilesChange={handleVideoFilesChange}
                      handleVideoDelete={handleVideoDelete}
                    />
                    {!isSending && actions}
                  </div>
                </CardBody>
              </Card>
            </form>
          </Container>
        </div>
      )}
    </>
  );
}
