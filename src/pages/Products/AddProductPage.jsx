import { useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/useHttp";
import { APIRoutes, BASEURL } from "../../configs/globalConfig";
import imagePlaceholder from "../../assets/images/image_placeholder_logo.png";
import { useNavigate } from "react-router-dom";
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

const requestConfig = {
  method: "POST",
};

export default function AddProductPage() {
  const navigate = useNavigate();
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    price: "",
    type: "",
    subType: "",
    description: "",
  });
  const [validateForm, setValidateForm] = useState(false);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);

  const formRef = useRef(null);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
    clearError,
  } = useHttp(`${BASEURL}${APIRoutes.addProduct}`, requestConfig);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit() {
    setValidateForm(true);

    const isValid = Object.values(formData).every((value) => value.trim() !== "");
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
    setIsMessageModalOpen(false);
    clearData();
    if (formRef.current) {
      formRef.current.reset();
    }
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

  let actions = (
    <div className="mb-2" style={{ textAlign: "center" }}>
      <Button
        type="button"
        color="primaryPurple"
        className="waves-effect waves-light"
        onClick={() => {
          handleSubmit();
        }}
      >
        Add Product
      </Button>
      <span className="ms-2"></span>
      <Button
        type="button"
        onClick={() => {
          navigate("/products");
        }}
        color="secondary"
      >
        Cancel
      </Button>
    </div>
  );

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
            title={"Add New Product"}
            breadcrumbItems={[
              { title: "Products", link: "/products" },
              { title: "Add Product", link: "#" },
            ]}
          />
          <Container fluid>
            <MessageModal
              title={"Success!"}
              message={"Product was added successfully."}
              isOpen={isMessageModalOpen}
              handleModalClose={handleFinish}
            />
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            <form ref={formRef}>
              <Card>
                <CardBody>
                  <Row>
                    <div className="mb-3">
                      {productImage ? (
                        <center>
                          <img
                            src={productImage}
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
                        defaultValue={formData.title}
                        required
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg="6">
                      <InputField
                        id="subtitle"
                        name="subtitle"
                        label="Subtitle"
                        defaultValue={formData.subtitle}
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
                        defaultValue={formData.price}
                        required
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col lg="6">
                      <InputField
                        id="type"
                        name="type"
                        label="Type"
                        defaultValue={formData.type}
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
                        defaultValue={formData.subType}
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
                        defaultValue={formData.description}
                        required
                        rows="3"
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  {actions}
                </CardBody>
              </Card>
            </form>
          </Container>
        </div>
      )}
    </>
  );
}
