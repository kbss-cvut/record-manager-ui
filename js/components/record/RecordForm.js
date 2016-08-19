'use strict';

import React from 'react';
import {Panel} from 'react-bootstrap';

import I18nWrapper from '../../i18n/I18nWrapper';
import injectIntl from '../../utils/injectIntl';

class RecordForm extends React.Component {
    static propTypes = {
        record: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        var record = this.props.record;
        return <Panel header={<h5>{this.i18n('record.form-title')}</h5>} bsStyle='info'>
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(RecordForm));
