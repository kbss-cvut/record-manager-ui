import React from "react";
import PropTypes from "prop-types";
import {sanitizeArray} from "../../utils/Utils";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {ExportType} from "../../constants/ExportType";
import {useI18n} from "../../hooks/useI18n";

const ExportRecordsDropdown = ({records, onExport}) => {
    const {i18n} = useI18n();
    if (sanitizeArray(records).length === 0) {
        return null;
    }
    return <DropdownButton id="records-export" title={i18n("records.export")} size="sm" variant="primary"
                           className="action-button">
        {/* Excel export is currently not supported by the backend
        <Dropdown.Item onClick={() => onExport(ExportType.EXCEL)}>{i18n("records.export.excel")}</Dropdown.Item>*/}
        <Dropdown.Item onClick={() => onExport(ExportType.JSON)}>{i18n("records.export.json")}</Dropdown.Item>
    </DropdownButton>;
}

ExportRecordsDropdown.propTypes = {
    records: PropTypes.array,
    onExport: PropTypes.func.isRequired
};

export default ExportRecordsDropdown;
