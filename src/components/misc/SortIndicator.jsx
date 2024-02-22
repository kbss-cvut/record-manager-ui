import React from "react";
import PropTypes from "prop-types";
import {SortDirection} from "../../constants/DefaultConstants";
import {useI18n} from "../../hooks/useI18n";
import {FaArrowDownShortWide, FaArrowDownUpAcrossLine, FaArrowDownWideShort} from "react-icons/fa6";

const SortIndicator = ({direction}) => {
    const {i18n} = useI18n();
    let Glyph;
    switch (direction) {
        case SortDirection.ASC:
            Glyph = FaArrowDownShortWide;
            break;
        case SortDirection.DESC:
            Glyph = FaArrowDownWideShort;
            break;
        default:
            Glyph = FaArrowDownUpAcrossLine;
            break;
    }
    return <span className="ml-1" title={i18n("table.sort.tooltip")}>
        <Glyph/>
    </span>;
};

SortIndicator.propTypes = {
    direction: PropTypes.string
};

export default SortIndicator;
