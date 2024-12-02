/* eslint-disable jsx-a11y/anchor-is-valid */
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  APIRoutes,
  BASEURL,
  formatToLocalTime,
} from "../../configs/globalConfig";
import DataTableSearchBar from "../../components/DataTableSearchBar";
import PaginatedDataTable from "../../components/PaginatedDataTable";
import { useNavigate } from "react-router-dom";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import ConfirmationModal from "../../components/UI/ConfirmationModal";
import { Button } from "@mui/material";
import { RemoveRedEye } from "@mui/icons-material";

export default function DashboardCompanyList() {
  const navigate = useNavigate();

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: "",
  });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  const [companyList, setCompanyList] = useState([]);
  const [totalCompanyRows, setTotalCompanyRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [sortModel, setSortModel] = useState([
    { field: null, sort: null }, // Default sort (column: updatedAt, direction: desc)
  ]);

  async function fetchCompanyList(query, sortConfig) {
    try {
      const searchParams = query !== "" ? `?search=${query.trim()}` : "";
      const sortField = sortConfig[0]?.field || ""; // Default sort field
      const sortDirection = sortConfig[0]?.sort || ""; // Default sort direction
      const sortParams =
        sortField !== "" && sortDirection !== ""
          ? `${query === "" ? "?" : "&" }sortField=${sortField}&sortDirection=${sortDirection}`
          : "";
      const endpoint = `${BASEURL}${APIRoutes.getDashboardCompaniesList}${searchParams}${sortParams}`;
      console.log(endpoint);
      const response = await axios.get(endpoint);
      const companyList = response.data.companiesList.map((item, index) => ({
        ...item,
        id: index + 1,
        companyPersonName: `${item.firstName} ${item.lastName}`,
      }));
      setIsLoaded(true);
      setCompanyList(companyList);
      setTotalCompanyRows(response.data.totalRowsCount || 0);
    } catch (error) {
      console.error(error);
      setIsLoaded(true);
    }
  }

  const renewCompanySubcriptionRequest = useCallback(
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
            fetchCompanyList(searchQuery, sortModel);
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
    [searchQuery, sortModel]
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
            fetchCompanyList(searchQuery, sortModel);
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
    [searchQuery, sortModel]
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
            fetchCompanyList(searchQuery, sortModel);
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
    [searchQuery, sortModel]
  );
  useEffect(() => {
    fetchCompanyList(searchQuery, sortModel);
  }, [searchQuery, sortModel]);

  const handleSort = (field) => {
    let sort = "asc"; // default sorting direction

    // Toggle sorting direction if the same field is clicked again
    if (sortModel[0]?.field === field && sortModel[0]?.sort === "asc") {
      sort = "desc";
    }

    setSortModel([{ field, sort }]);

    // Fetch sorted data from the API with sorting params
    fetchCompanyList(searchQuery, sortModel);
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

  const handleActionModalClose = (option) => {
    if (option === true) {
      if (actionModal.action === "DELETE") {
        deleteCompanyRequest(selectedCompany._id);
      } else if (actionModal.action === "DISABLE") {
        enabledisableCompanyRequest(selectedCompany._id, actionModal.action);
      } else if (actionModal.action === "ENABLE") {
        enabledisableCompanyRequest(selectedCompany._id, actionModal.action);
      } else if (actionModal.action === "RENEW") {
        renewCompanySubcriptionRequest(selectedCompany._id);
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
      flex: 1.8,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
      onHeaderClick: () => handleSort("companyPersonName"),
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
      flex: 1.3,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("createdAt"),
    },
    {
      field: "expiredAt",
      headerName: "Expired At",
      flex: 1.3,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("expiredAt"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2.8,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => (
        <div>
          <a
            href="#"
            onClick={() => handleEdit(params.row)}
            className="text-info"
          >
            <i className="mdi mdi-pencil font-size-22"></i>
          </a>
          <span className="ms-3"></span>
          <a
            href="#"
            onClick={() => handleView(params.row)}
            className="text-success"
          >
            <i className={"mdi mdi-eye font-size-22"}></i>
          </a>
          <span className="ms-3"></span>
          <a
            href="#"
            onClick={() => handleEnableDisable(params.row)}
            className={
              params.row.isDisable === true ? "text-secondary" : "text-orange"
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
          <a
            href="#"
            onClick={() => handleRenew(params.row)}
            className="text-primary"
          >
            <i className="mdi mdi-update font-size-22"></i>
          </a>
          <span className="ms-3"></span>
          <a
            href="#"
            onClick={() => handleDelete(params.row)}
            className="text-danger"
          >
            <i className="mdi mdi-trash-can font-size-22"></i>
          </a>
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoaded && (
        <>
          <ConfirmationModal
            title={actionModal.title}
            message={actionModal.message}
            isOpen={actionModal.isOpen}
            handleActionModalClose={handleActionModalClose}
          />
          <CustomSnackBar snackBarMsg={snackBarMsg} setSnackMsg={setSnackMsg} />
          <Card>
            <CardBody>
              <Row className="align-items-center">
                <Col lg={4}>
                  <DataTableSearchBar
                    text={"Search Company..."}
                    value={searchQuery}
                    onSearch={setSearchQuery}
                  />
                </Col>
                <Col className="d-flex align-items-center justify-content-end">
                  <Button
                    startIcon={<RemoveRedEye height={"5px"} />}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      navigate("/companies");
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
                    {"View All"}
                  </Button>
                </Col>
              </Row>
              <PaginatedDataTable
                items={companyList}
                columns={columns}
                totalRows={totalCompanyRows}
                sortModel={sortModel}
                setSortModel={setSortModel}
              />
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
}
