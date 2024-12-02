import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Col, Card, CardBody, Row } from "reactstrap";

const MiniWidgets = ({ reports }) => {
  const navigate = useNavigate();

  const theme = useSelector((state) => state.Layout.theme);
  const isDarkMode = theme === "dark";

  return (
    <Row className="d-flex">
      {reports.map((report, key) => (
        <Col
          key={key}
          className="d-flex flex-grow-1"
          style={{ maxWidth: "33.33%" }}
        >
          <Link
            to={report.link}
            style={{ textDecoration: "none", width: "100%" }}
          >
            <Card
              className="w-100"
              style={{
                borderRadius: "12px",
              }}
            >
              <CardBody>
                <div className="d-flex">
                  <div className="flex-1 overflow-hidden">
                    <p
                      className="text-truncate font-size-18 mb-2"
                      style={{ color: isDarkMode ? "#DADADA" : "black" }}
                    >
                      {report.title}
                    </p>
                    <h2 className="mb-0">{report.value}</h2>
                  </div>
                  <div className="text-primaryPurple">
                    <i className={report.icon}></i>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default MiniWidgets;
