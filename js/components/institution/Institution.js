'use strict';

import React from "react";
import {Button, Panel} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import Authentication from "../../utils/Authentication";
import InstitutionMembers from "./InstitutionMembers";
import InstitutionPatients from "./InstitutionPatients";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import HorizontalInput from "../HorizontalInput";
import Mask from "../Mask";
import Routing from "../../utils/Routing";
import Routes from "../../utils/Routes";
import Utils from "../../utils/Utils";

/**
 * Institution detail. Editable only for admins.
 */
class Institution extends React.Component {
    static propTypes = {
        institution: React.PropTypes.object,
        loading: React.PropTypes.bool,
        members: React.PropTypes.array,
        patients: React.PropTypes.array,
        onSave: React.PropTypes.func.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onEditUser: React.PropTypes.func.isRequired,
        onAddNewUser: React.PropTypes.func.isRequired,
        onAddExistingUser: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    _onChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.value;
        this.props.onChange(change);
    };

    _onEditPatient = (patient) => {
        Routing.transitionTo(Routes.editRecord, {params: {key: patient.key}});
    };

    render() {
        if (this.props.loading) {
            return <Mask text={this.i18n('please-wait')}/>;
        }
        const institution = this.props.institution;
        return <Panel header={<h3>{this.i18n('institution.panel-title')}</h3>} bsStyle='primary'>
            <form className='form-horizontal' style={{margin: '0.5em 0 1.5em 0'}}>
                <div className='row'>
                    <div className='col-xs-4'>
                        <HorizontalInput type='text' name='name' label={this.i18n('institution.name')}
                               value={institution.name} readOnly={!Authentication.isAdmin()}
                               labelWidth={4} inputWidth={8} onChange={this._onChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-4'>
                        <HorizontalInput type='text' name='emailAddress' label={this.i18n('institution.email')}
                               value={institution.emailAddress} readOnly={!Authentication.isAdmin()}
                               labelWidth={4} inputWidth={8} onChange={this._onChange}/>
                    </div>
                </div>
                {this._renderAddedDate()}
                {this._renderButtons()}
            </form>
            {!this.props.institution.isNew && this._renderMembers()}
            <InstitutionPatients patients={this.props.patients} onEdit={this._onEditPatient}/>
        </Panel>;
    }

    _renderAddedDate() {
        const institution = this.props.institution;
        if (institution.isNew || !institution.dateCreated) {
            return null;
        }
        const created = Utils.formatDate(institution.dateCreated);
        return <div className='row'>
            <div className='col-xs-6'>
                <div className='notice-small'>
                    <FormattedMessage id='institution.created' values={{date: created}}/>
                </div>
            </div>
        </div>
    }

    _renderButtons() {
        if (!Authentication.isAdmin()) {
            return <div className='row'>
                <div className='col-xs-1'>
                    <Button bsStyle='primary' bsSize='small' onClick={this.props.onCancel}>{this.i18n('back')}</Button>
                </div>
            </div>;
        } else {
            return <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
                <Button bsStyle='success' bsSize='small' ref='submit'
                        disabled={this.props.loading}
                        onClick={this.props.onSave}>{this.i18n('save')}</Button>
                <Button bsStyle='link' bsSize='small' onClick={this.props.onCancel}>{this.i18n('cancel')}</Button>
            </div>;
        }
    }

    _renderMembers() {
        const members = this.props.institution.members ? this.props.institution.members : this.props.members;
        return <InstitutionMembers institution={this.props.institution} members={members} onEditUser={this.props.onEditUser} onAddNewUser={this.props.onAddNewUser}
                                   onAddExistingUser={this.props.onAddExistingUser}  />
    }
}

export default injectIntl(I18nWrapper(Institution));
