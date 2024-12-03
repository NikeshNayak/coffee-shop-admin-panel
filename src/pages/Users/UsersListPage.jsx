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
import { Link, useNavigate } from "react-router-dom";
import UIButton from "../../components/UI/UIButton";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import { Card, CardBody, Col, Container, Form, Input, Row } from "reactstrap";
import ConfirmationModal from "../../components/UI/ConfirmationModal";
import Select from "react-select";
import DataTableSearchBar from "../../components/DataTableSearchBar";
import { Clear, SaveAlt, Tune } from "@mui/icons-material";
import { useSelector } from "react-redux";
import Breadcrumbs from "../../components/Breadcrumb";

export default function UsersListPage() {
  const navigate = useNavigate();

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
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

  const buildFilterParams = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "") {
        params.append(key, value);
      }
    });
    return params.toString();
  };

  const fetchData = useCallback(async (page, pageSize, query, sortConfig) => {
    try {
      const searchParams = query !== "" ? `&search=${query.trim()}` : "";
      const sortField = sortConfig[0]?.field || ""; // Default sort field
      const sortDirection = sortConfig[0]?.sort || ""; // Default sort direction
      const sortParams =
        sortField !== "" && sortDirection !== ""
          ? `&sortField=${sortField}&sortDirection=${sortDirection}`
          : "";
      const endpoint = `${BASEURL}${APIRoutes.getUsersList}?page=${page}&limit=${pageSize}${searchParams}${sortParams}`;
      const response = await axios.get(endpoint);

      const userList = response.data.users.map((item, index) => ({
        ...item,
        id: (page - 1) * pageSize + (index + 1),
      }));
      setIsLoaded(true);
      setItems(userList);
      setTotalRows(response.data.totalUsers || 0);
    } catch (error) {
      setIsLoaded(true);
      setError(error);
    }
  }, []);

  const deleteUserRequest = useCallback(
    async function deleteUserRequest(id) {
      try {
        const url = `${BASEURL}${APIRoutes.deleteUsers}/${id}`;
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
    navigate(`/view-user/${row._id}`);
  };

  const handleDelete = (row) => {
    console.log("Delete:", row);
    setSelectedUser(row);
    setActionModal((prevState) => {
      return {
        isOpen: true,
        title: "Delete User",
        message: "Do you really want to delete this user ?",
        action: "DELETE",
      };
    });
  };

  const handleActionModalClose = (option) => {
    if (option === true) {
      if (actionModal.action === "DELETE") {
        deleteUserRequest(selectedUser._id);
      }
      setSelectedUser(null);
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
      setSelectedUser(null);
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
      headerName: "Name",
      flex: 1.8,
      disableColumnMenu: true,
      pinned: true,
      onHeaderClick: () => handleSort("name"),
    },
    {
      field: "emailId",
      headerName: "Email Id",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1.5,
      sortable: true,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("createdAt"), // Trigger sorting when header is clicked
    },
    {
      field: "updatedAt",
      headerName: "Updated Date",
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
            onClick={() => handleView(params.row)}
            className="text-success"
          >
            <i className={"mdi mdi-eye font-size-22"}></i>
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
          <Breadcrumbs title="Users List" breadcrumbItems={[]} />
          <Card>
            <CardBody>
              <Row className="align-items-center">
                <Col>
                  <DataTableSearchBar
                    text={"Search Users..."}
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
