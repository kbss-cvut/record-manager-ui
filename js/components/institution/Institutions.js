'use strict';

import React from 'react';
import {Button, Panel} from 'react-bootstrap';

import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import Mask from '../Mask';
import InstitutionTable from './InstitutionTable';

class Institutions extends React.Component {
    static propTypes = {
        institutions: React.PropTypes.array,
        handlers: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        var institutions = this.props.institutions;
        if (institutions === null) {
            return <Mask text={this.i18n('please-wait')}/>;
        }
        return <Panel header={this.i18n('institutions.panel-title')} bsStyle='primary'>
            <InstitutionTable {...this.props}/>
            <div>
                <Button bsStyle='primary'
                        onClick={this.props.handlers.onCreate}>{this.i18n('institutions.create-institution')}</Button>
            </div>
        </Panel>
    }
}

export default injectIntl(I18nWrapper(Institutions));
