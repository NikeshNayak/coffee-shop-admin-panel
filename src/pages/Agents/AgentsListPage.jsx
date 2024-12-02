/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import {
  APIRoutes,
  BASEURL,
  formatToLocalTime,
} from "../../configs/globalConfig";
import { useCallback } from "react";
import PaginatedDataTable from "../../components/PaginatedDataTable";
import PageTitleWithButton from "../../components/PageTitleWithButton";
import { Link, useNavigate } from "react-router-dom";
import UIButton from "../../components/UI/UIButton";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import { Card, CardBody, Col, Container, Form, Input, Row } from "reactstrap";
import ConfirmationModal from "../../components/UI/ConfirmationModal";
import Select from "react-select";
import DataTableSearchBar from "../../components/DataTableSearchBar";
import { Clear, SaveAlt, Tune } from "@mui/icons-material";
import AgentFilterDialog from "./AgentFilterDialog";
import { useSelector } from "react-redux";

export default function AgentsListPage() {
  const navigate = useNavigate();

  const { staffDetails } = useSelector((state) => state.staffDetails);

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: "",
  });
  const [selectedAgent, setSelectedAgent] = useState(null);
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
    createdAt: "",
  });

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
  }, []);

  const hasPermission = (permissionAlias) =>
    staffDetails?.permissions?.some(
      (perm) => perm.permissionAlias === permissionAlias
    ) || false;

  const buildFilterParams = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "") {
        params.append(key, value);
      }
    });
    return params.toString();
  };

  const fetchData = useCallback(
    async (page, pageSize, query, filters, sortConfig) => {
      try {
        const filterParams = buildFilterParams(filters);
        const searchParams = query !== "" ? `&search=${query.trim()}` : "";
        const sortField = sortConfig[0]?.field || ""; // Default sort field
        const sortDirection = sortConfig[0]?.sort || ""; // Default sort direction
        const sortParams =
          sortField !== "" && sortDirection !== ""
            ? `&sortField=${sortField}&sortDirection=${sortDirection}`
            : "";
        const endpoint = `${BASEURL}${APIRoutes.getAgentsList}?page=${page}&limit=${pageSize}${searchParams}${sortParams}&${filterParams}`;
        const response = await axios.get(endpoint);

        const agentList = response.data.agentsList.map((item, index) => ({
          ...item,
          id: (page - 1) * pageSize + (index + 1),
          agentContactPerson: `${item.firstName} ${item.lastName}`,
        }));
        setIsLoaded(true);
        setItems(agentList);
        setTotalRows(response.data.totalRowsCount || 0);
      } catch (error) {
        setIsLoaded(true);
        setError(error);
      }
    },
    []
  );

  const deleteAgentRequest = useCallback(
    async function deleteAgentRequest(id) {
      try {
        const url = `${BASEURL}${APIRoutes.deleteAgent}?id=${id}`;
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

  const enabledisableAgentRequest = useCallback(
    async function enabledisableAgentRequest(id, action) {
      try {
        const url = `${BASEURL}${APIRoutes.enabledisableAgent}?id=${id}&action=${action}`;
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
    navigate(`/view-agent/${row._id}`);
  };

  const handleEdit = (row) => {
    console.log("Edit:", row);
    navigate(`/edit-agent/${row._id}`);
  };

  const handleEnableDisable = (row) => {
    console.log("Disable:", row);
    setSelectedAgent(row);
    if (row.isDisable === false) {
      setActionModal((prevState) => {
        return {
          isOpen: true,
          title: "Disable Agent",
          message: "Do you really want to disable this agent ?",
          action: "DISABLE",
        };
      });
    } else {
      setActionModal((prevState) => {
        return {
          isOpen: true,
          title: "Enable Agent",
          message: "Do you really want to enable this agent ?",
          action: "ENABLE",
        };
      });
    }
  };

  const handleDelete = (row) => {
    console.log("Delete:", row);
    setSelectedAgent(row);
    setActionModal((prevState) => {
      return {
        isOpen: true,
        title: "Delete Agent",
        message: "Do you really want to delete this agent ?",
        action: "DELETE",
      };
    });
  };

  const handleAddNewAgent = () => {
    if (hasPermission("add-agent") || staffDetails?.userType === "SUPERADMIN") {
      console.log("Add New Agent");
      navigate("/add-new-agent");
    } else {
      alert("You do not have permission to add an agent.");
    }
  };

  const handleActionModalClose = (option) => {
    if (option === true) {
      if (actionModal.action === "DELETE") {
        deleteAgentRequest(selectedAgent._id);
      } else if (actionModal.action === "DISABLE") {
        enabledisableAgentRequest(selectedAgent._id, actionModal.action);
      } else if (actionModal.action === "ENABLE") {
        enabledisableAgentRequest(selectedAgent._id, actionModal.action);
      }
      setSelectedAgent(null);
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
      setSelectedAgent(null);
    }
  };

  // Function to export the current company list to Excel
  const exportToExcel = async () => {
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
    XLSX.writeFile(wb, `Agents_${currentDate}.xlsx`);
  };

  let columns = [
    {
      field: "id",
      headerName: "No.",
      flex: 1.25,
      disableColumnMenu: true,
      sortable: false,
      pinned: true,
    },
    {
      field: "agentName",
      headerName: "Agent Name",
      flex: 1.8,
      disableColumnMenu: true,
      pinned: true,
      onHeaderClick: () => handleSort("agentName"),
    },
    {
      field: "agentContactPerson",
      headerName: "Contact Person",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "mobileNo",
      headerName: "Mobile No.",
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "totalCompany",
      headerName: "Added",
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) =>
        parseInt(params.row.companyCanAddCount) +
        parseInt(params.row.companyAddedCount),
    },
    {
      field: "companyCanAddCount",
      headerName: "Can Add",
      flex: 1.4,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "companyAddedCount",
      headerName: "Added",
      flex: 1.1,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 1.5,
      sortable: true,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("createdAt"), // Trigger sorting when header is clicked
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2.5,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => (
        <div>
          {(hasPermission("edit-agent") ||
              staffDetails?.userType === "SUPERADMIN")&& (
            <>
              <a
                href="#"
                onClick={() => handleEdit(params.row)}
                className="text-info"
              >
                <i className="mdi mdi-pencil font-size-22"></i>
              </a>
              <span className="ms-3"></span>
            </>
          )}
          {(hasPermission("view-agent") ||
              staffDetails?.userType === "SUPERADMIN") && (
            <>
              <a
                href="#"
                onClick={() => handleView(params.row)}
                className="text-success"
              >
                <i className={"mdi mdi-eye font-size-22"}></i>
              </a>
              <span className="ms-3"></span>
            </>
          )}
          {(hasPermission("enabledisable-agent") ||
              staffDetails?.userType === "SUPERADMIN") && (
            <>
              <a
                href="#"
                onClick={() => handleEnableDisable(params.row)}
                className={
                  params.row.isDisable === true
                    ? "text-secondary"
                    : "text-orange"
                }
              >
                <i
                  className={
                    params.row.isDisable === true
                      ? "ri-toggle-line font-size-22"
                      : "ri-toggle-fill font-size-22"
                  }
                ></i>
              </a>
              <span className="ms-3"></span>
            </>
          )}
          {(hasPermission("delete-agent") ||
              staffDetails?.userType === "SUPERADMIN") && (
            <a
              href="#"
              onClick={() => handleDelete(params.row)}
              className="text-danger"
            >
              <i className="mdi mdi-trash-can font-size-22"></i>
            </a>
          )}
        </div>
      ),
    },
  ];

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
          <AgentFilterDialog
            title={"Filters"}
            isOpen={openFilter}
            selectedFilter={filters}
            setOpenFilter={setOpenFilter}
            countriesList={countriesList}
            handleApplyFilters={(filters) => {
              setFilters(filters);
              setOpenFilter(false);
            }}
            handleClearFilters={() => {
              setFilters({
                city: "",
                state: "",
                country: "",
                createdAt: "",
              });
              setOpenFilter(false);
            }}
          />
          <CustomSnackBar snackBarMsg={snackBarMsg} setSnackMsg={setSnackMsg} />
          <PageTitleWithButton
            title="Agent List"
            label="Add New Agent"
            onButtonClick={handleAddNewAgent}
          />
          <Card>
            <CardBody>
              <Row className="align-items-center">
                <Col>
                  <DataTableSearchBar
                    text={"Search Agent..."}
                    value={searchQuery}
                    onSearch={setSearchQuery}
                  />
                </Col>
                <Col className="d-flex align-items-center justify-content-end">
                  <Button
                    startIcon={<Tune height={"5px"} />}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpenFilter(true);
                      setApplyFilter(false);
                    }}
                    sx={{
                      fontSize: "13px",
                      height: "38px",
                      borderRadius: "30px",
                      textTransform: "none",
                      color: "white",
                      letterSpacing: 1.2,
                      boxShadow: 0,
                    }}
                  >
                    {"Filters"}
                  </Button>
                  {(filters.city ||
                    filters.state ||
                    filters.country ||
                    filters.createdAt) && <span className="ms-3"></span>}
                  {(filters.city ||
                    filters.state ||
                    filters.country ||
                    filters.createdAt) && (
                    <Button
                      startIcon={<Clear height={"5px"} />}
                      variant="contained"
                      color="error"
                      onClick={() => {
                        setApplyFilter(false);
                        setFilters({
                          city: "",
                          state: "",
                          country: "",
                          createdAt: "",
                          updatedAt: "",
                          renewDate: "",
                          expiredAt: "",
                        });
                      }}
                      sx={{
                        fontSize: "13px",
                        height: "38px",
                        borderRadius: "30px",
                        textTransform: "none",
                        color: "white",
                        letterSpacing: 1.2,
                        boxShadow: 0,
                      }}
                    >
                      {"Clear Filters"}
                    </Button>
                  )}
                  <span className="ms-2"></span>
                  <Button
                    startIcon={<SaveAlt height={"5px"} />}
                    variant="contained"
                    color="warning"
                    onClick={() => exportToExcel()}
                    sx={{
                      fontSize: "13px",
                      height: "38px",
                      borderRadius: "30px",
                      textTransform: "none",
                      color: "white",
                      letterSpacing: 1.2,
                      boxShadow: 0,
                    }}
                  >
                    {"Export Excel"}
                  </Button>
                </Col>
              </Row>
              <PaginatedDataTable
                items={items}
                columns={columns}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                totalRows={totalRows}
                sortModel={sortModel}
                setSortModel={setSortModel}
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}
