import { useEffect, useState } from "react";
import {
  APIRoutes,
  BASEURL,
  formatToLocalTime,
} from "../../configs/globalConfig";
import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import Breadcrumbs from "../../components/Breadcrumb";
import CustomSnackBar from "../../components/UI/CustomSnackBar";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function ViewStaffPage() {
  const { staffId } = useParams(); // Extract staffId from the URL
  const [staffDetails, setStaffDetails] = useState(null); // State to store staff details
  const [isLoaded, setIsLoaded] = useState(false);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });
  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    // Fetch the staff details when the component mounts
    async function fetchStaffDetails() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getStaffDetails}?staffId=${staffId}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            setIsLoaded(true);
            const permissionMap = {}; // To group sub-permissions by group

            // Map through the permissions to create the desired structure
            response.data.staffDetails.permissions.forEach((perm) => {
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
              response.data.staffDetails.permissions.map((perm) => ({
                _id: perm.permissionId,
                name: perm.permissionName,
                alias: perm.permissionAlias,
                groupId: perm.groupPermissionId,
              }))
            );
            setStaffDetails(response.data.staffDetails);
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
        console.error("Failed to fetch staff details:", error);
        setIsLoaded(true);
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      }
    }
    fetchStaffDetails();
  }, [staffId]);

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

  return (
    <>
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
        <div className="page-content">
          <Breadcrumbs
            title={"View Staff"}
            breadcrumbItems={[
              { title: "Staff", link: "/staff" },
              { title: "View Staff", link: "#" },
            ]}
          />
          <Container fluid>
            <CustomSnackBar
              snackBarMsg={snackBarMsg}
              setSnackMsg={setSnackMsg}
            />
            {staffDetails && (
              <Card>
                <CardBody>
                  <div>
                    <div className="mb-2">
                      <Row>
                        <Col>
                          <Label className="form-label">STAFF NAME</Label>
                          <p
                            style={{ color: isDarkMode ? "#DADADA" : "black" }}
                          >
                            {staffDetails.name}
                          </p>
                        </Col>
                        <Col>
                          <Label className="form-label">EMAIL ID</Label>
                          <p
                            style={{ color: isDarkMode ? "#DADADA" : "black" }}
                          >
                            {staffDetails.emailId}
                          </p>
                        </Col>
                      </Row>
                    </div>

                    <div className="mt-1">
                      <div className="mt-1">
                        <Row>
                          <Col>
                            <h5>Permissions</h5>
                            {permissions.map((group) => {
                              // Check if any sub-permissions are selected
                              const hasSelectedSubPermissions =
                                group.subPermissions.some((sub) =>
                                  selectedPermissions.some(
                                    (perm) => perm._id === sub._id
                                  )
                                );

                              // Only render the group if it has selected sub-permissions
                              if (!hasSelectedSubPermissions) {
                                return null;
                              }
                              return (
                                <div key={group._id} style={{ marginLeft: 10 }}>
                                  <Label>
                                    {group.id}. {group.name}
                                  </Label>
                                  {group.subPermissions.map((sub) => {
                                    if (
                                      !selectedPermissions.some(
                                        (perm) => perm._id === sub._id
                                      )
                                    ) {
                                      return <div></div>;
                                    }
                                    return (
                                      <div
                                        key={sub._id}
                                        style={{ marginLeft: 25 }}
                                      >
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
                                              onChange={null}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </Container>
        </div>
      )}
    </>
  );
}
