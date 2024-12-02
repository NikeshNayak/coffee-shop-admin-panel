/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/useHttp";
import {
  APIRoutes,
  BASEURL,
  CATEGORY_MEDIA_BASEURL,
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
  Input,
  Label,
  Row,
} from "reactstrap";
import MessageModal from "../../components/UI/MessageModal";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import UpdateHierachicalCheckBox from "./UpdateHierachicalCheckBox";
import axios from "axios";
import InputField from "../../components/UI/InputField";
import ImageList from "../../components/ImageList";
import VideoList from "../../components/VideoList";
import { useSelector } from "react-redux";

const requestConfig = {
  method: "POST",
};

export default function UpdateCategoryPage() {
  const navigate = useNavigate();
  const { categoryId, companyId } = useParams(); // Extract companyId from the URL

  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";

  const [isCategoryLoaded, setCategoryIsLoaded] = useState(false);
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
  const [categoryDetails, setCategoryDetails] = useState(null); // State to store company detailsx

  const [imagesList, setImagesList] = useState([]);

  const [videosList, setVideosList] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfAttachFile, setPdfAttachFile] = useState(null);

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
    `${CATEGORYBASEURL}${APIRoutes.updateCategory}?categoryId=${categoryId}&companyId=${companyId}`,
    requestConfig
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const categoryResponse = await axios.get(
          `${BASEURL}${APIRoutes.getCategoryDetails}?id=${categoryId}`
        );
        const listResponse = await axios.get(
          `${BASEURL}${APIRoutes.getAllCategoryList}?companyId=${companyId}`
        );
        // Check if both requests were successful
        if (categoryResponse.data.success && listResponse.data.success) {
          setCategoryDetails(categoryResponse.data.category);
          setFormData({
            categoryName: categoryResponse.data.category.categoryName,
            code: categoryResponse.data.category.code,
            description: categoryResponse.data.category.description,
          });
          setCategoryList(listResponse.data.categoryList);
        } else {
          // Handle specific error messages from the response
          setSnackMsg({
            isOpen: true,
            isSuccess: false,
            message: "Failed to fetch data from server. Please try again.",
          });
        }
      } catch (error) {
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      } finally {
        setCategoryIsLoaded(true);
      }
    }

    fetchData();
  }, [categoryId, companyId]);

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

    fd.append("prevPdfFile", categoryDetails.pdfLink);
    if (pdfAttachFile !== null) {
      fd.append("pdfFile", pdfAttachFile);
    }

    fd.append("prevImages", JSON.stringify(categoryDetails.images));
    fd.append("prevVideos", JSON.stringify(categoryDetails.videos));
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
        onClick={handleSubmit}
      >
        Update Category
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

  const handleInputChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
      console.log("Images: " + categoryDetails.images);
      let prevImagesLength = categoryDetails.images.length;
      if (files.length + prevImagesLength > 4) {
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
      console.log("Videos: " + categoryDetails.videos);
      let prevVideosLength = categoryDetails.videos.length;
      if (files.length + prevVideosLength > 2) {
        alert("You can only upload a maximum of 2 videos.");
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

  const filterCategory = (categories, categoryIdToFilter) => {
    return categories
      .filter((category) => category._id !== categoryIdToFilter) // Filter out the category if it matches
      .map((category) => ({
        ...category,
        subCategories: filterCategory(
          category.subCategories,
          categoryIdToFilter
        ), // Recursively filter subcategories
      }));
  };

  return (
    <>
      {(!isCategoryLoaded || isSending) && (
        <div className="page-content">
          <div id="status">
            <div className="spinner">
              <i className="ri-loader-line spin-icon"></i>
            </div>
          </div>
        </div>
      )}
      {isCategoryLoaded && !isSending && (
        <div className="page-content">
          <Breadcrumbs
            title={"Update Category"}
            breadcrumbItems={[
              { title: "Categories", link: "/categories" },
              { title: "Update Category", link: "#" },
            ]}
          />
          <Container fluid>
            <MessageModal
              title={"Success!"}
              message={"Category was updated successfully."}
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
                          invalid={formData.description === "" && validateForm}
                          required={true}
                          rows={"4"}
                          placeholder="Eg. We are making this product in below dimentions like 7 inch, 8 inch, 9 inch. Color are like red, blue, green, purples here"
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="mb-5">
                    {(categoryDetails.pdfLink !== null || pdfFile !== null) && (
                      <div className="mb-3">
                        <Card className="mt-1 mb-0 shadow border">
                          <div className="d-flex justify-content-between align-items-center p-2">
                            <div className="d-flex align-items-center">
                              <i className="mdi mdi-pdf-box text-danger display-4 me-2"></i>
                              <div>
                                <p
                                  className="mb-1"
                                  style={{
                                    color: isDarkMode ? "#DADADA" : "black",
                                  }}
                                >
                                  <strong>{`${categoryDetails.categoryName} - Catalogue`}</strong>
                                </p>
                                {pdfFile === null ? (
                                  <a
                                    href={`${CATEGORY_MEDIA_BASEURL}${categoryDetails.pdfLink}`}
                                    className="text-primary fw-bold text-decoration-none"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {"View PDF"}
                                  </a>
                                ) : (
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
                                )}
                              </div>
                            </div>
                            {/* Add remove icon button */}
                            <button
                              type="button"
                              className="btn btn-link text-danger"
                              onClick={() => {
                                setCategoryDetails((prev) => {
                                  return {
                                    ...prev,
                                    pdfLink: null,
                                  };
                                });
                              }}
                            >
                              <i className="mdi mdi-close-circle font-size-24"></i>
                            </button>
                            {/* <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={}
                          >
                            <i className="mdi mdi-close"></i>
                          </button> */}
                          </div>
                        </Card>
                      </div>
                    )}
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="logo">
                        {categoryDetails.pdfLink ? "Change PDF" : "Upload PDF"}
                      </Label>
                      <Input
                        type="file"
                        className="form-control"
                        id="pdfFile"
                        name="pdfFile"
                        accept="application/pdf"
                        onChange={handlePdfFileChange}
                      />
                    </div>
                  </div>
                  {/* <PdfFileComponent
                      label={`${
                        formData.categoryName !== ""
                          ? formData.categoryName + " -"
                          : ""
                      } Catalogue`}
                      baseUrl={CATEGORY_PDF_BASEURL}
                      pdfFile={pdfFile}
                      oldPDF={categoryDetails.pdfLink}
                      handlePdfFileChange={handlePdfFileChange}
                      isUpdate={true}
                    /> */}
                  <ImageList
                    baseUrl={CATEGORY_MEDIA_BASEURL}
                    imagesList={imagesList}
                    oldImages={categoryDetails.images}
                    handleImageFilesChange={handleImageFilesChange}
                    handleImageDelete={handleImageDelete}
                    handleOldImageDelete={(value) => {
                      setCategoryDetails((prevCategoryDetails) => {
                        // Return a new object for companyDetails to avoid direct mutation
                        return {
                          ...prevCategoryDetails,
                          images: prevCategoryDetails.images.filter(
                            (ele) => ele !== value
                          ),
                        };
                      });
                    }}
                  />
                  <VideoList
                    baseUrl={CATEGORY_MEDIA_BASEURL}
                    videosList={videosList}
                    oldVideos={categoryDetails.videos}
                    handleVideoFilesChange={handleVideoFilesChange}
                    handleVideoDelete={handleVideoDelete}
                    handleOldVideoDelete={(value) => {
                      setCategoryDetails((prevCategoryDetails) => {
                        return {
                          ...prevCategoryDetails,
                          videos: prevCategoryDetails.videos.filter(
                            (ele) => ele.video !== value.video
                          ),
                        };
                      });
                    }}
                  />
                  {categoryList.length > 0 && categoryDetails !== null && (
                    <div className="mb-3">
                      <Label className="form-label">All Categories</Label>
                      <UpdateHierachicalCheckBox
                        data={filterCategory(categoryList, categoryId)}
                        parentCategories={categoryDetails.parentCategories}
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
        </div>
      )}
    </>
  );
}
