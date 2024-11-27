import React from "react";
import { useI18n } from "../../hooks/useI18n";
import classNames from "classnames";
import { FaFilter } from "react-icons/fa";
import { sanitizeArray } from "../../utils/Utils";
import PropTypes from "prop-types";

const FilterIndicator = ({ filterValue }) => {
  const { i18n } = useI18n();
  const classes = classNames("ms-1", { invisible: sanitizeArray(filterValue).length === 0 });
  return <FaFilter className={classes} title={i18n("filters.active.tooltip")} />;
};

FilterIndicator.propTypes = {
  filterValue: PropTypes.array,
};

export default FilterIndicator;
