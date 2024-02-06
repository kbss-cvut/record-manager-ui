import React from 'react';
import {Button, Card} from 'react-bootstrap';
import InstitutionTable from './InstitutionTable';
import {ACTION_STATUS} from "../../constants/DefaultConstants";
import {LoaderSmall} from "../Loader";
import PropTypes from "prop-types";
import {useI18n} from "../../hooks/useI18n";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";

const Institutions = ({institutionsLoaded, handlers, institutionDeleted}) => {
    const {i18n} = useI18n();

    return <Card variant='primary'>
        <Card.Header className="text-light bg-primary" as="h6">
            {i18n('institutions.panel-title')}
            {institutionsLoaded.status === ACTION_STATUS.PENDING && <LoaderSmall/>}
        </Card.Header>
        <Card.Body>
            <PromiseTrackingMask area="institutions"/>
            <InstitutionTable institutions={institutionsLoaded.institutions || []} handlers={handlers}
                              institutionDeleted={institutionDeleted}/>
            <div>
                <Button variant='primary' size='sm' className='action-button'
                        onClick={handlers.onCreate}>{i18n('institutions.create-institution')}</Button>
            </div>
        </Card.Body>
    </Card>
};

Institutions.propTypes = {
    institutionsLoaded: PropTypes.object,
    handlers: PropTypes.object.isRequired,
    institutionDeleted: PropTypes.object
};

export default Institutions;
