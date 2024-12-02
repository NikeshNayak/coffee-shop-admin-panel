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

const KeysFilterDialog = ({
  title,
  isOpen,
  selectedFilter,
  setOpenFilter,
  agentList,
  handleApplyFilters,
  handleClearFilters,
  tabValue,
}) => {
  const [filters, setFilters] = useState(selectedFilter);

  const [selectedAgent, setSelectedAgent] = useState(null);

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
              <Label className="form-label" htmlFor="usedAt">
                Used At
              </Label>
              <DateRangePicker
                sDate={
                  filters.usedAt.length > 0
                    ? new Date(filters.usedAt.split(",")[0])
                    : null
                }
                eDate={
                  filters.usedAt.length > 0
                    ? new Date(filters.usedAt.split(",")[1])
                    : null
                }
                onDateRangeChange={(startDate, endDate) => {
                  handleDateRangeChange(startDate, endDate, "usedAt");
                }}
              />
            </div>
            {(tabValue === 0) && (
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
            )}
            {(tabValue === 0) && (
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
            )}
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
            setSelectedAgent(null);
            setFilters({
              addedById: "",
              usedAt: "",
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

export default KeysFilterDialog;
