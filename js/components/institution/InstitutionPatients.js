'use strict';

import React from 'react';
import {Panel} from 'react-bootstrap';

import I18nWrapper from '../../i18n/I18nWrapper';
import injectIntl from '../../utils/injectIntl';
import RecordTable from '../record/RecordTable';
import PropTypes from "prop-types";

const InstitutionPatients = (props) => {
    const { recordsLoaded, onEdit } = props;

    return <Panel header={<span>{props.i18n('institution.patients.panel-title')}</span>} bsStyle='info'>
        <RecordTable recordsLoaded={recordsLoaded} handlers={{onEdit: onEdit}} disableDelete={true} />
    </Panel>;
};

InstitutionPatients.propTypes = {
    recordsLoaded: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired
};

export default injectIntl(I18nWrapper(InstitutionPatients));
