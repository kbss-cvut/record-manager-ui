'use strict';

import React from 'react';
import {Button, Card} from 'react-bootstrap';
import {injectIntl} from "react-intl";
import withI18n from '../../i18n/withI18n';
import UserTable from './UserTable';
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {LoaderPanel, LoaderSmall} from "../Loader";
import PropTypes from "prop-types";

class Users extends React.Component {
    static propTypes = {
        usersLoaded: PropTypes.object,
        handlers: PropTypes.object.isRequired,
        userDeleted: PropTypes.object,
        showAlert: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        const {usersLoaded, showAlert, userDeleted} = this.props;
        if (!usersLoaded.users && (!usersLoaded.status || usersLoaded.status === ACTION_STATUS.PENDING)) {
            return <LoaderPanel header={this.i18n('users.panel-title')}/>;
        } else if (usersLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('users.loading-error', {error: usersLoaded.error.message})}/>
        }
        return <Card>
            <Card.Header className="text-light bg-primary" as="h6">
                {this.i18n('users.panel-title')}
                {this.props.usersLoaded.status === ACTION_STATUS.PENDING && <LoaderSmall/>}
            </Card.Header>
            <Card.Body>
                <UserTable users={usersLoaded.users}{...this.props}/>
                <div>
                    <Button variant='primary' size='sm'
                            onClick={this.props.handlers.onCreate}>{this.i18n('users.create-user')}</Button>
                </div>
                {showAlert && userDeleted.status === ACTION_STATUS.ERROR &&
                <AlertMessage type={ALERT_TYPES.DANGER}
                              message={this.props.formatMessage('user.delete-error', {error: this.i18n(this.props.userDeleted.error.message)})}/>}
                {showAlert && userDeleted.status === ACTION_STATUS.SUCCESS &&
                <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('user.delete-success')}/>}
            </Card.Body>
        </Card>;
    }

    _renderHeader() {
        return <span>
            {this.i18n('users.panel-title')}{this.props.usersLoaded.status === ACTION_STATUS.PENDING && <LoaderSmall/>}
        </span>;
    }
}

export default injectIntl(withI18n(Users));
