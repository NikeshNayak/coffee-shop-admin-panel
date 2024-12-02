/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Button, Tab } from "@mui/material";
import axios from "axios";
import {
  APIRoutes,
  BASEURL,
  formatToLocalTime,
} from "../../configs/globalConfig";
import { useCallback } from "react";
import PaginatedDataTable from "../../components/PaginatedDataTable";
import PageTitleWithButton from "../../components/PageTitleWithButton";
import CustomTabBar from "../../components/CustomTabBar";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CreateKeysPage from "../CreateKeysModal";
import ConfirmationModal from "../../components/UI/ConfirmationModal";
import DataTableSearchBar from "../../components/DataTableSearchBar";
import { Clear, SaveAlt, Tune } from "@mui/icons-material";
import KeysFilterDialog from "./KeysFilterDialog";
import { useSelector } from "react-redux";

function KeysListPage() {
  const theme = useSelector((state) => state.Layout.theme);

  const { staffDetails } = useSelector((state) => state.staffDetails);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });
  const [error, setError] = useState(null);
  const [isCreateKeyPopupOpen, setIsCreateKeyPopupOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [, setApplyFilter] = useState(false);

  const [agentList, setAgentList] = useState([]);
  const [items, setItems] = useState([]);
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
    addedById: "",
    usedAt: "",
    renewDate: "",
    expiredAt: "",
  });

  const [tabValue, setTabValue] = useState(0);

  const hasPermission = (permissionAlias) =>
    staffDetails?.permissions?.some(
      (perm) => perm.permissionAlias === permissionAlias
    ) || false;

  useEffect(() => {
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

  const fetchData = useCallback(async function fetchData(
    page,
    pageSize,
    tabIndex,
    query,
    filters,
    sortConfig
  ) {
    try {
      const filterParams = buildFilterParams(filters);
      const searchParams = query !== "" ? `&search=${query.trim()}` : "";
      console.log(filters);
      const sortField = sortConfig[0]?.field || ""; // Default sort field
      const sortDirection = sortConfig[0]?.sort || ""; // Default sort direction
      const sortParams =
        sortField !== "" && sortDirection !== ""
          ? `&sortField=${sortField}&sortDirection=${sortDirection}`
          : "";
      const endpoint =
        tabIndex === 0
          ? `${BASEURL}${
              APIRoutes.getUsedKeys
            }?page=${page}&limit=${pageSize}${searchParams}${
              filterParams !== "" ? `&${filterParams}` : ""
            }${sortParams}`
          : tabIndex === 1
          ? `${BASEURL}${
              APIRoutes.getAgentAssignedKeys
            }?page=${page}&limit=${pageSize}${searchParams}${
              filterParams !== "" ? `&${filterParams}` : ""
            }${sortParams}`
          : `${BASEURL}${APIRoutes.getNewKeys}?page=${page}&limit=${pageSize}`;
      const response = await axios.get(endpoint);
      const keysList =
        tabIndex === 0
          ? response.data.usedKeysList.map((item, index) => ({
              ...item,
              id: (page - 1) * pageSize + (index + 1),
            }))
          : tabIndex === 1
          ? response.data.agentAssignedKeysList.map((item, index) => ({
              ...item,
              id: (page - 1) * pageSize + (index + 1),
            }))
          : response.data.newKeysList.map((item, index) => ({
              ...item,
              id: (page - 1) * pageSize + (index + 1),
            }));
      setIsLoaded(true);
      setItems(keysList);
      setTotalRows(response.data.totalRowsCount || 0);
      console.log("totalRowsCount" + tabIndex + response.data.totalRowsCount);
    } catch (error) {
      setIsLoaded(true);
      setError(error);
    }
  },
  []);

  const deleteKeyRequest = useCallback(
    async function deleteKeyRequest(key) {
      try {
        const url = `${BASEURL}${APIRoutes.deleteKey}?key=${key}`;
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
              tabValue,
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
    [fetchData, paginationModel, tabValue, searchQuery, filters, sortModel]
  );

  useEffect(() => {
    fetchData(
      paginationModel.page + 1,
      paginationModel.pageSize,
      tabValue,
      searchQuery,
      filters,
      sortModel
    );
  }, [paginationModel, fetchData, tabValue, searchQuery, filters, sortModel]);

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
      tabValue,
      searchQuery,
      filters,
      sortModel
    );
  };

  const handleChange = (event, newValue) => {
    setApplyFilter(false);
    setFilters({
      addedById: "",
      usedAt: "",
      renewDate: "",
      expiredAt: "",
    });
    setOpenFilter(false);
    setTabValue(newValue);
    setPaginationModel({ pageSize: 10, page: 0 }); // Reset pagination when tab changes
  };

  const handleAddNewSetOfKeys = () => {
    if(hasPermission('add-keys') || staffDetails?.userType === 'ADMIIN') {
      console.log("Add New Set of Keys");
      setIsCreateKeyPopupOpen(true);
    }
    else {
      alert("You do not have permission to add new keys.");
    }
  };

  const handleClose = () => {
    setIsCreateKeyPopupOpen(false);
  };

  const handleRefreshKeysTable = () => {
    fetchData(
      paginationModel.page + 1,
      paginationModel.pageSize,
      tabValue,
      searchQuery,
      filters,
      sortModel
    );
  };

  const handleActionModalClose = (option) => {
    if (option === true) {
      deleteKeyRequest(selectedKey._id);
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
    setSelectedKey(null);
  };

  // Function to export the current company list to Excel
  const exportToExcel = async () => {
    const filterParams = buildFilterParams(filters);
    const searchParams = searchQuery !== "" ? `&search=${searchQuery}` : "";
    console.log(filters);
    const endpoint =
      tabValue === 0
        ? `${BASEURL}${APIRoutes.getAllUsedKeys}?${searchParams}${
            filterParams !== "" ? `&${filterParams}` : ""
          }`
        : tabValue === 1
        ? `${BASEURL}${APIRoutes.getAllAgentAssignedKeys}?${searchParams}${
            filterParams !== "" ? `&${filterParams}` : ""
          }`
        : ``;
    const response = await axios.get(endpoint);
    const keysList =
      tabValue === 0
        ? response.data.usedKeysList.map((item, index) => ({
            ...item,
            id: index + 1,
          }))
        : tabValue === 1
        ? response.data.agentAssignedKeysList.map((item, index) => ({
            ...item,
            id: index + 1,
          }))
        : [];
    const ws = XLSX.utils.json_to_sheet(
      tabValue === 0
        ? keysList.map((item) => ({
            "No.": item.id,
            "Product Key": item.key,
            "Company Name": item.companyName,
            "Added By":
              item.isAgentAssigned === true
                ? item.agentAssignedName
                : "Super Admin",
            "Used Date": formatToLocalTime(item.usedAt),
            "Subcription Renew Date": formatToLocalTime(item.renewDate),
            "Subcription Expired Date": formatToLocalTime(item.expiredAt),
          }))
        : tabValue === 1
        ? keysList.map((item) => ({
            "No.": item.id,
            "Product Key": item.key,
            "Agent Name": item.agentAssignedName,
            "Is Used ? ": item.used === true ? "Yes" : "No",
            "Used for": item.companyName,
            "Used Date":
              item.used === true ? formatToLocalTime(item.usedAt) : "-",
            "Subcription Renew Date":
              item.used === true ? formatToLocalTime(item.renewDate) : "-",
            "Subcription Expired Date":
              item.used === true ? formatToLocalTime(item.expiredAt) : "-",
          }))
        : []
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      tabValue === 0 ? "UsedKeys" : tabValue === 1 ? "AgentKeys" : ""
    );

    var currentDate = formatToLocalTime(new Date());
    // Generate Excel file and trigger download
    XLSX.writeFile(
      wb,
      `${
        tabValue === 0 ? "UsedKeys" : tabValue === 1 ? "AgentKeys" : ""
      }_${currentDate}.xlsx`
    );
  };

  let keysColumns = [
    {
      field: "id",
      headerName: "No.",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "key",
      headerName: "Product Key",
      flex: 3,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 3,
      disableColumnMenu: true,
      pinned: true,
      onHeaderClick: () => handleSort("companyName"),
    },
    {
      field: "usedAt",
      headerName: "Used At",
      flex: 2,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("usedAt"),
    },
    {
      field: "addedBy",
      headerName: "Added By",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) =>
        params.row.isAgentAssigned === true
          ? params.row.agentAssignedName
          : "Super Admin",
    },
    {
      field: "expiredAt",
      headerName: "Expired At",
      flex: 2,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("expiredAt"),
    },
    {
      field: "renewDate",
      headerName: "Renew Date",
      flex: 2,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("renewDate"),
    },
  ];

  if (tabValue === 1) {
    keysColumns = [
      {
        field: "id",
        headerName: "No.",
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        pinned: true,
      },
      {
        field: "key",
        headerName: "Product Key",
        flex: 4,
        sortable: false,
        disableColumnMenu: true,
        pinned: true,
      },
      {
        field: "agentAssignedName",
        headerName: "Agent Name",
        flex: 3,
        disableColumnMenu: true,
        pinned: true,
        onHeaderClick: () => handleSort("agentAssignedName"),
      },
      {
        field: "used",
        headerName: "Is Used ?",
        flex: 2,
        sortable: false,
        disableColumnMenu: true,
        pinned: true,
        renderCell: (params) => (params.value === true ? "YES" : "NO"),
      },
      {
        field: "companyName",
        headerName: "Used for",
        flex: 3,
        disableColumnMenu: true,
        pinned: true,
        renderCell: (params) => (params.value !== null ? params.value : "-"),
        onHeaderClick: () => handleSort("companyName"),
      },
    ];
  }

  if (tabValue === 2) {
    keysColumns = [
      {
        field: "id",
        headerName: "No.",
        flex: 1,
        sortable: false,
        disableColumnMenu: true,
        pinned: true,
      },
      {
        field: "key",
        headerName: "Product Key",
        flex: 9,
        sortable: false,
        disableColumnMenu: true,
        pinned: true,
      },
      // {
      //   field: "actions",
      //   headerName: "Actions",
      //   flex: 4,
      //   sortable: false,
      //   disableColumnMenu: true,
      //   pinned: true,
      //   renderCell: (params) => (
      //     <a
      //       href="#"
      //       onClick={() => handleDelete(params.row)}
      //       className="text-danger"
      //     >
      //       <i className="mdi mdi-trash-can font-size-22"></i>
      //     </a>
      //   ),
      // },
    ];
  }

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
            title={"Delete Key"}
            message={"Do you really want to delete this key ?"}
            isOpen={isDeleteModalOpen}
            handleActionModalClose={handleActionModalClose}
          />
          <KeysFilterDialog
            title={"Filters"}
            isOpen={openFilter}
            selectedFilter={filters}
            setOpenFilter={setOpenFilter}
            agentList={agentList}
            tabValue={tabValue}
            handleApplyFilters={(filters) => {
              setFilters(filters);
              setOpenFilter(false);
            }}
            handleClearFilters={() => {
              setFilters({
                addedById: "",
                usedAt: "",
                renewDate: "",
                expiredAt: "",
              });
              setOpenFilter(false);
            }}
          />
          <CustomSnackBar snackBarMsg={snackBarMsg} setSnackMsg={setSnackMsg} />
          <CreateKeysPage
            isOpen={isCreateKeyPopupOpen}
            handleClose={handleClose}
            handleRefreshKeys={handleRefreshKeysTable}
          />
          <PageTitleWithButton
            title="Product Keys"
            label="Add New Set of Keys"
            onButtonClick={handleAddNewSetOfKeys}
          />
          <CustomTabBar
            tabValue={tabValue}
            onTabChange={handleChange}
            mode={theme}
          >
            <Tab label="Used Keys" />
            <Tab label="Agent Keys" />
            <Tab label="New Keys" />
          </CustomTabBar>
          <Card>
            <CardBody>
              {(tabValue === 0 || tabValue === 1) && (
                <Row className="align-items-center">
                  <Col>
                    <DataTableSearchBar
                      text={"Search Product Key..."}
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
                    {(filters.addedById ||
                      filters.usedAt ||
                      filters.renewDate ||
                      filters.expiredAt) && <span className="ms-3"></span>}
                    {(filters.addedById ||
                      filters.usedAt ||
                      filters.renewDate ||
                      filters.expiredAt) && (
                      <Button
                        startIcon={<Clear height={"5px"} />}
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setApplyFilter(false);
                          setFilters({
                            addedById: "",
                            usedAt: "",
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
              )}
              <PaginatedDataTable
                items={items}
                columns={keysColumns}
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

export default KeysListPage;
