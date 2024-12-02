import React, { useState } from "react";
import axios from "axios";

import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import MaterialUIButton from "../../components/UI/MaterialUIButton";
import {
  APIRoutes,
  BASEURL,
  formatDateToDMY,
} from "../../configs/globalConfig";
import Select from "react-select";
import DateRangePicker from "../../components/DateRangePicker";

const CompanyFilterDialog = ({
  title,
  isOpen,
  selectedFilter,
  setOpenFilter,
  countriesList,
  agentList,
  handleApplyFilters,
  handleClearFilters,
}) => {
  const [filters, setFilters] = useState(selectedFilter);

  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const [statesList, setStatesList] = useState([]);
  const [selectedState, setSelectedState] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState(null);

  const [selectedAgent, setSelectedAgent] = useState(null);

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
      console.error("Failed to fetch states list :", error);
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

  const handleInputChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleAgentChange = async (selectedOption) => {
    if (selectedOption === null) {
      console.log("Select cleared");
      return;
    }
    console.log(selectedOption);
    const selected = agentList.find((ele) => ele._id === selectedOption.value);
    console.log(selected);
    setSelectedAgent((prevState) => selected);
    setFilters({
      ...filters,
      addedById: selected._id,
    });
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
    setFilters({
      ...filters,
      country: selected.name,
    });
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
    setFilters({
      ...filters,
      state: selected.name,
    });
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
    setFilters({
      ...filters,
      city: selected.name,
    });
  };

  const handleDateRangeChange = (startDate, endDate, name) => {
    // Perform your filter logic here
    console.log("Selected start date:", startDate);
    console.log("Selected end date:", endDate);
    if (startDate == null || endDate == null) {
      setFilters({ ...filters, [name]: ``});
      return;
    }

    var startFinalDate = formatDateToDMY(startDate);
    var endFinalDate = formatDateToDMY(endDate);

    console.log("Formated Selected start date:", startFinalDate);
    console.log("Formated Selected end date:", endFinalDate);
    setFilters({
      ...filters,
      [name]: `${startFinalDate},${endFinalDate}`,
    });
  };

  // // Custom styles for react-select
  // const customStyles = {
  //   control: (provided, state) => ({
  //     ...provided,
  //     borderColor: state.isFocused ? "#2684FF" : provided.borderColor,
  //     "&:hover": {
  //       borderColor: state.isFocused ? "#2684FF" : provided.borderColor,
  //     },
  //   }),
  //   option: (provided, state) => ({
  //     ...provided,
  //     backgroundColor: state.isSelected
  //       ? "#2684FF"
  //       : state.isFocused
  //       ? "#e0e0e0"
  //       : undefined,
  //     color: state.isSelected ? "#ffffff" : "#000000",
  //     "&:hover": {
  //       backgroundColor: "#e0e0e0",
  //     },
  //   }),
  // };

  return (
    <Modal
      isOpen={isOpen}
      centered={true}
      toggle={() => {
        setSelectedAgent(null);
        setStatesList([]);
        setCitiesList([]);
        setSelectedCity(null);
        setSelectedState(null);
        setSelectedCountry(null);
        setOpenFilter(!isOpen);
      }}
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <div>
          <form>
            <div className="mb-4">
              <Label className="form-label">Agents</Label>
              <Select
                value={
                  selectedAgent
                    ? {
                        label: selectedAgent.agentName,
                        value: selectedAgent._id,
                      }
                    : null
                }
                onChange={handleAgentChange}
                options={agentList.map((ele) => ({
                  label: ele.agentName,
                  value: ele._id,
                }))}
                placeholder="Select Agent"
                noOptionsMessage={() => "No Agents"}
                classNamePrefix="select2-selection"
                // styles={customStyles}
              />
            </div>
            <div className="mb-3">
              <Label className="form-label">Country</Label>
              <Select
                value={
                  selectedCountry
                    ? {
                        label: selectedCountry.name,
                        value: selectedCountry._id,
                      }
                    : null
                }
                onChange={handleCountryChange}
                options={countriesList.map((ele) => ({
                  label: ele.name,
                  value: ele._id,
                }))}
                placeholder="Select Country"
                noOptionsMessage={() => "No Countires"}
                classNamePrefix="select2-selection"
                // styles={customStyles}
              />
            </div>
            <div className="mb-3">
              <Label className="form-label">State</Label>
              <Select
                value={
                  selectedState
                    ? {
                        label: selectedState.name,
                        value: selectedState._id,
                      }
                    : null
                }
                onChange={handleStateChange}
                options={statesList.map((ele) => ({
                  label: ele.name,
                  value: ele._id,
                }))}
                placeholder="Select State"
                noOptionsMessage={() => "No States"}
                classNamePrefix="select2-selection"
                // styles={customStyles}
              />
            </div>
            <div className="mb-3">
              <Label className="form-label">City</Label>
              <Select
                value={
                  selectedCity
                    ? {
                        label: selectedCity.name,
                        value: selectedCity._id,
                      }
                    : null
                }
                onChange={handleCityChange}
                options={citiesList.map((ele) => ({
                  label: ele.name,
                  value: ele._id,
                }))}
                placeholder="Select City"
                noOptionsMessage={() => "No Cities"}
                classNamePrefix="select2-selection"
              />
            </div>
            <div className="mb-3">
              <Label className="form-label" htmlFor="createdAt">
                Created Date
              </Label>
              <DateRangePicker
                sDate={
                  filters.createdAt.length > 0
                    ? new Date(filters.createdAt.split(",")[0])
                    : null
                }
                eDate={
                  filters.createdAt.length > 0
                    ? new Date(filters.createdAt.split(",")[1])
                    : null
                }
                onDateRangeChange={(startDate, endDate) => {
                  handleDateRangeChange(startDate, endDate, "createdAt");
                }}
              />
            </div>
            <div className="mb-3">
              <Label className="form-label" htmlFor="updatedAt">
                Updated Date
              </Label>
              <DateRangePicker
                sDate={
                  filters.updatedAt.length > 0
                    ? new Date(filters.updatedAt.split(",")[0])
                    : null
                }
                eDate={
                  filters.updatedAt.length > 0
                    ? new Date(filters.updatedAt.split(",")[1])
                    : null
                }
                onDateRangeChange={(startDate, endDate) => {
                  handleDateRangeChange(startDate, endDate, "updatedAt");
                }}
              />
            </div>
            <div className="mb-3">
              <Label className="form-label" htmlFor="renewDate">
                Subcription Renew Date
              </Label>
              <DateRangePicker
                sDate={
                  filters.renewDate.length > 0
                    ? new Date(filters.renewDate.split(",")[0])
                    : null
                }
                eDate={
                  filters.renewDate.length > 0
                    ? new Date(filters.renewDate.split(",")[1])
                    : null
                }
                onDateRangeChange={(startDate, endDate) => {
                  handleDateRangeChange(startDate, endDate, "renewDate");
                }}
              />
            </div>
            <div className="mb-3">
              <Label className="form-label" htmlFor="expiredAt">
                Subcription Expiry Date
              </Label>
              <DateRangePicker
                sDate={
                  filters.expiredAt.length > 0
                    ? new Date(filters.expiredAt.split(",")[0])
                    : null
                }
                eDate={
                  filters.expiredAt.length > 0
                    ? new Date(filters.expiredAt.split(",")[1])
                    : null
                }
                onDateRangeChange={(startDate, endDate) => {
                  handleDateRangeChange(startDate, endDate, "expiredAt");
                }}
              />
            </div>
          </form>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          type="button"
          style={{
            borderRadius: "38px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
          onClick={() => {
            setStatesList([]);
            setCitiesList([]);
            setSelectedCity(null);
            setSelectedState(null);
            setSelectedAgent(null);
            setFilters({
              city: "",
              state: "",
              country: "",
              addedById: "",
              createdAt: "",
              updatedAt: "",
              renewDate: "",
              expiredAt: "",
            });
            handleClearFilters();
          }}
          color="secondary"
        >
          Clear
        </Button>
        <span className="ms-1"></span>
        <MaterialUIButton
          label={"Apply"}
          borderRadius="38px"
          onButtonClick={() => handleApplyFilters(filters)}
        />
      </ModalFooter>
    </Modal>
  );
};

export default CompanyFilterDialog;
