'use strict';

import React from "react";
import {Button, Panel} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import InstitutionMembers from "./InstitutionMembers";
import InstitutionPatients from "./InstitutionPatients";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import HorizontalInput from "../HorizontalInput";
import Mask from "../Mask";
import Routing, {transitionTo} from "../../utils/Routing";
import Routes from "../../utils/Routes";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import {formatDate} from "../../utils/Utils";
import AlertMessage from "../AlertMessage";

/**
 * Institution detail. Editable only for admins.
 */
class Institution extends React.Component {
    static propTypes = {
        institution: React.PropTypes.object,
        institutionLoaded: React.PropTypes.object,
        institutionSaved: React.PropTypes.object,
        loading: React.PropTypes.bool,
        members: React.PropTypes.array,
        patients: React.PropTypes.array,
        handlers: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
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
        const {loading, showAlert, currentUser, institution, patients, institutionLoaded, institutionSaved} = this.props;
        if (loading) {
            return <Mask text={this.i18n('please-wait')}/>;
        }
        if (institutionLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('institution.load-error', {error: institutionLoaded.error.message})}/>;
        }
        return <Panel header={<h3>{this.i18n('institution.panel-title')}</h3>} bsStyle='primary'>
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
                              message={this.props.formatMessage('institution.save-error', {error: institutionSaved.error.message})}/>}
                {showAlert && institutionSaved.status === ACTION_STATUS.SUCCESS &&
                <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.props.i18n('institution.save-success')}/>}
            </form>
            {!this.props.institution.isNew && institutionLoaded.status === ACTION_STATUS.SUCCESS && this._renderMembers()}
            <InstitutionPatients patients={patients} onEdit={this.props.handlers.onEditPatient}/>
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
        const { loading, currentUser, handlers, institutionSaved } = this.props;
        if (currentUser.role !== ROLE.ADMIN) {
            return <div className='row'>
                <div className='col-xs-1'>
                    <Button bsStyle='primary' bsSize='small' onClick={handlers.onCancel}>{this.i18n('back')}</Button>
                </div>
            </div>;
        } else {
            return <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
                <Button bsStyle='success' bsSize='small' ref='submit'
                        disabled={loading || this.props.institutionSaved.status === ACTION_STATUS.PENDING}
                        onClick={handlers.onSave}>{this.i18n('save')}
                        {institutionSaved.status === ACTION_STATUS.PENDING && <div className="loader"></div>}</Button>
                <Button bsStyle='link' bsSize='small' onClick={handlers.onCancel}>{this.i18n('cancel')}</Button>
            </div>;
        }
    }

    _renderMembers() {
        const { institution, handlers, currentUser } = this.props;
        const members = institution.members ? institution.members : this.props.members;
        return <InstitutionMembers institution={institution} members={members} onDelete={handlers.onDelete}
                                   onEditUser={handlers.onEditUser} onAddNewUser={handlers.onAddNewUser}
                                   currentUser={currentUser}/>
    }
}

export default injectIntl(I18nWrapper(Institution));
