'use strict';

import React from 'react';
import {Panel} from 'react-bootstrap';

import I18nWrapper from '../../i18n/I18nWrapper';
import injectIntl from '../../utils/injectIntl';
import RecordTable from '../record/RecordTable';

const InstitutionPatients = (props) => {
    var patients = props.patients;
    if (patients.length === 0) {
        return null;
    }

    return <Panel header={<h3>{props.i18n('institution.patients.panel-title')}</h3>} bsStyle='info'>
        <RecordTable records={patients} handlers={{onEdit: props.onEdit}} disableDelete={true}/>
    </Panel>;
};

InstitutionPatients.propTypes = {
    patients: React.PropTypes.array.isRequired,
    onEdit: React.PropTypes.func.isRequired
};

export default injectIntl(I18nWrapper(InstitutionPatients));
