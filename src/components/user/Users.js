import React from 'react';
import {Button, Card} from 'react-bootstrap';
import UserTable from './UserTable';
import PropTypes from "prop-types";
import IfInternalAuth from "../misc/oidc/IfInternalAuth";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";
import {useI18n} from "../../hooks/useI18n";

const Users = ({usersLoaded, handlers}) => {
    const {i18n} = useI18n();
    return <Card>
        <Card.Header className="text-light bg-primary" as="h6">
            {i18n('users.panel-title')}
        </Card.Header>
        <Card.Body>
            <PromiseTrackingMask area="users"/>
            {usersLoaded.users && <UserTable users={usersLoaded.users} handlers={handlers}/>}
            <IfInternalAuth>
                <div>
                    <Button variant='primary' size='sm' className="action-button"
                            onClick={handlers.onCreate}>{i18n('users.create-user')}</Button>
                </div>
            </IfInternalAuth>
        </Card.Body>
    </Card>;
};

Users.propTypes = {
    usersLoaded: PropTypes.object,
    handlers: PropTypes.object.isRequired
};

export default Users;
