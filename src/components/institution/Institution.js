import React from "react";
import {Button, Card} from "react-bootstrap";
import {FormattedMessage, injectIntl} from "react-intl";
import InstitutionMembers from "./InstitutionMembers";
import InstitutionPatients from "./InstitutionPatients";
import withI18n from "../../i18n/withI18n";
import HorizontalInput from "../HorizontalInput";
import PropTypes from "prop-types";

import {ACTION_STATUS, ROLE} from "../../constants/DefaultConstants";
import {formatDate} from "../../utils/Utils";
import {LoaderSmall} from "../Loader";
import InstitutionValidator from "../../validation/InstitutionValidator";
import HelpIcon from "../HelpIcon";
import PromiseTrackingMask from "../misc/PromiseTrackingMask";

/**
 * Institution detail. Editable only for admins.
 */
class Institution extends React.Component {
    static propTypes = {
        institution: PropTypes.object,
        institutionLoaded: PropTypes.object,
        institutionSaved: PropTypes.object,
        institutionMembers: PropTypes.object,
        recordsLoaded: PropTypes.object,
        formTemplatesLoaded: PropTypes.object,
        handlers: PropTypes.object.isRequired,
        currentUser: PropTypes.object.isRequired,
        filterAndSort: PropTypes.object.isRequired,
        userDeleted: PropTypes.object
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
        const {
            currentUser,
            institution,
            recordsLoaded,
            formTemplatesLoaded
        } = this.props;

        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">{this.i18n('institution.panel-title')}</Card.Header>
            <Card.Body>
                <PromiseTrackingMask area="institution"/>
                {institution && <>
                    <form>
                        <div className='row'>
                            <div className='col-12 col-sm-6'>
                                <HorizontalInput
                                    type='text' name='name' label={`${this.i18n('institution.name')}*`}
                                    value={institution.name} readOnly={currentUser.role !== ROLE.ADMIN}
                                    onChange={this._onChange} labelWidth={3} inputWidth={8}/>
                            </div>
                            <div className='col-12 col-sm-6'>
                                <HorizontalInput
                                    type='text' name='emailAddress' label={this.i18n('institution.email')}
                                    value={institution.emailAddress || ""} readOnly={currentUser.role !== ROLE.ADMIN}
                                    onChange={this._onChange} labelWidth={3} inputWidth={8}/>
                            </div>
                        </div>
                        {this._renderAddedDate()}
                        {this._renderButtons()}
                    </form>
                    {!institution.isNew && this._renderMembers()}
                    {!institution.isNew &&
                        <InstitutionPatients
                            recordsLoaded={recordsLoaded} formTemplatesLoaded={formTemplatesLoaded}
                            onEdit={this.props.handlers.onEditPatient} onExport={this.props.handlers.onExportRecords}
                            currentUser={currentUser} filterAndSort={this.props.filterAndSort}/>}
                </>
                }
            </Card.Body>
        </Card>;
    }

    _renderAddedDate() {
        const {institution} = this.props;
        if (institution.isNew || !institution.dateCreated) {
            return null;
        }
        const created = formatDate(institution.dateCreated);
        return <div className='row'>
            <div className='col-12 col-sm-6'>
                <div className='notice-small'>
                    <FormattedMessage id='institution.created' values={{date: created}}/>
                </div>
            </div>
        </div>
    }

    _renderButtons() {
        const {currentUser, handlers, institutionSaved} = this.props;
        if (currentUser.role !== ROLE.ADMIN) {
            return <div className='row justify-content-center'>
                <Button variant='primary' size='sm' className="action-button"
                        onClick={handlers.onCancel}>{this.i18n('back')}</Button>
            </div>;
        }

        return <div className="mt-3 text-center">
            <Button variant='success' size='sm' ref='submit'
                    disabled={!InstitutionValidator.isValid(this.props.institution) || this.props.institutionSaved.status === ACTION_STATUS.PENDING}
                    onClick={handlers.onSave} className="action-button">{this.i18n('save')}
                {!InstitutionValidator.isValid(this.props.institution) &&
                    <HelpIcon className="align-self-center" text={this.i18n('required')} glyph="help"/>}
                {institutionSaved.status === ACTION_STATUS.PENDING && <LoaderSmall/>}</Button>
            <Button variant='link' size='sm' className='action-button' onClick={handlers.onCancel}>{this.i18n('cancel')}</Button>
        </div>;

    }

    _renderMembers() {
        const {institution, handlers, currentUser, institutionMembers, userDeleted} = this.props;
        return <InstitutionMembers institution={institution} institutionMembers={institutionMembers}
                                   onDelete={handlers.onDelete} onEditUser={handlers.onEditUser}
                                   userDeleted={userDeleted}
                                   onAddNewUser={handlers.onAddNewUser} currentUser={currentUser}/>
    }
}

export default injectIntl(withI18n(Institution));
