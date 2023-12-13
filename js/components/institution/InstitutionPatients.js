'use strict';

import React from 'react';
import {Button, Card} from 'react-bootstrap';

import withI18n from '../../i18n/withI18n';
import {injectIntl} from "react-intl";
import RecordTable from '../record/RecordTable';
import PropTypes from "prop-types";

const InstitutionPatients = (props) => {
    const {recordsLoaded, formTemplatesLoaded, onEdit, currentUser} = props;

    return <Card variant='info' className="mt-3">
        <Card.Header className="text-light bg-primary"
                     as="h6">{props.i18n('institution.patients.panel-title')}</Card.Header>
        <Card.Body>
            <RecordTable recordsLoaded={recordsLoaded}
                         formTemplatesLoaded={formTemplatesLoaded}
                         handlers={{onEdit: onEdit}}
                         disableDelete={true}
                         currentUser={currentUser}/>
            <div className="d-flex justify-content-end">
                <Button className="mx-1" variant='primary' size='sm'>{props.i18n('export')}</Button>
            </div>
        </Card.Body>
    </Card>;
};

InstitutionPatients.propTypes = {
    recordsLoaded: PropTypes.object.isRequired,
    formTemplatesLoaded: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired
};

export default injectIntl(withI18n(InstitutionPatients));
