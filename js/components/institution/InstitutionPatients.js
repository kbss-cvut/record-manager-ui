'use strict';

import React from 'react';
import {Card} from 'react-bootstrap';

import I18nWrapper from '../../i18n/I18nWrapper';
import injectIntl from '../../utils/injectIntl';
import RecordTable from '../record/RecordTable';
import PropTypes from "prop-types";

const InstitutionPatients = (props) => {
    const {recordsLoaded, onEdit} = props;

    return <Card variant='info' className="mt-3">
        <Card.Header className="text-light bg-primary"
                     as="h6">{props.i18n('institution.patients.panel-title')}</Card.Header>
        <Card.Body>
            <RecordTable recordsLoaded={recordsLoaded} handlers={{onEdit: onEdit}} disableDelete={true}/>
        </Card.Body>
    </Card>;
};

InstitutionPatients.propTypes = {
    recordsLoaded: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired
};

export default injectIntl(I18nWrapper(InstitutionPatients));
