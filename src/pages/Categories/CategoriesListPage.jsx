/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedCompany } from "../../store/companies/companySlice";

import { Button, CircularProgress } from "@mui/material";
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
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import UIButton from "../../components/UI/UIButton";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import Select from "react-select";
import ConfirmationModal from "../../components/UI/ConfirmationModal";
import DataTableSearchBar from "../../components/DataTableSearchBar";
import { Clear, Tune } from "@mui/icons-material";

function CategoriesListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { staffDetails } = useSelector((state) => state.staffDetails);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const selectedCompany = useSelector((state) => state.company.selectedCompany);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [companyList, setCompanyList] = useState([]);

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

  const hasPermission = (permissionAlias) =>
    staffDetails?.permissions?.some(
      (perm) => perm.permissionAlias === permissionAlias
    ) || false;

  useEffect(() => {
    async function fetchAllCompanyList() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getAllCompaniesList}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            setCompanyList((prevState) => response.data.companiesList);
            if (selectedCompany === null) {
              dispatch(setSelectedCompany(response.data.companiesList[0]));
            }
          }
        }
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch company details:", error);
        setIsLoaded(true);
      }
    }

    fetchAllCompanyList();
  }, [dispatch, selectedCompany]);

  const fetchData = useCallback(async function fetchData(
    page,
    pageSize,
    companyId,
    searchQuery,
    sortConfig
  ) {
    try {
      const searchParams =
        searchQuery !== "" ? `&searchQuery=${searchQuery.trim()}` : "";
      const sortField = sortConfig[0]?.field || ""; // Default sort field
      const sortDirection = sortConfig[0]?.sort || ""; // Default sort direction
      const sortParams =
        sortField !== "" && sortDirection !== ""
          ? `&sortField=${sortField}&sortDirection=${sortDirection}`
          : "";
      const endpoint = `${BASEURL}${APIRoutes.getMainCategorylist}?page=${page}&limit=${pageSize}&companyId=${companyId}${searchParams}${sortParams}`;
      const response = await axios.get(endpoint);
      const categoryList = response.data.categoryList.map((item, index) => ({
        ...item,
        id: (page - 1) * pageSize + (index + 1),
      }));
      setIsLoaded(true);
      setItems(categoryList);
      setTotalRows(response.data.totalRowsCount || 0);
      console.log("totalRowsCount" + response.data.totalRowsCount);
    } catch (error) {
      setIsLoaded(true);
      setError(error);
    }
  },
  []);

  const deleteCategoryRequest = useCallback(
    async function deleteCategoryRequest(id) {
      try {
        const url = `${BASEURL}${APIRoutes.deleteCategory}${id}`;
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
              selectedCompany._id,
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
    [paginationModel, fetchData, selectedCompany, searchQuery, sortModel]
  );

  useEffect(() => {
    if (selectedCompany != null) {
      fetchData(
        paginationModel.page + 1,
        paginationModel.pageSize,
        selectedCompany._id,
        searchQuery,
        sortModel
      );
    }
  }, [paginationModel, fetchData, selectedCompany, searchQuery, sortModel]);

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
    navigate(`/view-category/${row._id}`);
  };

  const handleEdit = (row) => {
    console.log("Edit:", row);
    navigate(`/edit-category/${row._id}/${selectedCompany._id}`);
  };

  const handleDelete = (row) => {
    console.log("Delete:", row);
    setSelectedCategory(row);
    setIsDeleteModalOpen(true);
  };

  const handleCreateNewCategory = () => {
    if (
      hasPermission("add-category") ||
      staffDetails?.userType === "SUPERADMIN"
    ) {
      console.log("Create New Category");
      navigate(`/add-new-category/${selectedCompany._id}`);
    } else {
      alert("You do not have permission to add a category.");
    }
  };

  const handleCompanyChange = (selectedOption) => {
    if (selectedOption === null) {
      console.log("Select cleared");
      return;
    }
    console.log(selectedOption);
    const selected = companyList.find(
      (company) => company._id === selectedOption.value
    );
    console.log(selected);
    dispatch(setSelectedCompany(selected));
  };

  const handleActionModalClose = (option) => {
    if (option === true) {
      deleteCategoryRequest(selectedCategory._id);
      setSelectedCategory(null);
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  };

  let categoriesColumns = [
    {
      field: "id",
      headerName: "No.",
      flex: 0.8,
      disableColumnMenu: true,
      sortable: false,
      pinned: true,
    },
    {
      field: "categoryName",
      headerName: "Category Name",
      flex: 3,
      disableColumnMenu: true,
      pinned: true,
      onHeaderClick: () => handleSort("categoryName"),
    },
    {
      field: "parentCatName",
      headerName: "Top Category",
      flex: 2,
      disableColumnMenu: true,
      sortable: false,
      pinned: true,
    },
    {
      field: "code",
      headerName: "Code",
      flex: 2,
      minWidth: 140,
      sortable: false,
      disableColumnMenu: true,
      pinned: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 2,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("createdAt"),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 2,
      disableColumnMenu: true,
      pinned: true,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("updatedAt"),
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
          {(hasPermission("edit-category") ||
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
          {(hasPermission("view-category") ||
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
          {(hasPermission("delete-category") ||
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
        <ConfirmationModal
          title={"Delete Category"}
          message={"Do you really want to delete this category ?"}
          isOpen={isDeleteModalOpen}
          handleActionModalClose={handleActionModalClose}
        />
        <CustomSnackBar snackBarMsg={snackBarMsg} setSnackMsg={setSnackMsg} />
        <PageTitleWithButton
          title="Categories"
          label="Create New Category"
          onButtonClick={handleCreateNewCategory}
        />
        <div className="col-md-2">
          <div className="mb-3">
            <Select
              value={
                selectedCompany
                  ? {
                      label: selectedCompany.companyName,
                      value: selectedCompany._id,
                    }
                  : null
              }
              onChange={handleCompanyChange}
              options={companyList.map((company) => ({
                label: company.companyName,
                value: company._id,
              }))}
              placeholder="Select Company"
              noOptionsMessage={() => "No Companies"}
              classNamePrefix="select2-selection"
            />
          </div>
        </div>
        <Card>
          <CardBody>
            <Col lg={3}>
              <DataTableSearchBar
                text={"Search Category..."}
                value={searchQuery}
                onSearch={setSearchQuery}
              />
            </Col>
            <PaginatedDataTable
              items={items}
              columns={categoriesColumns}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              totalRows={totalRows}
              sortModel={sortModel}
              setSortModel={setSortModel}
            />
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default CategoriesListPage;
