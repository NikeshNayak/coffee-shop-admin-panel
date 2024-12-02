import classname from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { Col, Collapse, Container, Row } from "reactstrap";
import SimpleBar from "simplebar-react";
import { useSelector } from "react-redux";

export default function NavBar() {
  const layout = useSelector((state) => state.Layout);

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          <SimpleBar style={{ maxHeight: "100%" }}>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li className="menu-title">{"Menu"}</li>

                <li>
                  <Link to="/dashboard" className="waves-effect">
                    <i className="ri-dashboard-line"></i>
                    <span className="badge rounded-pill bg-success float-end">
                      3
                    </span>
                    <span className="ms-1">{"Dashboard"}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/calendar" className=" waves-effect">
                    <i className="ri-calendar-2-line"></i>
                    <span className="ms-1">{"Calendar"}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/chat" className=" waves-effect">
                    <i className="ri-chat-1-line"></i>
                    <span className="ms-1">{"Chat"}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="ri-store-2-line"></i>
                    <span className="ms-1">{"Ecommerce"}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/ecommerce-products">{"Products"}</Link>
                    </li>
                    <li>
                      <Link to="/ecommerce-product-detail/1">
                        {"Product Detail"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/ecommerce-orders">{"Orders"}</Link>
                    </li>
                    <li>
                      <Link to="/ecommerce-customers">{"Customers"}</Link>
                    </li>
                    <li>
                      <Link to="/ecommerce-cart">{"Cart"}</Link>
                    </li>
                    <li>
                      <Link to="/ecommerce-checkout">{"Checkout"}</Link>
                    </li>
                    <li>
                      <Link to="/ecommerce-shops">{"Shops"}</Link>
                    </li>
                    <li>
                      <Link to="/ecommerce-add-product">{"Add Product"}</Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="ri-mail-send-line"></i>
                    <span className="ms-1">{"Email"}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/email-inbox">{"Inbox"}</Link>
                    </li>
                    <li>
                      <Link to="/email-read">{"Read Email"}</Link>
                    </li>
                  </ul>
                </li>

                <li className="menu-title">{"Pages"}</li>

                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="ri-account-circle-line"></i>
                    <span className="ms-1">{"Authentication"}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/login">{"Login"}</Link>
                    </li>
                    <li>
                      <Link to="/register">{"Register"}</Link>
                    </li>
                    <li>
                      <Link to="/forgot-password">{"Recover Password"}</Link>
                    </li>
                    <li>
                      <Link to="/lock-screen">{"Lock Screen"}</Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="ri-profile-line"></i>
                    <span className="ms-1">{"Utility"}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/starter">{"Starter Page"}</Link>
                    </li>
                    <li>
                      <Link to="/maintenance">{"Maintenance"}</Link>
                    </li>
                    <li>
                      <Link to="/comingsoon">{"Coming Soon"}</Link>
                    </li>
                    <li>
                      <Link to="/timeline">{"Timeline"}</Link>
                    </li>
                    <li>
                      <Link to="/faqs">{"FAQs"}</Link>
                    </li>
                    <li>
                      <Link to="/pricing">{"Pricing"}</Link>
                    </li>
                    <li>
                      <Link to="/404">{"Error 404"}</Link>
                    </li>
                    <li>
                      <Link to="/500">{"Error 500"}</Link>
                    </li>
                  </ul>
                </li>

                <li className="menu-title">{"Components"}</li>

                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="ri-pencil-ruler-2-line"></i>
                    <span className="ms-1">{"UI Elements"}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/ui-alerts">{"Alerts"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-buttons">{"Buttons"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-cards">{"Cards"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-carousel">{"Carousel"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-dropdowns">{"Dropdowns"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-grid">{"Grid"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-images">{"Images"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-lightbox">{"Lightbox"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-modals">{"Modals"}</Link>
                    </li>
                    {/* <li><Link to="/ui-offcanvas">{"Offcanvas"}</Link></li> */}
                    <li>
                      <Link to="/ui-rangeslider">{"Range Slider"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-roundslider">{"Round Slider"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-session-timeout">{"Session Timeout"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-progressbars">{"Progress Bars"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-tabs-accordions">
                        {"Tabs & Accordions"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/ui-typography">{"Typography"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-video">{"Video"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-general">{"General"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-rating">{"Rating"}</Link>
                    </li>
                    <li>
                      <Link to="/ui-notifications">{"Notifications"}</Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="waves-effect">
                    <i className="ri-eraser-fill"></i>
                    <span className="badge rounded-pill bg-danger float-end">
                      6
                    </span>
                    <span className="ms-1">{"Forms"}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/form-elements">{"Form Elements"}</Link>
                    </li>
                    <li>
                      <Link to="/form-validation">{"Form Validation"}</Link>
                    </li>
                    <li>
                      <Link to="/form-advanced">{"Form Advanced Plugins"}</Link>
                    </li>
                    <li>
                      <Link to="/form-editors">{"Form Editors"}</Link>
                    </li>
                    <li>
                      <Link to="/form-file-upload">{"Form File Upload"}</Link>
                    </li>
                    <li>
                      <Link to="/form-xeditable">{"Form X-editable"}</Link>
                    </li>
                    <li>
                      <Link to="/form-wizard">{"Form Wizard"}</Link>
                    </li>
                    <li>
                      <Link to="/form-mask">{"Form Mask"}</Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="ri-table-2"></i>
                    <span className="ms-1">{"Tables"}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/basic-tables">{"Basic Tables"}</Link>
                    </li>
                    <li>
                      <Link to="/datatable-table">{"Data Tables"}</Link>
                    </li>
                    <li>
                      <Link to="/responsive-table">{"Responsive Table"}</Link>
                    </li>
                    <li>
                      <Link to="/editable-table">{"Editable Table"}</Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="ri-bar-chart-line"></i>
                    <span className="ms-1">{"Charts"}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/apex-charts">{"Apex Charts"}</Link>
                    </li>
                    <li>
                      <Link to="/chartjs">{"Chartjs Charts"}</Link>
                    </li>
                    <li>
                      <Link to="/charts-knob">{"Jquery Knob Charts"}</Link>
                    </li>
                    <li>
                      <Link to="/charts-sparkline">{"Sparkline Charts"}</Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="ri-brush-line"></i>
                    <span className="ms-1">{"Icons"}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/icons-remix">{"Remix Icons"}</Link>
                    </li>
                    <li>
                      <Link to="/material-design">{"Material Design"}</Link>
                    </li>
                    <li>
                      <Link to="/dripicons">{"Dripicons"}</Link>
                    </li>
                    <li>
                      <Link to="/font-awesome-5">{"Font awesome 5"}</Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="ri-map-pin-line"></i>
                    <span className="ms-1">{"Maps"}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/google-maps">{"Google Maps"}</Link>
                    </li>
                    <li>
                      <Link to="/vector-maps">{"Vector Maps"}</Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="ri-share-line"></i>
                    <span className="ms-1">{"Multi Level"}</span>
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/#">{"Level 1.1"}</Link>
                    </li>
                    <li>
                      <Link to="/#" className="has-arrow">
                        {"Level 1.2"}
                      </Link>
                      <ul className="sub-menu">
                        <li>
                          <Link to="/#">{"Level 2.1"}</Link>
                        </li>
                        <li>
                          <Link to="/#">{"Level 2.2"}</Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </SimpleBar>
        </div>
      </div>
    </React.Fragment>
  );
}
