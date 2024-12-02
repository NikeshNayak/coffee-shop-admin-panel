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
import ConfirmationModal from "../../components/UI/ConfirmationModal";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import { Button } from "@mui/material";
import { RemoveRedEye } from "@mui/icons-material";

export default function DashboardAgentList() {
  const navigate = useNavigate();

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: "",
  });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  const [totalAgentRows, setTotalAgentRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const [sortModel, setSortModel] = useState([
    { field: null, sort: null }, // Default sort (column: updatedAt, direction: desc)
  ]);

  const [agentList, setAgentList] = useState([]);

  async function fetchAgentList(query, sortConfig) {
    try {
      const searchParams = query !== "" ? `?search=${query.trim()}` : "";
      const sortField = sortConfig[0]?.field || ""; // Default sort field
      const sortDirection = sortConfig[0]?.sort || ""; // Default sort direction
      const sortParams =
        sortField !== "" && sortDirection !== ""
          ? `${query === "" ? "?" : "&" }sortField=${sortField}&sortDirection=${sortDirection}`
          : "";
      const endpoint = `${BASEURL}${APIRoutes.getDashboardAgentsList}${searchParams}${sortParams}`;
      console.log(endpoint);
      const response = await axios.get(endpoint);
      const agentList = response.data.agentsList.map((item, index) => ({
        ...item,
        id: index + 1,
        agentContactPerson: `${item.firstName} ${item.lastName}`,
      }));
      setIsLoaded(true);
      setAgentList(agentList);
      setTotalAgentRows(response.data.totalRowsCount || 0);
    } catch (error) {
      console.error(error);
      setIsLoaded(true);
    }
  }

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
            fetchAgentList(searchQuery, sortModel);
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
            fetchAgentList(searchQuery, sortModel);
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
    fetchAgentList(searchQuery, sortModel);
  }, [searchQuery, sortModel]);

  const handleSort = (field) => {
    let sort = "asc"; // default sorting direction
  
    // Toggle sorting direction if the same field is clicked again
    if (sortModel[0]?.field === field && sortModel[0]?.sort === "asc") {
      sort = "desc";
    }
  
    setSortModel([{ field, sort }]);
    
    // Fetch sorted data from the API with sorting params
    fetchAgentList(searchQuery, sortModel);

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
      field: "agentName",
      headerName: "Agent Name",
      flex: 2,
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
      field: "city",
      headerName: "City",
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "companyCanAddCount",
      headerName: "Can Add",
      flex: 1.5,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "companyAddedCount",
      headerName: "Added",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.5,
      sortable: true,
      disableColumnMenu: false,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("createdAt"),
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
            className="text-orange"
          >
            <i className="mdi mdi-eye font-size-22"></i>
          </a>
          <span className="ms-3"></span>
          <a
            href="#"
            onClick={() => handleEnableDisable(params.row)}
            className={
              params.row.isDisable === true ? "text-secondary" : "text-success"
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
                    text={"Search Agent..."}
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
                      navigate("/agents");
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
                items={agentList}
                columns={columns}
                totalRows={totalAgentRows}
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
