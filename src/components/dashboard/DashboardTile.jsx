import React from "react";
import PropTypes from "prop-types";

const DashboardTile = (props) => {
  return (
    <button className="dashboard-tile btn-primary btn" onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </button>
  );
};

DashboardTile.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default DashboardTile;
