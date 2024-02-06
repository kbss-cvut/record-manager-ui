import React from "react";
import PropTypes from "prop-types";
import {SortDirection} from "../../constants/DefaultConstants";
import {FaSortDown, FaSortUp, FaSquare} from "react-icons/fa";
import {useI18n} from "../../hooks/useI18n";

export function nextSortState(currentState) {
    if (currentState === SortDirection.DESC) {
        return undefined;
    } else if (currentState === SortDirection.ASC) {
        return SortDirection.DESC;
    } else {
        return SortDirection.ASC;
    }
}

const SortToggle = ({sort, attribute, onToggle}) => {
    const {i18n} = useI18n();
    let Glyph;
    switch (sort) {
        case SortDirection.ASC:
            Glyph = FaSortUp;
            break;
        case SortDirection.DESC:
            Glyph = FaSortDown;
            break;
        default:
            Glyph = FaSquare;
            break;
    }
    return <span className="ml-1 align-text-bottom cursor-pointer" onClick={() => onToggle(attribute)}
                 title={i18n("table.sort.tooltip")}>
        <Glyph/>
    </span>;
};

SortToggle.propTypes = {
    sort: PropTypes.string,
    attribute: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired
};

export default SortToggle;
