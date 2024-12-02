import { useCallback, useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/useHttp";
import {
  AGENTBASEURL,
  AGENTLOGOURL,
  APIRoutes,
  BASEURL,
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
import LogoComponent from "../../components/LogoComponent";
import InputField from "../../components/UI/InputField";
import InputDropDownField from "../../components/UI/InputDropDownField";
import { useSelector } from "react-redux";

const requestConfig = {
  method: "POST",
};

export default function UpdateAgentPage() {
  const navigate = useNavigate();
  const { agentId } = useParams(); // Extract agentId from the URL
  const [agentDetails, setAgentDetails] = useState(null); // State to store agent detailsx
  const [isLoaded, setIsLoaded] = useState(false);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });
  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";

  const mobileNumberPattern = /^\d{10}$/;
  const [formData, setFormData] = useState({
    agentName: "",
    firstName: "",
    lastName: "",
    gstNo: "",
    emailId: "",
    mobileNo: "",
    address: "",
    companyCanAddCount: "",
  });
  const [validateForm, setValidateForm] = useState(false);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [agentLogo, setAgentLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null); // State to store the logo file
  const [logo, setLogo] = useState(null); // State to store the logo file

  const onDropLogo = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoFile(file);
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const [countriesList, setCountryList] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const formRef = useRef(null);

  const [newCompanyCanAddCount, setNewCompanyCanAddCount] = useState(0);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
    clearError,
  } = useHttp(
    `${AGENTBASEURL}${APIRoutes.updateAgent}?id=${agentId}`,
    requestConfig
  );

  async function fetchCitiesList(stateId, agentDetails) {
    try {
      const response = await axios.get(
        `${BASEURL}${APIRoutes.getCitiesList}?state_id=${stateId}`
      );
      if (response.status === 200) {
        if (response.data.success === true) {
          setCitiesList((prevState) => response.data.cityList);
          let city = response.data.cityList.find(
            (value) => value.name === agentDetails.city
          );
          console.log(city);
          setSelectedCity((prev) => city);
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
          setStatesList((prevState) => response.data.statesList);
          let state = response.data.statesList.find(
            (value) => value.name === agentDetails.city
          );
          console.log(state);
          setSelectedState(state);
        }
      }
    } catch (error) {
      console.error("Failed to fetch states list:", error);
    }
  }

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

  useEffect(() => {
    // Fetch the agent details when the component mounts
    async function fetchAgentDetails() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getAgentDetails}?id=${agentId}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            setIsLoaded(true);
            setAgentDetails(response.data.agent);
            setFormData({
              agentName: response.data.agent.agentName,
              firstName: response.data.agent.firstName,
              lastName: response.data.agent.lastName,
              gstNo: response.data.agent.gstNo,
              mobileNo: response.data.agent.mobileNo,
              address: response.data.agent.address,
            });
            setAgentLogo(response.data.agent.logo);
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
    fetchCountriesList();
  }, [agentId]);

  async function handleSubmit() {
    setValidateForm(true); // Trigger validation on all fields

    let kCountry = countriesList.find(
      (value) => value.name === agentDetails.country
    );
    setSelectedCountry(kCountry);
    await fetchStatesList(kCountry.country_code);

    const { gstNo, ...restFormData } = formData; // Exclude gstNo from formData

    // Perform validation check
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
    console.log(formData);

    Object.keys(formData).forEach((key) => {
      fd.append(key, formData[key]);
    });

    fd.append("oldLogo", agentLogo);

    if (logoFile !== null) {
      fd.append("logo", logoFile);
    }

    let finalCompanyCount = parseInt(newCompanyCanAddCount);
    if (finalCompanyCount !== 0) {
      fd.append(
        "companyCanAddCount",
        agentDetails.companyCanAddCount + finalCompanyCount
      );
      fd.append("newCompanyCanAddCount", finalCompanyCount);
    } else {
      fd.append("companyCanAddCount", agentDetails.companyCanAddCount);
      fd.append("newCompanyCanAddCount", 0);
    }
    fd.append(
      "city",
      selectedCity !== null ? selectedCity.name : agentDetails.city
    );
    fd.append(
      "state",
      selectedState !== null ? selectedState.name : agentDetails.state
    );
    fd.append(
      "country",
      selectedCountry !== null ? selectedCountry.name : agentDetails.country
    );
    sendRequest(fd);
  }

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

  const handleInputChange = (e) => {
    console.log(e);
    if (e.target.name === "newCompanyCanAddCount") {
      setNewCompanyCanAddCount(e.target.value);
      return;
    }
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
        onClick={handleSubmit}
      >
        Update Agent
      </Button>
      <span className="ms-3"></span>
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
            title={"Update Agent"}
            breadcrumbItems={[
              { title: "Agents", link: "/agents" },
              { title: "Update Agent", link: "#" },
            ]}
          />
          <Container fluid>
            <MessageModal
              title={"Success!"}
              message={"Agent was updated successfully."}
              isOpen={isMessageModalOpen}
              handleModalClose={handleFinish}
            />
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            {agentDetails && (
              <Card>
                <CardBody>
                  <form ref={formRef} onSubmit={handleSubmit}>
                    <Row>
                      <div className="mb-3">
                        {agentLogo != null && logo == null ? (
                          <center>
                            <div className="mt-2">
                              <img
                                src={`${AGENTLOGOURL}${agentLogo}`}
                                alt="Agent Logo"
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
                                alt="Agent Logo"
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
                                  alt="Agent Logo"
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
                        {(logo !== null || agentLogo !== null) && (
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
                                    setAgentLogo(null);
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
                        baseUrl={AGENTLOGOURL}
                        logo={logo}
                        oldUrl={agentLogo}
                        alt={"Agent Logo"}
                        isUpdate={true}
                        handleRemove={() => {
                          if (logo) {
                            setLogo(null);
                          } else {
                            setAgentLogo(null);
                          }
                        }}
                        onDropLogo={onDropLogo}
                      /> */}
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
                          required
                          defaultValue={agentDetails.emailId}
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
                          defaultInputValue={agentDetails.country}
                          invalid={selectedCountry == null && validateForm}
                          placeholder="Select Country"
                          noOptionsMessage="No Countries"
                          classNamePrefix="select2-selection"
                        />
                      </Col>
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
                          defaultInputValue={agentDetails.state}
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
                          defaultInputValue={agentDetails.city}
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
                      <Label className="form-label">
                        Total number of available company
                      </Label>
                      <p
                        style={{
                          color: isDarkMode ? "#DADADA" : "black",
                        }}
                      >
                        {agentDetails.companyCanAddCount} +{" "}
                        {newCompanyCanAddCount} ={" "}
                        {agentDetails.companyCanAddCount +
                          parseInt(newCompanyCanAddCount)}
                      </p>
                    </div>
                    <InputField
                      id="newCompanyCanAddCount"
                      label="How many new companies can agent add ?"
                      type="number"
                      defaultValue={newCompanyCanAddCount}
                      value={formData.companyCanAddCount}
                      invalid={newCompanyCanAddCount === "" && validateForm}
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
                    {!isSending && actions}
                  </form>
                </CardBody>
              </Card>
            )}
          </Container>
        </div>
      )}
    </>
  );
}
