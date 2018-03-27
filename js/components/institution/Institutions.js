'use strict';

import React from 'react';
import {Button, Panel} from 'react-bootstrap';

import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import InstitutionTable from './InstitutionTable';
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {LoaderPanel} from "../Loader";

class Institutions extends React.Component {
    static propTypes = {
        institutionsLoaded: React.PropTypes.object,
        handlers: React.PropTypes.object.isRequired,
        institutionDeleted: React.PropTypes.object,
        showAlert: React.PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        const {showAlert, institutionDeleted, institutionsLoaded} = this.props;
        if(!institutionsLoaded.institutions && (!institutionsLoaded.status || institutionsLoaded.status === ACTION_STATUS.PENDING)) {
            return <LoaderPanel header={this.i18n('institutions.panel-title')} />;
        } else if(institutionsLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('institutions.loading-error', {error: institutionsLoaded.error.message})}/>
        }
        return <Panel header={this._renderHeader()} bsStyle='primary'>
            <InstitutionTable institutions={institutionsLoaded.institutions} {...this.props}/>
            <div>
                <Button bsStyle='primary'
                        onClick={this.props.handlers.onCreate}>{this.i18n('institutions.create-institution')}</Button>
            </div>
            {showAlert && institutionDeleted.status === ACTION_STATUS.ERROR &&
            <AlertMessage type={ALERT_TYPES.DANGER}
                          message={this.props.formatMessage('institution.delete-error', {error: this.i18n(this.props.institutionDeleted.error.message)})}/>}
            {showAlert && institutionDeleted.status === ACTION_STATUS.SUCCESS &&
            <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('institution.delete-success')}/>}
        </Panel>
    }

    _renderHeader() {
        return <span>
            {this.i18n('institutions.panel-title')}{this.props.institutionsLoaded.status === ACTION_STATUS.PENDING && <div className="loader"></div>}
        </span>;
    }
}

export default injectIntl(I18nWrapper(Institutions));
