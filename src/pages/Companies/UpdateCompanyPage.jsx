/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/useHttp";
import {
  APIRoutes,
  BASEURL,
  COMPANY_MEDIA_BASEURL,
  COMPANYBASEURL,
} from "../../configs/globalConfig";
import { useNavigate, useParams } from "react-router-dom";
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
import InputField from "../../components/UI/InputField";
import ImageList from "../../components/ImageList";
import VideoList from "../../components/VideoList";
import InputDropDownField from "../../components/UI/InputDropDownField";
import { useSelector } from "react-redux";

const requestConfig = {
  method: "POST",
};

export default function UpdateCompanyPage() {
  const navigate = useNavigate();
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

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null); // State to store the logo file
  const [logo, setLogo] = useState(null); // State to store the logo file

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfAttachFile, setPdfAttachFile] = useState(null);

  const [imagesList, setImagesList] = useState([]);
  const [videosList, setVideosList] = useState([]);

  const [places, setPlaces] = useState({
    selectedCity: null,
    citiesList: [],
    selectedState: null,
    statesList: [],
    selectedCountry: null,
    countriesList: [],
  });

  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    mobileNo: "",
    address: "",
  });
  const [validateForm, setValidateForm] = useState(false);
  const mobileNumberPattern = /^\d{10}$/;

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
    clearError,
  } = useHttp(
    `${COMPANYBASEURL}${APIRoutes.updateCompany}?companyId=${companyId}`,
    requestConfig
  );

  async function fetchCitiesList(stateId, agentDetails) {
    try {
      const response = await axios.get(
        `${BASEURL}${APIRoutes.getCitiesList}?state_id=${stateId}`
      );
      if (response.status === 200) {
        if (response.data.success === true) {
          setPlaces((prevState) => {
            return {
              ...prevState,
              citiesList: response.data.cityList,
              selectedCity: null,
            };
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch cities list:", error);
    }
  }

  async function fetchStatesList(country_code) {
    try {
      const response = await axios.get(
        `${BASEURL}${APIRoutes.getStatesList}?code=${country_code}`
      );
      if (response.status === 200) {
        console.log(response.data);
        if (response.data.success === true) {
          let state = response.data.statesList.find(
            (value) => value.name === companyDetails.city
          );
          console.log(state);
          setPlaces((prevState) => {
            return {
              ...prevState,
              statesList: response.data.statesList,
              selectedState: state ? state : null,
            };
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch states list:", error);
    }
  }

  useEffect(() => {
    // Fetch the company details when the component mounts
    // async function fetchCountriesList() {
    //   try {
    //     const countryResponse = await axios.get(
    //       `${BASEURL}${APIRoutes.getCountriesList}`
    //     );
    //     if (countryResponse.status === 200) {
    //       console.log(countryResponse.data);
    //       if (countryResponse.data.success === true) {
    //         let countriesList = countryResponse.data.countriesList;
    //         let kCountry = countriesList.find(
    //           (value) => value.name === companyDetails.country
    //         );
    //         const statesResponse = await axios.get(
    //           `${BASEURL}${APIRoutes.getStatesList}?code=${kCountry.country_code}`
    //         );
    //         if (statesResponse.status === 200) {
    //           console.log(statesResponse.data);
    //           if (statesResponse.data.success === true) {
    //             let statesList = statesResponse.data.statesList;
    //             let state = statesList.find(
    //               (value) => value.name === companyDetails.state
    //             );
    //             console.log(state);
    //             const cityResponse = await axios.get(
    //               `${BASEURL}${APIRoutes.getCitiesList}?state_id=${state._id}`
    //             );
    //             if (cityResponse.status === 200) {
    //               if (cityResponse.data.success === true) {
    //                 let cityList = cityResponse.data.cityList;
    //                 let city = cityList.find(
    //                   (value) => value.name === companyDetails.city
    //                 );
    //                 console.log(city);
    //                 setPlaces((prevState) => {
    //                   return {
    //                     selectedCity: city,
    //                     selectedState: state,
    //                     selectedCountry: kCountry,
    //                     countriesList: countriesList,
    //                     statesList: statesList,
    //                     citiesList: cityList,
    //                   };
    //                 });
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch countries list:", error);
    //   }
    // }
    async function fetchCompanyDetails() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getCompanyDetails}?id=${companyId}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            const countryResponse = await axios.get(
              `${BASEURL}${APIRoutes.getCountriesList}`
            );
            if (countryResponse.status === 200) {
              console.log(countryResponse.data);
              if (countryResponse.data.success === true) {
                let countriesList = countryResponse.data.countriesList;
                let kCountry = countriesList.find(
                  (value) => value.name === response.data.company.country
                );
                const statesResponse = await axios.get(
                  `${BASEURL}${APIRoutes.getStatesList}?code=${kCountry.country_code}`
                );
                if (statesResponse.status === 200) {
                  console.log(statesResponse.data);
                  if (statesResponse.data.success === true) {
                    let statesList = statesResponse.data.statesList;
                    let state = statesList.find(
                      (value) => value.name === response.data.company.state
                    );
                    console.log(state);
                    const cityResponse = await axios.get(
                      `${BASEURL}${APIRoutes.getCitiesList}?state_id=${state._id}`
                    );
                    if (cityResponse.status === 200) {
                      if (cityResponse.data.success === true) {
                        let cityList = cityResponse.data.cityList;
                        let city = cityList.find(
                          (value) => value.name === response.data.company.city
                        );
                        console.log(city);
                        setPlaces((prevState) => {
                          return {
                            selectedCity: city,
                            selectedState: state,
                            selectedCountry: kCountry,
                            countriesList: countriesList,
                            statesList: statesList,
                            citiesList: cityList,
                          };
                        });
                      }
                    }
                  }
                }
              }
            }
            setIsLoaded(true);
            setCompanyDetails(response.data.company);
            setFormData({
              companyName: response.data.company.companyName,
              firstName: response.data.company.firstName,
              lastName: response.data.company.lastName,
              gstNo: response.data.company.gstNo,
              mobileNo: response.data.company.mobileNo,
              address: response.data.company.address,
            });
            setCompanyLogo(response.data.company.logo);
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

  async function handleSubmit() {
    setValidateForm(true); // Trigger validation on all fields

    // Perform validation check
    const { gstNo, ...restFormData } = formData; // Exclude gstNo from formData

    const isValid = Object.values(restFormData).every(
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

    if (pdfFile === null && companyDetails.mainCatalogue.pdfLink === null) {
      setSnackMsg({
        isOpen: true,
        isSuccess: false,
        message: "Please select main catalogue pdf !!",
      });
      return;
    }
    fd.append("previousLogo", companyLogo);

    if (logoFile !== null) {
      fd.append("logo", logoFile);
    }

    fd.append("prevPdfFile", companyDetails.mainCatalogue.pdfLink);
    if (pdfAttachFile !== null) {
      fd.append("pdfFile", pdfAttachFile);
    }

    fd.append(
      "prevImages",
      JSON.stringify(companyDetails.mainCatalogue.images)
    );
    fd.append(
      "prevVideos",
      JSON.stringify(companyDetails.mainCatalogue.videos)
    );
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
    fd.append(
      "city",
      places.selectedCity !== null
        ? places.selectedCity.name
        : companyDetails.city
    );
    fd.append(
      "state",
      places.selectedState !== null
        ? places.selectedState.name
        : companyDetails.state
    );
    fd.append(
      "country",
      places.selectedCountry !== null
        ? places.selectedCountry.name
        : companyDetails.country
    );
    fd.append("emailId", companyDetails.emailId);
    sendRequest(fd);
  }

  const handleCountryChange = async (selectedOption) => {
    if (selectedOption === null) {
      console.log("Select cleared");
      return;
    }
    console.log(selectedOption);
    const selected = places.countriesList.find(
      (ele) => ele._id === selectedOption.value
    );
    console.log(selected);
    setPlaces((prevState) => {
      return {
        ...prevState,
        selectedCountry: selected ? selected : null,
      };
    });
    await fetchStatesList(selected.country_code);
  };

  const handleStateChange = async (selectedOption) => {
    if (selectedOption === null) {
      console.log("Select cleared");
      return;
    }
    console.log(selectedOption);
    const selected = places.statesList.find(
      (ele) => ele._id === selectedOption.value
    );
    console.log(selected);
    setPlaces((prevState) => {
      return {
        ...prevState,
        selectedState: selected ? selected : null,
      };
    });
    await fetchCitiesList(selected._id);
  };

  const handleCityChange = (selectedOption) => {
    if (selectedOption === null) {
      console.log("Select cleared");
      return;
    }
    console.log(selectedOption);
    const selected = places.citiesList.find(
      (ele) => ele._id === selectedOption.value
    );
    console.log(selected);
    setPlaces((prevState) => {
      return {
        ...prevState,
        selectedCity: selected ? selected : null,
      };
    });
  };

  function handleFinish() {
    setIsMessageModalOpen(false);
    clearData();
    if (formRef.current) {
      formRef.current.reset();
    }
    navigate("/companies");
  }

  const handleInputChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setLogoFile(file); // Update the logo file state
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
      console.log("Images: " + companyDetails.mainCatalogue.images);
      let prevImagesLength = companyDetails.mainCatalogue.images.length;
      if (files.length + prevImagesLength > 4) {
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
      console.log("Videos: " + companyDetails.mainCatalogue.videos);
      let prevVideosLength = companyDetails.mainCatalogue.videos.length;
      if (files.length + prevVideosLength > 1) {
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
    <div className="mt-2" style={{ textAlign: "center" }}>
      <Button
        type="button"
        color="primaryPurple"
        className="waves-effect waves-light"
        onClick={handleSubmit}
      >
        Update Company
      </Button>
      <span className="ms-3"></span>
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
      {(!isLoaded || isSending) && (
        <div className="page-content">
          <div id="status">
            <div className="spinner">
              <i className="ri-loader-line spin-icon"></i>
            </div>
          </div>
        </div>
      )}
      {isLoaded && !isSending && (
        <div className="page-content">
          <Breadcrumbs
            title={"Update Company"}
            breadcrumbItems={[
              { title: "Companies", link: "/companies" },
              { title: "Update Company", link: "#" },
            ]}
          />
          <Container fluid>
            <MessageModal
              title={"Success!"}
              message={"Company was updated successfully."}
              isOpen={isMessageModalOpen}
              handleModalClose={handleFinish}
            />
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            {companyDetails && (
              <form ref={formRef}>
                <Card>
                  <CardBody>
                    <Row>
                      <div className="mb-3">
                        {companyLogo != null && logo == null ? (
                          <center>
                            <div className="mt-2">
                              <img
                                src={`${COMPANY_MEDIA_BASEURL}${companyLogo}`}
                                alt="Company Logo"
                                style={{
                                  maxHeight: "150px",
                                  maxWidth: "100%",
                                  borderRadius: "15px",
                                }}
                                onClick={() =>
                                  document.getElementById("logo").click()
                                }
                              />
                            </div>
                          </center>
                        ) : logo != null ? (
                          <center>
                            <div className="mt-2">
                              <img
                                src={logo}
                                alt="Company Logo"
                                style={{
                                  maxHeight: "150px",
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
                                  style={{
                                    maxHeight: "100px",
                                    maxWidth: "100%",
                                  }}
                                  onClick={() =>
                                    document.getElementById("logo").click()
                                  }
                                />
                              </div>
                            </div>
                          </center>
                        )}
                        {(logo !== null || companyLogo !== null) && (
                          <Col lg="12">
                            <div
                              className="mt-4"
                              style={{ textAlign: "center" }}
                            >
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
                                  if (logoFile) {
                                    document.getElementById("logo").value = "";
                                    setLogo(null);
                                    setLogoFile(null);
                                  } else {
                                    setCompanyLogo(null);
                                  }
                                }}
                              >
                                <i className="ri-delete-bin-fill"></i>
                                <span className="ms-1">Remove</span>
                              </Button>
                            </div>
                          </Col>
                        )}
                        <Label className="form-label" htmlFor="logo">
                          Change Logo
                        </Label>
                        <div className="mb-1">
                          <Input
                            type="file"
                            className="form-control"
                            id="logo"
                            name="logo"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleLogoChange}
                          />
                          <small className="form-text text-muted">
                            Allowed file extensions: .png, .jpg, .jpeg
                          </small>
                        </div>
                        <div className="file-display">
                          {logoFile ? (
                            <Label>Selected file: {logoFile.name}</Label>
                          ) : (
                            <Label>No file selected</Label>
                          )}
                        </div>
                      </div>
                      {/* <LogoComponent
                        baseUrl={COMPANYLOGOURL}
                        logo={logo}
                        oldUrl={companyLogo}
                        alt={"Company Logo"}
                        isUpdate={true}
                        handleRemove={() => {
                          if (logo) {
                            setLogo(null);
                          } else {
                            setCompanyLogo(null);
                          }
                        }}
                        onDropLogo={onDropLogo}
                      /> */}
                      <Col lg="6">
                        <InputField
                          id="companyName"
                          label="Company name"
                          defaultValue={formData.companyName}
                          invalid={formData.companyName === "" && validateForm}
                          required
                          onChange={handleInputChange}
                        />
                      </Col>
                      <Col lg="6">
                        <InputField
                          id="gstNo"
                          name="gstNo"
                          label="GST Number"
                          defaultValue={formData.gstNo}
                          required={false}
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
                          required
                          defaultValue={companyDetails.emailId}
                          disabled={true}
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
                            places.selectedCountry
                              ? {
                                  label: places.selectedCountry.name,
                                  value: places.selectedCountry._id,
                                }
                              : null
                          }
                          label="Country"
                          onChange={handleCountryChange}
                          options={places.countriesList.map((ele) => ({
                            label: ele.name,
                            value: ele._id,
                          }))}
                          required={true}
                          invalid={
                            places.selectedCountry == null && validateForm
                          }
                          placeholder="Select Country"
                          noOptionsMessage="No Countries"
                          classNamePrefix="select2-selection"
                        />
                      </Col>
                      <Col lg="4">
                        <InputDropDownField
                          selectedValue={
                            places.selectedState
                              ? {
                                  label: places.selectedState.name,
                                  value: places.selectedState._id,
                                }
                              : null
                          }
                          label="State"
                          onChange={handleStateChange}
                          options={places.statesList.map((ele) => ({
                            label: ele.name,
                            value: ele._id,
                          }))}
                          required={true}
                          invalid={places.selectedState == null && validateForm}
                          placeholder="Select State"
                          noOptionsMessage="No States"
                          classNamePrefix="select2-selection"
                        />
                      </Col>
                      <Col lg="4">
                        <InputDropDownField
                          selectedValue={
                            places.selectedCity
                              ? {
                                  label: places.selectedCity.name,
                                  value: places.selectedCity._id,
                                }
                              : null
                          }
                          label="City"
                          onChange={handleCityChange}
                          options={places.citiesList.map((ele) => ({
                            label: ele.name,
                            value: ele._id,
                          }))}
                          required={true}
                          invalid={places.selectedCity == null && validateForm}
                          placeholder="Select City"
                          noOptionsMessage="No Cities"
                          classNamePrefix="select2-selection"
                        />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <div>
                      <div className="mb-1">
                        <Row>
                          <Label
                            className="form-label font-size-20"
                            style={{ textAlign: "center" }}
                          >
                            <strong>MAIN CATALOGUE</strong>
                          </Label>
                        </Row>
                      </div>
                      <div className="mb-5">
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
                                    <strong>{`${companyDetails.companyName} - Main Catalogue`}</strong>
                                  </p>
                                  {pdfFile === null ? (
                                    <a
                                      href={`${COMPANY_MEDIA_BASEURL}${companyDetails.mainCatalogue.pdfLink}`}
                                      className="text-primary fw-bold text-decoration-none"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {"View PDF"}
                                    </a>
                                  ) : (
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
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                        <div className="mb-1">
                          <Label className="form-label" htmlFor="logo">
                            Change PDF
                          </Label>
                          <Input
                            type="file"
                            className="form-control"
                            id="pdfFile"
                            name="pdfFile"
                            accept="application/pdf"
                            onChange={handlePdfFileChange}
                          />
                        </div>
                      </div>
                      <ImageList
                        baseUrl={COMPANY_MEDIA_BASEURL}
                        imagesList={imagesList}
                        oldImages={companyDetails.mainCatalogue.images}
                        handleImageFilesChange={handleImageFilesChange}
                        handleImageDelete={handleImageDelete}
                        handleOldImageDelete={(value) => {
                          setCompanyDetails((prevCompanyDetails) => {
                            // Create a new object for mainCatalogue to avoid direct mutation
                            const newMainCatalogue = {
                              ...prevCompanyDetails.mainCatalogue,
                              images:
                                prevCompanyDetails.mainCatalogue.images.filter(
                                  (ele) => ele !== value
                                ),
                            };

                            // Return a new object for companyDetails to avoid direct mutation
                            return {
                              ...prevCompanyDetails,
                              mainCatalogue: newMainCatalogue,
                            };
                          });
                        }}
                      />
                      <VideoList
                        baseUrl={COMPANY_MEDIA_BASEURL}
                        videosList={videosList}
                        oldVideos={companyDetails.mainCatalogue.videos}
                        handleVideoFilesChange={handleVideoFilesChange}
                        handleVideoDelete={handleVideoDelete}
                        handleOldVideoDelete={(value) => {
                          setCompanyDetails((prevCompanyDetails) => {
                            // Create a new object for mainCatalogue to avoid direct mutation
                            const newMainCatalogue = {
                              ...prevCompanyDetails.mainCatalogue,
                              videos:
                                prevCompanyDetails.mainCatalogue.videos.filter(
                                  (ele) => ele.video !== value.video
                                ),
                            };

                            // Return a new object for companyDetails to avoid direct mutation
                            return {
                              ...prevCompanyDetails,
                              mainCatalogue: newMainCatalogue,
                            };
                          });
                        }}
                      />
                      {!isSending && actions}
                    </div>
                  </CardBody>
                </Card>
              </form>
            )}
          </Container>
        </div>
      )}
    </>
  );
}
