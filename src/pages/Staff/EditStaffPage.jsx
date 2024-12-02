import { useEffect, useRef, useState } from "react";
import useHttp from "../../hooks/useHttp";
import { APIRoutes, BASEURL } from "../../configs/globalConfig";
import { useNavigate, useParams } from "react-router-dom";
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
import Breadcrumbs from "../../components/Breadcrumb";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import MessageModal from "../../components/UI/MessageModal";
import InputField from "../../components/UI/InputField";
import axios from "axios";

const requestConfig = {
  method: "POST", // Use PATCH for updating existing data
  headers: {
    "Content-Type": "application/json",
  },
};

export default function EditStaffPage() {
  const navigate = useNavigate();
  const { staffId } = useParams(); // Get staffId from the URL
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
    password: "",
  });
  const [validateForm, setValidateForm] = useState(false);

  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const formRef = useRef(null);
  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
    clearError,
  } = useHttp(`${BASEURL}${APIRoutes.updateStaff}?staffId=${staffId}`, requestConfig); // Use the edit staff API

  // Fetch staff details on mount
  // useEffect(() => {
  //   async function fetchStaffDetails() {
  //     try {
  //       const response = await axios.get(
  //         `${BASEURL}${APIRoutes.getStaffDetails}?staffId=${staffId}`
  //       );
  //       if (response.status === 200 && response.data.success) {
  //         const { name, emailId, permissions } = response.data.staffDetails;
  //         setFormData({ name, emailId, password: "" }); // Do not set the password from API
  //         setSelectedPermissions(permissions); // Set selected permissions
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch staff details:", error);
  //     }
  //   }

  //   fetchStaffDetails();
  // }, [staffId]);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getStaffDetails}?staffId=${staffId}`
        );
        if (response.status === 200 && response.data.success) {
          const staffData = response.data.staffDetails;
          const { name, emailId, password } = staffData;
          setFormData({ name, emailId, password }); // Do not set the password from API
          // Transform the permissions
          const permissionMap = {}; // To group sub-permissions by group

          // Map through the permissions to create the desired structure
          staffData.permissions.forEach((perm) => {
            const groupId = perm.groupPermissionId;

            if (!permissionMap[groupId]) {
              permissionMap[groupId] = {
                _id: groupId,
                name: perm.groupPermissionName,
                alias: perm.groupPermissionAlias,
                groupId: null,
                subPermissions: [],
              };
            }

            permissionMap[groupId].subPermissions.push({
              _id: perm.permissionId,
              name: perm.permissionName,
              alias: perm.permissionAlias,
              groupId: groupId,
            });
          });

          // Convert the permissionMap object into an array
          const transformedPermissions = Object.values(permissionMap);
          setPermissions(transformedPermissions);

          // Set the selectedPermissions based on the staff's permissions
          setSelectedPermissions(
            staffData.permissions.map((perm) => ({
              _id: perm.permissionId,
              name: perm.permissionName,
              alias: perm.permissionAlias,
              groupId: perm.groupPermissionId,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching staff details:", error);
      }
    };
    fetchStaffDetails();
  }, [staffId]);

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

    if (!emailRegex.test(formData.emailId)) {
      return;
    }

    const permissionsPayload = selectedPermissions.map((perm) => ({
      permissionId: perm._id,
      permissionName: perm.name,
      permissionAlias: perm.alias,
      groupPermissionId: perm.groupId,
      groupPermissionName: perm.groupId
        ? permissions.find((group) => group._id === perm.groupId)?.name
        : null,
      groupPermissionAlias: perm.groupId
        ? permissions.find((group) => group._id === perm.groupId)?.alias
        : null,
    }));

    const requestBody = {
      ...formData,
      permissions: permissionsPayload,
    };

    sendRequest(JSON.stringify(requestBody));
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePermissionChange = (permission) => {
    setSelectedPermissions(
      (prev) =>
        prev.includes(permission)
          ? prev.filter((perm) => perm._id !== permission._id) // Use the object to filter
          : [...prev, permission] // Add the entire permission object
    );
  };

  function handleFinish() {
    setIsMessageModalOpen(false);
    clearData();
    if (formRef.current) {
      formRef.current.reset();
    }
    navigate("/staff-list");
  }

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

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getAllPermissionsList}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            const staffPermissionsList = response.data.staffPermissionsList.map(
              (item, index) => ({
                ...item,
                id: index + 1,
              })
            );
            setPermissions(staffPermissionsList);
          }
        }
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    }

    fetchPermissions();
  }, []);

  let actions = (
    <div className="mt-2" style={{ textAlign: "center" }}>
      <Button
        type="button"
        color="primaryPurple"
        className="waves-effect waves-light"
        onClick={handleSubmit}
      >
        Update Staff
      </Button>
      <span className="ms-2"></span>
      <Button
        type="button"
        onClick={() => {
          navigate("/staff-list");
        }}
        color="secondary"
      >
        Cancel
      </Button>
    </div>
  );

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
            title={"Edit Staff"}
            breadcrumbItems={[
              { title: "Staffs", link: "/staff-list" },
              { title: "Edit Staff", link: "#" },
            ]}
          />
          <Container fluid>
            <MessageModal
              title={"Success!"}
              message={"Staff details were updated successfully."}
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
                    <Col>
                      <InputField
                        id="name"
                        name="name"
                        label="Name"
                        defaultValue={formData.name}
                        invalid={formData.name === "" && validateForm}
                        required={true}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <InputField
                        id="emailId"
                        name="emailId"
                        label="Email"
                        type="email"
                        defaultValue={formData.emailId}
                        invalid={formData.emailId === "" && validateForm}
                        emailInvalid={
                          formData.emailId !== "" &&
                          !emailRegex.test(formData.emailId) &&
                          validateForm
                        }
                        required
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col>
                      <InputField
                        id="password"
                        name="password"
                        label="Password"
                        type="text"
                        defaultValue={formData.password}
                        invalid={formData.password === "" && validateForm}
                        required
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>

                  {/* Render permissions with checkboxes */}
                  <div className="mt-1">
                    <Row>
                      <Col>
                        <h5>Permissions</h5>
                        {permissions.map((group) => (
                          <div key={group._id} style={{ marginLeft: 10 }}>
                            <Label>
                              {group.id}. {group.name}
                            </Label>
                            {group.subPermissions.map((sub) => (
                              <div key={sub._id} style={{ marginLeft: 25 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div className="form-check mb-2">
                                    <Label
                                      className="form-check-label"
                                      htmlFor={`checkbox_${sub._id}`}
                                    >
                                      {sub.name}
                                    </Label>
                                    <Input
                                      type="checkbox"
                                      className="form-check-input input-mini"
                                      id={`checkbox_${sub._id}`}
                                      checked={selectedPermissions.some(
                                        (perm) => perm._id === sub._id
                                      )}
                                      onChange={() =>
                                        handlePermissionChange(sub)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </Col>
                    </Row>
                  </div>
                  {actions}
                </form>
              </CardBody>
            </Card>
          </Container>
        </div>
      )}
    </>
  );
}
