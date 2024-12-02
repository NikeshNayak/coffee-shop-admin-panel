/* eslint-disable jsx-a11y/anchor-is-valid */
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Breadcrumb";
import MiniWidgets from "../MiniWidgets";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  APIRoutes,
  BASEURL,
  formatToLocalTime,
} from "../../configs/globalConfig";

import { useNavigate } from "react-router-dom";
import DashboardCompanyList from "./DashboardCompanyList";
import DashboardAgentList from "./DasboardAgentList";
import CatalogueChart from "./Catalogue/CatalogueChart";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [snackBarMsg, setSnackMsg] = useState({
    isOpen: false,
    isSuccess: null,
    message: "",
  });
  const [dashboardDetails, setDashboardDetails] = useState(null); // State to store company detailsx
  const [reportsList, setReportsList] = useState([]);

  const { staffDetails } = useSelector((state) => state.staffDetails);

  const hasGroupPermission = (permissionAlias) =>
    staffDetails?.permissions?.some(
      (perm) => perm.groupPermissionAlias === permissionAlias
    ) || false;

  useEffect(() => {
    // Fetch the company details when the component mounts

    async function fetchDasboardDetails() {
      try {
        const response = await axios.get(
          `${BASEURL}${APIRoutes.getDashboardData}`
        );
        if (response.status === 200) {
          if (response.data.success === true) {
            setIsLoaded(true);
            setDashboardDetails(response.data);
            let reports = [];
            // {
            //   icon: "ri-stack-line",
            //   title: "Number of Sales",
            //   value: "1452",
            //   rate: "2.4%",
            //   desc: "From previous period",
            // },
            // {
            //   icon: "ri-store-2-line",
            //   title: "Sales Revenue",
            //   value: "$ 38452",
            //   rate: "2.4%",
            //   desc: "From previous period",
            // },
            // {
            //   icon: "ri-briefcase-4-line",
            //   title: "Average Price",
            //   value: "$ 15.4",
            //   rate: "2.4%",
            //   desc: "From previous period",
            // },
            reports.push({
              icon: "ri-customer-service-fill  display-4",
              title: "Total Agents",
              value: response.data.totalAgents,
              link: "/agents",
            });
            reports.push({
              icon: "ri-building-4-fill display-4",
              title: "Total Companies",
              value: response.data.totalCompanies,
              link: "/companies",
            });
            reports.push({
              icon: "mdi mdi-pdf-box display-3",
              title: "Total Catalogue Sent",
              value: response.data.totalCatalogues,
              link: "/dashboard",
            });
            setReportsList(reports);
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
        console.error("Failed to fetch dashboard details:", error);
        setIsLoaded(true);
        setSnackMsg({
          isOpen: true,
          isSuccess: false,
          message: error.message,
        });
      }
    }
    fetchDasboardDetails();
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
          <Container fluid>
            <Breadcrumbs title="Dashboard" breadcrumbItems={[]} />
            {(hasGroupPermission("reports") ||
              staffDetails?.userType === "SUPERADMIN") && (
              <Row>
                <Col xl={12}>
                  <Row>
                    <MiniWidgets reports={reportsList} />
                  </Row>
                </Col>
              </Row>
            )}
            {(hasGroupPermission("reports") ||
              staffDetails?.userType === "SUPERADMIN") && <CatalogueChart />}
            {(hasGroupPermission("companies") ||
              staffDetails?.userType === "SUPERADMIN") && <DashboardCompanyList />}
            {(hasGroupPermission("agents") ||
              staffDetails?.userType === "SUPERADMIN") && <DashboardAgentList />}
          </Container>
        </div>
      )}
    </>
  );
}
