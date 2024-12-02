import { useCallback, useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/useHttp";
import { AGENTBASEURL, APIRoutes, BASEURL } from "../../configs/globalConfig";
import { useNavigate } from "react-router-dom";
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
import Select from "react-select";
import LogoComponent from "../../components/LogoComponent";
import InputField from "../../components/UI/InputField";
import InputDropDownField from "../../components/UI/InputDropDownField";

const requestConfig = {
  method: "POST",
};

export default function AddAgentPage() {
  const navigate = useNavigate();
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileNumberPattern = /^\d{10}$/;

  const [formData, setFormData] = useState({
    agentName: "",
    firstName: "",
    lastName: "",
    gstNo: "",
    emailId: "",
    mobileNo: "",
    address: "",
    country: "India",
    companyCanAddCount: "",
  });
  const [validateForm, setValidateForm] = useState(false);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [agentLogo, setAgentLogo] = useState(null);
  const [agentLogoFile, setAgentLogoFile] = useState(null);

  const onDropLogo = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAgentLogoFile(file);
        setAgentLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const formRef = useRef(null);

  const [countriesList, setCountryList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

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
      console.error("Failed to fetch company details:", error);
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
      console.error("Failed to fetch company details:", error);
    }
  }

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
    clearError,
  } = useHttp(`${AGENTBASEURL}${APIRoutes.addAgent}`, requestConfig);

  useEffect(() => {
    fetchCountriesList();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAgentLogo(reader.result);
        setAgentLogoFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

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

    if (!emailRegex.test(formData.emailId)) {
      return;
    }

    const fd = new FormData();
    // Append form data fields
    Object.keys(formData).forEach((key) => {
      fd.append(key, formData[key]);
    });
    if (agentLogoFile !== null) {
      fd.append("logo", agentLogoFile);
    }
    // const keysData = Object.fromEntries(fd.entries());
    // console.log(keysData);
    fd.append("city", selectedCity.name);
    fd.append("state", selectedState.name);
    sendRequest(fd);
  }

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
    setSelectedCity(null);
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

  function handleFinish() {
    setIsMessageModalOpen(false);
    clearData();
    if (formRef.current) {
      formRef.current.reset();
    }
    navigate("/agents");
  }

  let actions = (
    <div className="mt-2" style={{ textAlign: "center" }}>
      <Button
        type="button"
        color="primaryPurple"
        className="waves-effect waves-light"
        onClick={() => {
          handleSubmit();
        }}
      >
        Add Agent
      </Button>
      <span className="ms-2"></span>
      <Button
        type="button"
        onClick={() => {
          navigate("/agents");
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
            title={"Add New Agent"}
            breadcrumbItems={[
              { title: "Agents", link: "/agents" },
              { title: "Add Agent", link: "#" },
            ]}
          />
          <Container fluid>
            <MessageModal
              title={"Success!"}
              message={"Agent was added successfully."}
              isOpen={isMessageModalOpen}
              handleModalClose={handleFinish}
            />
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            <Card>
              <CardBody>
                <form ref={formRef}>
                  <Row>
                    <div className="mb-3">
                      {agentLogo !== null ? (
                        <center>
                          <div className="mt-2">
                            <img
                              src={agentLogo}
                              alt="Agent Logo"
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
                                alt="Agent Logo"
                                style={{ maxHeight: "100px", maxWidth: "100%" }}
                                onClick={() =>
                                  document.getElementById("logo").click()
                                }
                              />
                            </div>
                          </div>
                        </center>
                      )}
                      {agentLogo !== null && (
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
                                setAgentLogo(null);
                                setAgentLogoFile(null);
                              }}
                            >
                              <i className="ri-delete-bin-fill"></i>
                              <span className="ms-1">Remove</span>
                            </Button>
                          </div>
                        </Col>
                      )}
                      <Label className="form-label" htmlFor="logo">
                        Agent Logo
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
                        {agentLogoFile ? (
                          <Label>Selected file: {agentLogoFile.name}</Label>
                        ) : (
                          <Label>No file selected</Label>
                        )}
                      </div>
                    </div>
                    <Col lg="6">
                      <InputField
                        id="agentName"
                        label="Agent name"
                        defaultValue={formData.agentName}
                        invalid={formData.agentName === "" && validateForm}
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
                  <Col>
                    <InputField
                      id="companyCanAddCount"
                      label="How many company can agent add? "
                      type="number"
                      defaultValue={formData.companyCanAddCount}
                      value={formData.companyCanAddCount}
                      invalid={
                        formData.companyCanAddCount === "" && validateForm
                      }
                      required
                      min="0"
                      max="1000"
                      onInput={(e) => {
                        // Remove decimal points and non-numeric characters
                        e.target.value = e.target.value.replace(/\D/g, "");

                        // Ensure the value is within the range [0, max]
                        const maxValue = 1000; // Set your maximum limit here
                        const value =
                          e.target.value !== ""
                            ? Math.min(
                                Math.abs(parseInt(e.target.value, 10)),
                                maxValue
                              )
                            : null;

                        e.target.value = value; // Set the input's value to the cleaned-up value
                        handleInputChange(e); // Update state or call a handler to set the value
                      }}
                    />
                  </Col>
                  {!isSending && <p>{actions}</p>}
                </form>
              </CardBody>
            </Card>
          </Container>
        </div>
      )}
    </>
  );
}
