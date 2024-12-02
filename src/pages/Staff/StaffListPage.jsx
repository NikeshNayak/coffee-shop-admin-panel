/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
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
import DataTableSearchBar from "../../components/DataTableSearchBar";

export default function StaffListPage() {
  const navigate = useNavigate();

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: "",
  });
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const fetchData = useCallback(async (page, pageSize, query, sortConfig) => {
    try {
      const searchParams = query !== "" ? `&search=${query.trim()}` : "";
      const sortField = sortConfig[0]?.field || ""; // Default sort field
      const sortDirection = sortConfig[0]?.sort || ""; // Default sort direction
      const sortParams =
        sortField !== "" && sortDirection !== ""
          ? `&sortField=${sortField}&sortDirection=${sortDirection}`
          : "";
      const endpoint = `${BASEURL}${APIRoutes.staffList}?page=${page}&limit=${pageSize}${searchParams}${sortParams}`;
      const response = await axios.get(endpoint);

      const staffList = response.data.staffList.map((item, index) => ({
        ...item,
        id: (page - 1) * pageSize + (index + 1),
      }));
      setIsLoaded(true);
      setItems(staffList);
      setTotalRows(response.data.totalRowsCount || 0);
    } catch (error) {
      setIsLoaded(true);
      setError(error);
    }
  }, []);

  const deleteStaffRequest = useCallback(
    async function deleteStaffRequest(id) {
      try {
        const url = `${BASEURL}${APIRoutes.deleteStaff}?staffId=${id}`;
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
    [fetchData, paginationModel, searchQuery, sortModel]
  );

  // const enabledisableStaffRequest = useCallback(
  //   async function enabledisableStaffRequest(id, action) {
  //     try {
  //       const url = `${BASEURL}${APIRoutes.enabledisableStaff}?id=${id}&action=${action}`;
  //       const response = await axios.get(url);
  //       if (response.status === 200) {
  //         if (response.data.success === true) {
  //           setSnackMsg({
  //             isOpen: true,
  //             isSuccess: true,
  //             message: response.data.message,
  //           });
  //           fetchData(
  //             paginationModel.page + 1,
  //             paginationModel.pageSize,
  //             searchQuery,
  //             filters,
  //             sortModel
  //           );
  //         } else {
  //           setSnackMsg({
  //             isOpen: true,
  //             isSuccess: false,
  //             message: response.data.message,
  //           });
  //         }
  //       }
  //     } catch (error) {
  //       setSnackMsg({
  //         isOpen: true,
  //         isSuccess: false,
  //         message: error.message,
  //       });
  //     }
  //   },
  //   [fetchData, paginationModel, searchQuery, filters, sortModel]
  // );

  useEffect(() => {
    fetchData(
      paginationModel.page + 1,
      paginationModel.pageSize,
      searchQuery,
      sortModel
    );
  }, [paginationModel, fetchData, searchQuery, sortModel]);

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
      sortModel
    );
  };

  const handleView = (row) => {
    console.log("View:", row);
    navigate(`/view-staff/${row._id}`);
  };

  const handleEdit = (row) => {
    console.log("Edit:", row);
    navigate(`/edit-staff/${row._id}`);
  };

  const handleEnableDisable = (row) => {
    console.log("Disable:", row);
    setSelectedStaff(row);
    if (row.isDisable === false) {
      setActionModal((prevState) => {
        return {
          isOpen: true,
          title: "Disable Staff",
          message: "Do you really want to disable this staff ?",
          action: "DISABLE",
        };
      });
    } else {
      setActionModal((prevState) => {
        return {
          isOpen: true,
          title: "Enable Staff",
          message: "Do you really want to enable this staff ?",
          action: "ENABLE",
        };
      });
    }
  };

  const handleDelete = (row) => {
    console.log("Delete:", row);
    setSelectedStaff(row);
    setActionModal((prevState) => {
      return {
        isOpen: true,
        title: "Delete Staff",
        message: "Do you really want to delete this staff member ?",
        action: "DELETE",
      };
    });
  };

  const handleAddNewStaff = () => {
    console.log("Add New Staff");
    navigate("/add-new-staff");
  };

  const handleActionModalClose = (option) => {
    if (option === true) {
      if (actionModal.action === "DELETE") {
        deleteStaffRequest(selectedStaff._id);
      }
      // else if (actionModal.action === "DISABLE") {
      //   enabledisableStaffRequest(selectedStaff._id, actionModal.action);
      // } else if (actionModal.action === "ENABLE") {
      //   enabledisableStaffRequest(selectedStaff._id, actionModal.action);
      // }
      setSelectedStaff(null);
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
      setSelectedStaff(null);
    }
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
      field: "name",
      headerName: "Staff Name",
      flex: 1.8,
      disableColumnMenu: true,
      pinned: true,
      onHeaderClick: () => handleSort("name"),
    },
    {
      field: "emailId",
      headerName: "Email Id",
      flex: 1.5,
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
      field: "updatedAt",
      headerName: "Updated",
      flex: 1.5,
      sortable: true,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("updatedAt"), // Trigger sorting when header is clicked
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
          {/* <span className="ms-3"></span>
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
          </a> */}
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
          <PageTitleWithButton
            title="Staff List"
            label="Add Staff Staff"
            onButtonClick={handleAddNewStaff}
          />
          <Card>
            <CardBody>
              <Row className="align-items-center">
                <Col lg="6">
                  <DataTableSearchBar
                    text={"Search Staff..."}
                    value={searchQuery}
                    onSearch={setSearchQuery}
                  />
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
