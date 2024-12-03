import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useHttp from "../../hooks/useHttp";
import { APIRoutes, BASEURL, MEDIA_URL } from "../../configs/globalConfig";
import imagePlaceholder from "../../assets/images/image_placeholder_logo.png";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumb";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import MessageModal from "../../components/UI/MessageModal";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import InputField from "../../components/UI/InputField";
import { useSelector } from "react-redux";

export default function UpdateProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    price: "",
    type: "",
    subType: "",
    isMilkAdded: "false",
    description: "",
    sizes: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const formRef = useRef(null);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
    clearError,
  } = useHttp(`${BASEURL}${APIRoutes.updateProduct}/${productId}`, {
    method: "POST",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit() {
    const isValid = Object.values(formData).every((value) => value !== "");
    if (!isValid) {
      setSnackMsg({
        isOpen: true,
        isSuccess: false,
        message: "Please fill out all required fields.",
      });
      return;
    }

    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      fd.append(key, formData[key]);
    });

    if (productImageFile) {
      fd.append("image", productImageFile);
    }

    sendRequest(fd);
  }

  function handleFinish() {
    clearData();
    navigate("/products");
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImageFile(file);
        setProductImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch product details to prefill the form
  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getProductDetails}/${productId}`
        );
        if (response.status === 200 && response.data.success) {
          const product = response.data.product;
          setFormData({
            title: product.title || "",
            subtitle: product.subtitle || "",
            price: product.price || "",
            type: product.type || "",
            subType: product.subType || "",
            description: product.description || "",
          });
          setProductImage(product.image || null);
          setIsLoaded(true);
        } else {
          setSnackMsg({
            isOpen: true,
            isSuccess: false,
            message: response.data.message,
          });
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
        setIsLoaded(true);
      }
    }

    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    if (data && !error) {
      setIsMessageModalOpen(true);
    } else if (error) {
      setSnackMsg({
        isOpen: true,
        isSuccess: false,
        message: error,
      });
      clearData();
      clearError();
    }
  }, [data, error, clearData, clearError]);


  return (
    <>
      {isSending && (
        <div className="page-content">
          <div id="status">
            <div className="spinner">
              <i className="ri-loader-line spin-icon"></i>
            </div>
          </div>
        </div>
      )}
      {!isSending && (
        <div className="page-content">
          <Breadcrumbs
            title={"Update Product"}
            breadcrumbItems={[
              { title: "Products", link: "/products" },
              { title: "Update Product", link: "#" },
            ]}
          />
          <Container fluid>
            <MessageModal
              title={"Success!"}
              message={"Product was updated successfully."}
              isOpen={isMessageModalOpen}
              handleModalClose={handleFinish}
            />
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            {isLoaded && (
              <form ref={formRef}>
                <Card>
                  <CardBody>
                    <Row>
                      <div className="mb-3">
                        {productImage ? (
                          <center>
                            <img
                              src={`${MEDIA_URL}${productImage}`}
                              alt="Product"
                              style={{
                                maxHeight: "100px",
                                maxWidth: "100%",
                                borderRadius: "15px",
                              }}
                            />
                          </center>
                        ) : (
                          <center>
                            <img
                              src={imagePlaceholder}
                              alt="Product Placeholder"
                              style={{ maxHeight: "100px", maxWidth: "100%" }}
                            />
                          </center>
                        )}
                        <Label className="form-label" htmlFor="image">
                          Product Image
                        </Label>
                        <Input
                          id="image"
                          type="file"
                          className="form-control"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleImageChange}
                        />
                      </div>
                      <Col lg="6">
                        <InputField
                          id="title"
                          name="title"
                          label="Title"
                          value={formData.title}
                          required
                          onChange={handleInputChange}
                        />
                      </Col>
                      <Col lg="6">
                        <InputField
                          id="subtitle"
                          name="subtitle"
                          label="Subtitle"
                          value={formData.subtitle}
                          required
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <InputField
                          id="price"
                          name="price"
                          label="Price"
                          type="number"
                          value={formData.price}
                          required
                          onChange={handleInputChange}
                        />
                      </Col>
                      <Col lg="6">
                        <InputField
                          id="type"
                          name="type"
                          label="Type"
                          value={formData.type}
                          required
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <InputField
                          id="subType"
                          name="subType"
                          label="Sub Type"
                          value={formData.subType}
                          required
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <InputField
                          id="description"
                          name="description"
                          label="Description"
                          type="textarea"
                          value={formData.description}
                          required
                          rows="3"
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                    <div className="mb-2" style={{ textAlign: "center" }}>
                      <Button
                        type="button"
                        color="primaryPurple"
                        className="waves-effect waves-light"
                        onClick={handleSubmit}
                      >
                        Update Product
                      </Button>
                      <span className="ms-2"></span>
                      <Button
                        type="button"
                        onClick={() => navigate("/products")}
                        color="secondary"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </form>
            )}
          </Container>
        </div>
      )}
    </>
  );
}
