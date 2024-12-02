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
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import ConfirmationModal from "../../components/UI/ConfirmationModal";
import CompanyFilterDialog from "./CompanyFilterDialog";
import DataTableSearchBar from "../../components/DataTableSearchBar";
import { Clear, SaveAlt, Tune } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

function CompaniesListPage() {
  const navigate = useNavigate();

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
  const { staffDetails } = useSelector((state) => state.staffDetails);

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

  const hasPermission = (permissionAlias) =>
    staffDetails?.permissions?.some(
      (perm) => perm.permissionAlias === permissionAlias
    ) || false;

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
    if (
      hasPermission("add-company") ||
      staffDetails?.userType === "SUPERADMIN"
    ) {
      console.log("Create New Company");
      navigate("/add-new-company");
    } else {
      alert("You do not have permission to add a company.");
    }
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
  const exportToExcel = async () => {
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
    XLSX.writeFile(wb, `Companies_${currentDate}.xlsx`);
  };

  let columns = [
    {
      field: "id",
      headerName: "No.",
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 2.5,
      disableColumnMenu: true,
      pinned: true,
      onHeaderClick: () => handleSort("companyName"),
    },
    {
      field: "companyPersonName",
      headerName: "Person Name",
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
      field: "addedByName",
      headerName: "Added By",
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.5,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("createdAt"),
    },
    {
      field: "expiredAt",
      headerName: "Expired At",
      flex: 1.5,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("expiredAt"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 3,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => (
        <div>
          {(hasPermission("edit-company") ||
            staffDetails?.userType === "SUPERADMIN") && (
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
          {(hasPermission("view-company") ||
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
          {(hasPermission("enabledisable-company") ||
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
          {(hasPermission("renew-company") ||
            staffDetails?.userType === "SUPERADMIN") && (
            <>
              <a
                href="#"
                onClick={() => handleRenew(params.row)}
                className="text-primaryPurple"
              >
                <i className="mdi mdi-update font-size-22"></i>
              </a>
              <span className="ms-3"></span>
            </>
          )}
          {(hasPermission("delete-company") ||
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
          <CompanyFilterDialog
            title={"Filters"}
            isOpen={openFilter}
            selectedFilter={filters}
            setOpenFilter={setOpenFilter}
            countriesList={countriesList}
            agentList={agentList}
            handleApplyFilters={(filters) => {
              setFilters(filters);
              setOpenFilter(false);
            }}
            handleClearFilters={() => {
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
              setOpenFilter(false);
            }}
          />
          <CustomSnackBar snackBarMsg={snackBarMsg} setSnackMsg={setSnackMsg} />
          <PageTitleWithButton
            title="COMPANY LIST"
            label="Create New Company"
            onButtonClick={handleCreateNewCompany}
          />
          <Card>
            <CardBody>
              <Row className="align-items-center">
                <Col>
                  <DataTableSearchBar
                    text={"Search Company..."}
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
                    filters.addedById ||
                    filters.createdAt ||
                    filters.updatedAt ||
                    filters.renewDate ||
                    filters.expiredAt) && <span className="ms-3"></span>}
                  {(filters.city ||
                    filters.state ||
                    filters.country ||
                    filters.addedById ||
                    filters.createdAt ||
                    filters.updatedAt ||
                    filters.renewDate ||
                    filters.expiredAt) && (
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
                          addedById: "",
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
                  {hasPermission("export-excel-company") && (
                    <>
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
                    </>
                  )}
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

export default CompaniesListPage;
