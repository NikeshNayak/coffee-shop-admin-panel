/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import {
  APIRoutes,
  BASEURL,
  formatToLocalTime,
} from "../../configs/globalConfig";
import { useCallback } from "react";
import PaginatedDataTable from "../../components/PaginatedDataTable";
import PageTitleWithButton from "../../components/PageTitleWithButton";
import { useNavigate } from "react-router-dom";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import { ButtonGroup, Card, CardBody, Col, Container, Row } from "reactstrap";
import { Button as RButton } from "reactstrap";
import ConfirmationModal from "../../components/UI/ConfirmationModal";
import DataTableSearchBar from "../../components/DataTableSearchBar";
import { Add, Clear, SaveAlt, Tune } from "@mui/icons-material";
import { Button } from "@mui/material";
import TitleWithButton from "../../components/TitleWithButton";

function ReportsPage() {
  const navigate = useNavigate();

  const [range, setRange] = useState("1M"); // Add state to track the selected range

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: "",
  });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [items, setItems] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [countriesList, setCountryList] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [sortModel, setSortModel] = useState([
    { field: null, sort: null }, // Default sort (column: updatedAt, direction: desc)
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    country: "",
    addedById: "",
    createdAt: "",
    updatedAt: "",
    renewDate: "",
    expiredAt: "",
  });

  async function fetchAllAgentsList() {
    try {
      const response = await axios.get(
        `${BASEURL}${APIRoutes.getAllAgentsList}`
      );
      if (response.status === 200) {
        console.log(response.data);
        if (response.data.success === true) {
          setAgentList((prevState) => response.data.agentsList);
        }
      }
    } catch (error) {
      console.error("Failed to fetch agents list:", error);
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
    fetchCountriesList();
    fetchAllAgentsList();
  }, []);

  const buildFilterParams = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "") {
        params.append(key, value);
      }
    });
    return params.toString();
  };

  const fetchData = useCallback(async function fetchData(
    page,
    pageSize,
    query,
    filters,
    sortConfig
  ) {
    try {
      const filterParams = buildFilterParams(filters);
      const searchParams = query !== "" ? `&search=${query.trim()}` : "";
      const sortField = sortConfig[0]?.field || ""; // Default sort field
      const sortDirection = sortConfig[0]?.sort || ""; // Default sort direction
      const sortParams =
        sortField !== "" && sortDirection !== ""
          ? `&sortField=${sortField}&sortDirection=${sortDirection}`
          : "";
      console.log(filters);
      const endpoint = `${BASEURL}${
        APIRoutes.getCompaniesList
      }?page=${page}&limit=${pageSize}${searchParams}${
        filterParams !== "" ? `&${filterParams}` : ""
      }${sortParams}`;
      console.log(endpoint);
      const response = await axios.get(endpoint);
      const companyList = response.data.companiesList.map((item, index) => ({
        ...item,
        id: (page - 1) * pageSize + (index + 1),
        companyPersonName: `${item.firstName} ${item.lastName}`,
      }));
      setIsLoaded(true);
      setItems(companyList);
      setTotalRows(response.data.totalRowsCount || 0);
      console.log("totalRowsCount" + response.data.totalRowsCount);
    } catch (error) {
      console.error(error);
      setIsLoaded(true);
      setError(error);
    }
  },
  []);

  const renewCompanyRequest = useCallback(
    async function renewCompanyRequest(id) {
      try {
        const url = `${BASEURL}${APIRoutes.renewSubcription}?companyId=${id}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          if (response.data.success === true) {
            setSnackMsg({
              isOpen: true,
              isSuccess: true,
              message: response.data.message,
            });
            fetchData(
              paginationModel.page + 1,
              paginationModel.pageSize,
              searchQuery,
              filters,
              sortModel
            );
          } else {
            setSnackMsg({
              isOpen: true,
              isSuccess: false,
              message: response.data.message,
            });
          }
        }
      } catch (error) {
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      }
    },
    [fetchData, paginationModel, searchQuery, filters, sortModel]
  );

  const deleteCompanyRequest = useCallback(
    async function deleteCompanyRequest(id) {
      try {
        const url = `${BASEURL}${APIRoutes.deleteCompany}?id=${id}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          if (response.data.success === true) {
            setSnackMsg({
              isOpen: true,
              isSuccess: true,
              message: response.data.message,
            });
            fetchData(
              paginationModel.page + 1,
              paginationModel.pageSize,
              searchQuery,
              filters,
              sortModel
            );
          } else {
            setSnackMsg({
              isOpen: true,
              isSuccess: false,
              message: response.data.message,
            });
          }
        }
      } catch (error) {
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      }
    },
    [fetchData, paginationModel, searchQuery, filters, sortModel]
  );

  const enabledisableCompanyRequest = useCallback(
    async function enabledisableAgentRequest(id, action) {
      try {
        const url = `${BASEURL}${APIRoutes.enabledisableCompany}?id=${id}&action=${action}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          if (response.data.success === true) {
            setSnackMsg({
              isOpen: true,
              isSuccess: true,
              message: response.data.message,
            });
            fetchData(
              paginationModel.page + 1,
              paginationModel.pageSize,
              searchQuery,
              filters,
              sortModel
            );
          } else {
            setSnackMsg({
              isOpen: true,
              isSuccess: false,
              message: response.data.message,
            });
          }
        }
      } catch (error) {
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      }
    },
    [fetchData, paginationModel, searchQuery, filters, sortModel]
  );

  useEffect(() => {
    fetchData(
      paginationModel.page + 1,
      paginationModel.pageSize,
      searchQuery,
      filters,
      sortModel
    );
  }, [paginationModel, fetchData, searchQuery, filters, sortModel]);

  const handleSort = (field) => {
    let sort = "asc"; // default sorting direction

    // Toggle sorting direction if the same field is clicked again
    if (sortModel[0]?.field === field && sortModel[0]?.sort === "asc") {
      sort = "desc";
    }

    setSortModel([{ field, sort }]);

    // Fetch sorted data from the API with sorting params
    fetchData(
      paginationModel.page + 1,
      paginationModel.pageSize,
      searchQuery,
      filters,
      sortModel
    );
  };

  const handleView = (row) => {
    console.log("View:", row);
    navigate(`/view-company/${row._id}`);
  };

  const handleEdit = (row) => {
    console.log("Edit:", row);
    navigate(`/edit-company/${row._id}`);
  };

  const handleEnableDisable = (row) => {
    console.log("Disable:", row);
    setSelectedCompany(row);
    if (row.isDisable === false) {
      setActionModal((prevState) => {
        return {
          isOpen: true,
          title: "Disable Company",
          message: "Do you really want to disable this company ?",
          action: "DISABLE",
        };
      });
    } else {
      setActionModal((prevState) => {
        return {
          isOpen: true,
          title: "Enable Company",
          message: "Do you really want to enable this company ?",
          action: "ENABLE",
        };
      });
    }
  };

  const handleRenew = (row) => {
    console.log("Renew:", row);
    setSelectedCompany(row);
    setActionModal((prevState) => {
      return {
        isOpen: true,
        title: "Renew Subcription",
        message: "Do you really want to renew subcription of this company ?",
        action: "RENEW",
      };
    });
  };

  const handleDelete = (row) => {
    console.log("Delete:", row);
    setSelectedCompany(row);
    setActionModal((prevState) => {
      return {
        isOpen: true,
        title: "Delete Company",
        message: "Do you really want to delete this company ?",
        action: "DELETE",
      };
    });
  };

  const handleCreateNewCompany = () => {
    console.log("Create New Company");
    navigate("/add-new-company");
  };

  const handleActionModalClose = (option) => {
    if (option === true) {
      if (actionModal.action === "DELETE") {
        deleteCompanyRequest(selectedCompany._id);
      } else if (actionModal.action === "DISABLE") {
        enabledisableCompanyRequest(selectedCompany._id, actionModal.action);
      } else if (actionModal.action === "ENABLE") {
        enabledisableCompanyRequest(selectedCompany._id, actionModal.action);
      } else if (actionModal.action === "RENEW") {
        renewCompanyRequest(selectedCompany._id);
      }
      setSelectedCompany(null);
      setActionModal((prevState) => {
        return {
          isOpen: false,
          title: "",
          message: "",
          action: "",
        };
      });
    } else {
      setActionModal({
        isOpen: false,
        title: "",
        message: "",
        action: "",
      });
      setSelectedCompany(null);
    }
  };

  // Function to export the current company list to Excel
  const exportCompaniesToExcel = async () => {
    const filterParams = buildFilterParams(filters);
    const searchParams =
      searchQuery !== "" ? `&search=${searchQuery.trim()}` : "";
    console.log(filters);
    const sortField = sortModel[0]?.field || ""; // Default sort field
    const sortDirection = sortModel[0]?.sort || ""; // Default sort direction
    const sortParams =
      sortField !== "" && sortDirection !== ""
        ? `&sortField=${sortField}&sortDirection=${sortDirection}`
        : "";
    const endpoint = `${BASEURL}${
      APIRoutes.getCompaniesExcelExport
    }?${searchParams}${
      filterParams !== "" ? `&${filterParams}` : ""
    }${sortParams}`;
    console.log(endpoint);
    const response = await axios.get(endpoint);
    const companyList = response.data.companiesList.map((item, index) => ({
      ...item,
      id: index + 1,
      companyPersonName: `${item.firstName} ${item.lastName}`,
    }));
    const ws = XLSX.utils.json_to_sheet(
      companyList.map((item) => ({
        "No.": item.id,
        "Company Name": item.companyName,
        "Person Name": item.companyPersonName,
        "GST Number": item.gstNo,
        "Email Id": item.emailId,
        "Mobile No.": item.mobileNo,
        Address: item.address,
        City: item.city,
        State: item.state,
        Country: item.country,
        "Product Key": item.productKey,
        "Added By": item.addedByName,
        "Registration Date": formatToLocalTime(item.createdAt),
        "Subcription Renew Date": formatToLocalTime(item.renewDate),
        "Subcription Expired Date": formatToLocalTime(item.expiredAt),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Companies");

    var currentDate = formatToLocalTime(new Date());
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `Companies_last_${range}_reports_${currentDate}.xlsx`);
  };

  // Function to export the current company list to Excel
  const exportAgentsToExcel = async () => {
    const filterParams = buildFilterParams(filters);
    const searchParams = searchQuery !== "" ? `&search=${searchQuery}` : "";
    const endpoint = `${BASEURL}${
      APIRoutes.getAgentsExcelReport
    }${searchParams}${filterParams !== "" ? `&${filterParams}` : ""}`;
    const response = await axios.get(endpoint);
    const agentList = response.data.agentsList.map((item, index) => ({
      ...item,
      id: index + 1,
      agentContactPerson: `${item.firstName} ${item.lastName}`,
    }));

    const ws = XLSX.utils.json_to_sheet(
      agentList.map((item) => ({
        "No.": item.id,
        "Agent Name": item.agentName,
        "Contact Person": item.agentContactPerson,
        "GST Number": item.gstNo !== "" ? item.gstNo : "-",
        "Email Id": item.emailId,
        "Mobile No.": item.mobileNo,
        Address: item.address,
        City: item.city,
        State: item.state,
        Country: item.country,
        "Total Company": item.totalCompany,
        "Company Can Add": item.companyCanAddCount,
        "Company Added": item.companyAddedCount,
        "Created Date": formatToLocalTime(item.createdAt),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agents");

    var currentDate = formatToLocalTime(new Date());
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `Agents_last_${range}_reports_${currentDate}.xlsx`);
  };

  // Handle button click to change range
  const handleRangeChange = (event) => {
    setRange(event.target.value); // Update range state
  };

  if (error) {
    return <div className="page-content">Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <div className="page-content">
        <div id="status">
          <div className="spinner">
            <i className="ri-loader-line spin-icon"></i>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="page-content">
        <Container fluid>
          <ConfirmationModal
            title={actionModal.title}
            message={actionModal.message}
            isOpen={actionModal.isOpen}
            handleActionModalClose={handleActionModalClose}
          />
          <CustomSnackBar snackBarMsg={snackBarMsg} setSnackMsg={setSnackMsg} />
          <Card>
            <CardBody>
              <TitleWithButton
                title="COMPANY REPORTS"
                label="Export Excel"
                startIcon={<SaveAlt height={"5px"} />}
                onButtonClick={() => {
                  exportCompaniesToExcel();
                }}
              />
              <div className="float-end d-none d-md-inline-block mt-3">
                <ButtonGroup className="mb-2">
                  <RButton
                    size="sm"
                    active={range === "7D"}
                    color="light"
                    onClick={() => handleRangeChange("7D")}
                  >
                    7D
                  </RButton>
                  <RButton
                    size="sm"
                    active={range === "1M"}
                    color="light"
                    onClick={() => handleRangeChange("1M")}
                  >
                    1M
                  </RButton>
                  <RButton
                    size="sm"
                    active={range === "3M"}
                    color="light"
                    onClick={() => handleRangeChange("3M")}
                  >
                    3M
                  </RButton>
                  <RButton
                    size="sm"
                    active={range === "6M"}
                    color="light"
                    onClick={() => handleRangeChange("6M")}
                  >
                    6M
                  </RButton>
                  <RButton
                    size="sm"
                    active={range === "1Y"}
                    color="light"
                    onClick={() => handleRangeChange("1Y")}
                  >
                    1Y
                  </RButton>
                </ButtonGroup>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <TitleWithButton
                title="AGENT REPORTS"
                label="Export Excel"
                startIcon={<SaveAlt height={"5px"} />}
                onButtonClick={() => {
                  exportAgentsToExcel();
                }}
              />
              <div className="float-end d-none d-md-inline-block mt-3">
                <ButtonGroup className="mb-2">
                  <RButton
                    size="sm"
                    active={range === "7D"}
                    color="light"
                    onClick={() => handleRangeChange("7D")}
                  >
                    7D
                  </RButton>
                  <RButton
                    size="sm"
                    active={range === "1M"}
                    color="light"
                    onClick={() => handleRangeChange("1M")}
                  >
                    1M
                  </RButton>
                  <RButton
                    size="sm"
                    active={range === "3M"}
                    color="light"
                    onClick={() => handleRangeChange("3M")}
                  >
                    3M
                  </RButton>
                  <RButton
                    size="sm"
                    active={range === "6M"}
                    color="light"
                    onClick={() => handleRangeChange("6M")}
                  >
                    6M
                  </RButton>
                  <RButton
                    size="sm"
                    active={range === "1Y"}
                    color="light"
                    onClick={() => handleRangeChange("1Y")}
                  >
                    1Y
                  </RButton>
                </ButtonGroup>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}

export default ReportsPage;
