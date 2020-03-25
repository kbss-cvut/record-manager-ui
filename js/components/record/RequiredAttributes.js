'use strict';

import React from 'react';

import HelpIcon from '../HelpIcon';
import I18nWrapper from '../../i18n/I18nWrapper';
import injectIntl from '../../utils/injectIntl';
import HorizontalInput from '../HorizontalInput';
import PropTypes from "prop-types";

class RequiredAttributes extends React.Component {
    static propTypes = {
        record: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        completed: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        const record = this.props.record;
        // If the 'completed' prop is true, the attributes (except for the name) should be read only
        return <div>
            <div className='row'>
                <div className='col-xs-6'>
                    <HorizontalInput type='text' name='localName' value={record.localName}
                           label={this.i18n('records.local-name') + '*'} onChange={this.props.onChange}
                           labelWidth={4} inputWidth={8}/>
                </div>
                <HelpIcon text={this.i18n('help.local-name')}/>
            </div>
        </div>
    }
}

export default injectIntl(I18nWrapper(RequiredAttributes));
