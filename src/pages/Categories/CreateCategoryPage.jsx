/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/useHttp";
import {
  APIRoutes,
  BASEURL,
  CATEGORYBASEURL,
} from "../../configs/globalConfig";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumb";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import MessageModal from "../../components/UI/MessageModal";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import CreateHierachicalCheckBox from "./CreateHierachicalCheckBox";
import axios from "axios";
import { useCallback } from "react";
import InputField from "../../components/UI/InputField";
import ImageList from "../../components/ImageList";
import VideoList from "../../components/VideoList";

const requestConfig = {
  method: "POST",
};

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const { companyId } = useParams(); // Extract companyId from the URL

  const [isLoaded, setIsLoaded] = useState(false);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });

  const [formData, setFormData] = useState({
    categoryName: "",
    code: "",
    description: "",
  });
  const [validateForm, setValidateForm] = useState(false);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const [imagesList, setImagesList] = useState([]);

  const [videosList, setVideosList] = useState([]);

  const [pdfAttachFile, setPdfAttachFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const [parentCategory, setParentCategory] = useState(null);
  const formRef = useRef(null);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
    clearError,
  } = useHttp(
    `${CATEGORYBASEURL}${APIRoutes.addCategory}?companyId=${companyId}`,
    requestConfig
  );

  const fetchAllCategoryList = useCallback(
    async function fetchAllCategoryList() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getAllCategoryList}?companyId=${companyId}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            setIsLoaded(true);
            setCategoryList(response.data.categoryList);
          } else {
            setIsLoaded(true);
            setSnackMsg({
              isOpen: true,
              isSuccess: false,
              message: response.data.message,
            });
          }
        } else {
          setIsLoaded(true);
          setSnackMsg({
            isOpen: true,
            isSuccess: false,
            message: response.data.message,
          });
        }
      } catch (error) {
        console.error("Failed to fetch company details:", error);
        setIsLoaded(true);
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      }
    },
    [companyId]
  );

  useEffect(() => {
    // Fetch the all category list when the component mounts
    fetchAllCategoryList();
  }, [fetchAllCategoryList]);

  const handleInputChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit() {
    setValidateForm(true); // Trigger validation on all fields
    // Perform validation check
    const isValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    if (!isValid) {
      setSnackMsg({
        isOpen: true,
        isSuccess: false,
        message: "Please fill out all required fields.",
      });
      return;
    }

    const fd = new FormData();

    // Append form data fields
    Object.keys(formData).forEach((key) => {
      fd.append(key, formData[key]);
    });

    if (pdfAttachFile !== null) {
      fd.append("pdfFile", pdfAttachFile);
    }

    if (imagesList.length > 0) {
      imagesList.forEach((value, index) => {
        fd.append(`images[]`, value.file);
      });
    }

    if (videosList.length > 0) {
      videosList.forEach((value, index) => {
        fd.append(`videos[]`, value.file);
      });
    }

    if (parentCategory !== null) {
      fd.append("parentCatId", parentCategory._id);
      fd.append("parentCatName", parentCategory.categoryName);
    }
    sendRequest(fd);
  }

  function handleFinish() {
    setIsMessageModalOpen(false);
    clearData();
    if (formRef.current) {
      formRef.current.reset();
    }
    navigate("/categories");
  }

  let actions = (
    <div className="mt-2" style={{ textAlign: "center" }}>
      <Button
        type="button"
        color="primaryPurple"
        className="waves-effect waves-light"
        onClick={() => {
          handleSubmit();
        }}
      >
        Create Category
      </Button>
      <span className="ms-3"></span>
      <Button
        type="button"
        onClick={() => {
          navigate("/categories");
        }}
        color="secondary"
      >
        Cancel
      </Button>
    </div>
  );

  const handlePdfFileChange = (e) => {
    // const pdfFile = list[0];
    // setPdfFile(pdfFile);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const blob = new Blob([reader.result], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        setPdfFile(blobUrl);
        setPdfAttachFile(file);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleImageFilesChange = (list) => {
    const files = Array.from(list);
    if (files.length > 0) {
      const fileReaders = [];
      const imageFiles = [];

      if (files.length > 4) {
        alert("You can only upload a maximum of 4 images.");
        return;
      }
      setImagesList(files);
      // files.forEach((file, index) => {
      //   const reader = new FileReader();
      //   fileReaders.push(reader);

      //   reader.onloadend = () => {
      //     const blob = new Blob([reader.result], { type: file.type });
      //     const blobUrl = URL.createObjectURL(blob);
      //     imageFiles.push(blobUrl);
      //     if (imageFiles.length === files.length) {
      //       setImagesList(imageFiles); // or use setImageFiles or a different state function for clarity
      //     }
      //   };

      //   reader.readAsArrayBuffer(file);
      // });
    }
  };

  const handleImageDelete = (value) => {
    setImagesList((prevImageList) => {
      const newImageList = prevImageList.filter(
        (ele) => ele.file !== value.file
      );
      return newImageList;
    });

    // // Reset the file input
    // if (imageFileRef.current) {
    //   imageFileRef.current.value = null;
    // }

    // // Repopulate the file input with remaining files
    // const dataTransfer = new DataTransfer();
    // imagesList.forEach((imageUrl) => {
    //   if (imageUrl !== value) {
    //     const file = new File([], imageUrl); // Create a dummy file
    //     dataTransfer.items.add(file);
    //   }
    // });

    // if (imageFileRef.current) {
    //   imageFileRef.current.files = dataTransfer.files;
    // }
  };

  const handleVideoFilesChange = (list) => {
    const files = Array.from(list);
    if (files.length > 0) {
      const fileReaders = [];
      const videoFiles = [];

      if (files.length > 1) {
        alert("You can only upload a maximum of 1 video.");
        return;
      }
      setVideosList(files);

      // files.forEach((file, index) => {
      //   const reader = new FileReader();
      //   fileReaders.push(reader);

      //   reader.onloadend = () => {
      //     const blob = new Blob([reader.result], { type: file.type });
      //     const blobUrl = URL.createObjectURL(blob);
      //     videoFiles.push(blobUrl);
      //     if (videoFiles.length === files.length) {
      //        // or use setImageFiles or a different state function for clarity
      //     }
      //   };

      //   reader.readAsArrayBuffer(file);
      // });
    }
  };

  const handleVideoDelete = (value) => {
    setVideosList((prevVideoList) => {
      const newVideoList = prevVideoList.filter(
        (ele) => ele.file !== value.file
      );
      return newVideoList;
    });
  };

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
            title={"Create New Category"}
            breadcrumbItems={[
              { title: "Categories", link: "/categories" },
              { title: "Create Category", link: "#" },
            ]}
          />
          {!isLoaded && (
            <div className="page-content">
              <div id="status">
                <div className="spinner">
                  <i className="ri-loader-line spin-icon"></i>
                </div>
              </div>
            </div>
          )}
          {isLoaded && (
            <Container fluid>
              <MessageModal
                title={"Success!"}
                message={"Category was added successfully."}
                isOpen={isMessageModalOpen}
                handleModalClose={handleFinish}
              />
              <CustomSnackBar
                snackBarMsg={snackBarMsg}
                setSnackMsg={setSnackMsg}
              />
              <Card>
                <CardBody>
                  <form ref={formRef}>
                    <Row>
                      <Col lg={6}>
                        <InputField
                          id="categoryName"
                          label="Category name"
                          defaultValue={formData.categoryName}
                          invalid={formData.categoryName === "" && validateForm}
                          required={true}
                          onChange={handleInputChange}
                        />
                      </Col>
                      <Col lg={6}>
                        <InputField
                          id="code"
                          label="Category Code"
                          defaultValue={formData.code}
                          invalid={formData.code === "" && validateForm}
                          required={true}
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                    <div className="mb-3">
                      <Row>
                        <Col lg="12">
                          <InputField
                            id="description"
                            label="Category Description"
                            type="textarea"
                            defaultValue={formData.description}
                            invalid={
                              formData.description === "" && validateForm
                            }
                            required={true}
                            rows={"4"}
                            placeholder="Eg. We are making this product in below dimentions like 7 inch, 8 inch, 9 inch. Color are like red, blue, green, purples here"
                            onChange={handleInputChange}
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="mb-4">
                      {pdfFile !== null && (
                        <div className="mb-3">
                          <Card className="mt-1 mb-0 shadow border">
                            <div className="d-flex justify-content-between align-items-center p-2">
                              <div className="d-flex align-items-center">
                                <i className="mdi mdi-pdf-box text-danger display-4 me-2"></i>
                                <div>
                                  <p className="mb-1">
                                    <strong>{`${
                                      formData.categoryName !== ""
                                        ? formData.categoryName + " - "
                                        : ""
                                    }Catalogue`}</strong>
                                  </p>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.open(pdfFile, "_blank");
                                    }}
                                    className="text-primary fw-bold text-decoration-none"
                                  >
                                    View PDF
                                  </a>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                      <div className="mb-4">
                        <Label className="form-label" htmlFor="logo">
                          Upload PDF
                        </Label>
                        <div className="mb-1">
                          <Input
                            type="file"
                            id="pdfFile"
                            className="form-control"
                            accept="application/pdf"
                            onChange={handlePdfFileChange}
                          />
                        </div>
                        <div className="file-display">
                          {pdfAttachFile ? (
                            <Label>Selected file: {pdfAttachFile.name}</Label>
                          ) : (
                            <Label>No file selected</Label>
                          )}
                        </div>
                        {pdfAttachFile === null && validateForm && (
                          <FormFeedback className="d-block">
                            PDF file is required!
                          </FormFeedback>
                        )}
                      </div>
                    </div>
                    {/* <PdfFileComponent
                      label={`${formData.categoryName !== "" ? formData.categoryName + " -" : ""} Catalogue`}
                      pdfFile={pdfFile}
                      required={false}
                      handlePdfFileChange={handlePdfFileChange}
                      handlePdfDelete={() => {
                        setPdfFile(null);
                      }}
                    /> */}
                    <ImageList
                      imagesList={imagesList}
                      handleImageFilesChange={handleImageFilesChange}
                      handleImageDelete={handleImageDelete}
                    />
                    <VideoList
                      videosList={videosList}
                      handleVideoFilesChange={handleVideoFilesChange}
                      handleVideoDelete={handleVideoDelete}
                    />
                    {categoryList.length > 0 && (
                      <div className="mb-3">
                        <Label className="form-label">All Categories</Label>
                        <CreateHierachicalCheckBox
                          data={categoryList}
                          setSelectedParent={(selectedParent) => {
                            console.log(selectedParent);
                            setParentCategory(selectedParent);
                          }}
                        />
                      </div>
                    )}
                    {!isSending && actions}
                  </form>
                </CardBody>
              </Card>
            </Container>
          )}
        </div>
      )}
    </>
  );
}
