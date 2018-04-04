'use strict';

import React from "react";
import {Button, Panel} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import InstitutionMembers from "./InstitutionMembers";
import InstitutionPatients from "./InstitutionPatients";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import HorizontalInput from "../HorizontalInput";

import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import {formatDate} from "../../utils/Utils";
import AlertMessage from "../AlertMessage";
import {LoaderPanel, LoaderSmall} from "../Loader";

/**
 * Institution detail. Editable only for admins.
 */
class Institution extends React.Component {
    static propTypes = {
        institution: React.PropTypes.object,
        institutionLoaded: React.PropTypes.object,
        institutionSaved: React.PropTypes.object,
        institutionMembers: React.PropTypes.object,
        recordsLoaded: React.PropTypes.object,
        handlers: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        userDeleted: React.PropTypes.object,
        showAlert: React.PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    _onChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.value;
        this.props.handlers.onChange(change);
    };

    render() {
        const {showAlert, currentUser, institution, recordsLoaded, institutionLoaded, institutionSaved} = this.props;
        if (!institution && (!institutionLoaded.status || institutionLoaded.status === ACTION_STATUS.PENDING)) {
            return <LoaderPanel header={<span>{this.i18n('institution.panel-title')}</span>}/>;
        } else if(institutionLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('institution.load-error', {error: institutionLoaded.error.message})}/>;
        }
        return <Panel header={<span>{this.i18n('institution.panel-title')}</span>} bsStyle='primary'>
            <form className='form-horizontal' style={{margin: '0.5em 0 1.5em 0'}}>
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' name='name' label={this.i18n('institution.name')}
                                         value={institution.name} readOnly={currentUser.role !== ROLE.ADMIN}
                                         labelWidth={3} inputWidth={8} onChange={this._onChange}/>
                    </div>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' name='emailAddress' label={this.i18n('institution.email')}
                               value={institution.emailAddress} readOnly={currentUser.role !== ROLE.ADMIN}
                               labelWidth={3} inputWidth={8} onChange={this._onChange}/>
                    </div>
                </div>
                {this._renderAddedDate()}
                {this._renderButtons()}
                {showAlert && institutionSaved.status === ACTION_STATUS.ERROR &&
                <AlertMessage type={ALERT_TYPES.DANGER}
                              message={this.props.formatMessage('institution.save-error', {error: this.i18n(institutionSaved.error.message)})}/>}
                {showAlert && institutionSaved.status === ACTION_STATUS.SUCCESS &&
                <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('institution.save-success')}/>}
            </form>
            {!this.props.institution.isNew && this._renderMembers()}
            {!this.props.institution.isNew && <InstitutionPatients recordsLoaded={recordsLoaded} onEdit={this.props.handlers.onEditPatient}/>}
        </Panel>;
    }

    _renderAddedDate() {
        const { institution } = this.props;
        if (institution.isNew || !institution.dateCreated) {
            return null;
        }
        const created = formatDate(institution.dateCreated);
        return <div className='row'>
            <div className='col-xs-6'>
                <div className='notice-small'>
                    <FormattedMessage id='institution.created' values={{date: created}}/>
                </div>
            </div>
        </div>
    }

    _renderButtons() {
        const { currentUser, handlers, institutionSaved } = this.props;
        if (currentUser.role !== ROLE.ADMIN) {
            return <div className='row'>
                <div className='col-xs-1'>
                    <Button bsStyle='primary' bsSize='small' onClick={handlers.onCancel}>{this.i18n('back')}</Button>
                </div>
            </div>;
        } else {
            return <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
                <Button bsStyle='success' bsSize='small' ref='submit'
                        disabled={this.props.institutionSaved.status === ACTION_STATUS.PENDING}
                        onClick={handlers.onSave}>{this.i18n('save')}
                        {institutionSaved.status === ACTION_STATUS.PENDING && <LoaderSmall />}</Button>
                <Button bsStyle='link' bsSize='small' onClick={handlers.onCancel}>{this.i18n('cancel')}</Button>
            </div>;
        }
    }

    _renderMembers() {
        const { institution, handlers, currentUser, institutionMembers, userDeleted } = this.props;
        return <InstitutionMembers institution={institution} institutionMembers={institutionMembers}
                                   onDelete={handlers.onDelete} onEditUser={handlers.onEditUser} userDeleted={userDeleted}
                                   onAddNewUser={handlers.onAddNewUser} currentUser={currentUser}/>
    }
}

export default injectIntl(I18nWrapper(Institution));
