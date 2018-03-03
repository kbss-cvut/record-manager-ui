'use strict';

import React from 'react';
import {Button, Panel} from 'react-bootstrap';

import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import Mask from '../Mask';
import InstitutionTable from './InstitutionTable';
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";

class Institutions extends React.Component {
    static propTypes = {
        institutions: React.PropTypes.array,
        handlers: React.PropTypes.object.isRequired,
        institutionDeleted: React.PropTypes.object,
        showAlert: React.PropTypes.bool.isRequired,
        status: React.PropTypes.string
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        const {institutions, showAlert, institutionDeleted, status} = this.props;
        if (!institutions.length && status === ACTION_STATUS.PENDING) {
            return <Mask text={this.i18n('please-wait')}/>;
        }
        return <Panel header={this.i18n('institutions.panel-title')} bsStyle='primary'>
            <InstitutionTable {...this.props}/>
            <div>
                <Button bsStyle='primary'
                        onClick={this.props.handlers.onCreate}>{this.i18n('institutions.create-institution')}</Button>
            </div>
            {showAlert && institutionDeleted.status === ACTION_STATUS.ERROR &&
            <AlertMessage type={ALERT_TYPES.DANGER}
                          message={this.props.formatMessage('institution.delete-error', {error: this.props.institutionDeleted.error.message})}/>}
            {showAlert && institutionDeleted.status === ACTION_STATUS.SUCCESS &&
            <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.props.i18n('institution.delete-success')}/>}
        </Panel>
    }
}

export default injectIntl(I18nWrapper(Institutions));
