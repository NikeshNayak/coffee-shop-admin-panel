import React from "react";
import SimpleBar from "simplebar-react";
import SidebarContent from "./SidebarContent";
import withRouter from "../components/withRouter";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { leftSideBarType } = useSelector((state) => state.Layout);

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          {leftSideBarType !== "condensed" ? (
            <SimpleBar style={{ maxHeight: "100%" }}>
              <SidebarContent />
            </SimpleBar>
          ) : (
            <SidebarContent />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Sidebar);
