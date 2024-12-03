/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  APIRoutes,
  BASEURL,
  formatToLocalTime,
} from "../../configs/globalConfig";
import PaginatedDataTable from "../../components/PaginatedDataTable";
import PageTitleWithButton from "../../components/PageTitleWithButton";
import { useNavigate } from "react-router-dom";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import ConfirmationModal from "../../components/UI/ConfirmationModal";
import DataTableSearchBar from "../../components/DataTableSearchBar";

function ProductsListPage() {
  const navigate = useNavigate();

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const [sortModel, setSortModel] = useState([{ field: null, sort: null }]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async function fetchData(
    page,
    pageSize,
    query,
    sortConfig
  ) {
    try {
      const searchParams = query !== "" ? `&search=${query.trim()}` : "";
      const sortField = sortConfig[0]?.field || "";
      const sortDirection = sortConfig[0]?.sort || "";
      const sortParams =
        sortField !== "" && sortDirection !== ""
          ? `&sortField=${sortField}&sortDirection=${sortDirection}`
          : "";
      const endpoint = `${BASEURL}${APIRoutes.getProductList}?page=${page}&limit=${pageSize}${searchParams}${sortParams}`;
      console.log(endpoint);
      const response = await axios.get(endpoint);
      const productList = response.data.products.map((item, index) => ({
        ...item,
        id: (page - 1) * pageSize + (index + 1),
      }));
      setIsLoaded(true);
      setItems(productList);
      setTotalRows(response.data.totalProducts || 0);
    } catch (error) {
      console.error(error);
      setIsLoaded(true);
      setError(error);
    }
  },
  []);

  const deleteProductRequest = useCallback(
    async function deleteProductRequest(id) {
      try {
        const url = `${BASEURL}${APIRoutes.deleteProduct}?id=${id}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          setSnackMsg({
            isOpen: true,
            isSuccess: response.data.success,
            message: response.data.message,
          });
          fetchData(
            paginationModel.page + 1,
            paginationModel.pageSize,
            searchQuery,
            sortModel
          );
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

  useEffect(() => {
    fetchData(
      paginationModel.page + 1,
      paginationModel.pageSize,
      searchQuery,
      sortModel
    );
  }, [paginationModel, fetchData, searchQuery, sortModel]);

  const handleSort = (field) => {
    const sort =
      sortModel[0]?.field === field && sortModel[0]?.sort === "asc"
        ? "desc"
        : "asc";
    setSortModel([{ field, sort }]);
    fetchData(paginationModel.page + 1, paginationModel.pageSize, searchQuery, [
      { field, sort },
    ]);
  };

  const handleView = (row) => navigate(`/view-product/${row._id}`);
  const handleEdit = (row) => navigate(`/edit-product/${row._id}`);
  const handleDelete = (row) => {
    setSelectedProduct(row);
    setActionModal({
      isOpen: true,
      title: "Delete Product",
      message: "Do you really want to delete this product?",
      action: "DELETE",
    });
  };

  const handleCreateNewProduct = () => navigate("/add-new-product");

  const handleActionModalClose = (option) => {
    if (option && actionModal.action === "DELETE") {
      deleteProductRequest(selectedProduct._id);
    }
    setSelectedProduct(null);
    setActionModal({ isOpen: false, title: "", message: "", action: "" });
  };

  const columns = [
    { field: "id", headerName: "No.", flex: 0.8, pinned: true },
    {
      field: "title",
      headerName: "Title",
      flex: 2.5,
      onHeaderClick: () => handleSort("title"),
    },
    {
      field: "subtitle",
      headerName: "Subtitle",
      flex: 2.5,
      onHeaderClick: () => handleSort("subtitle"),
    },
    { field: "type", headerName: "Type", flex: 2 },
    { field: "subType", headerName: "Sub Type", flex: 1.5 },
    { field: "price", headerName: "Price", flex: 1.5 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.5,
      renderCell: (params) => formatToLocalTime(params.value),
      onHeaderClick: () => handleSort("createdAt"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 3,
      renderCell: (params) => (
        <div>
          <a
            href="#"
            onClick={() => handleEdit(params.row)}
            className="text-info"
          >
            <i className="mdi mdi-pencil font-size-22"></i>
          </a>
          <a
            href="#"
            onClick={() => handleView(params.row)}
            className="text-success ms-3"
          >
            <i className="mdi mdi-eye font-size-22"></i>
          </a>
          <a
            href="#"
            onClick={() => handleDelete(params.row)}
            className="text-danger ms-3"
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
            title="Product List"
            label="Add New Product"
            onButtonClick={handleCreateNewProduct}
          />
          <Card>
            <CardBody>
              <Row className="align-items-center">
                <Col>
                  <DataTableSearchBar
                    text="Search Product..."
                    value={searchQuery}
                    onSearch={setSearchQuery}
                  />
                </Col>
              </Row>
              <PaginatedDataTable
                {...{
                  items,
                  columns,
                  paginationModel,
                  setPaginationModel,
                  totalRows,
                  sortModel,
                  setSortModel,
                }}
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }
}

export default ProductsListPage;
