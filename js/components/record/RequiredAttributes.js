'use strict';

import React from 'react';

import HelpIcon from '../HelpIcon';
import withI18n from '../../i18n/withI18n';
import {injectIntl} from "react-intl";
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
                <div className='col-12 col-sm-6'>
                    <HorizontalInput
                        labelWidth={4} inputWidth={8}
                        type='text' name='localName' value={record.localName}
                        label={this.i18n('records.local-name') + '*'} onChange={this.props.onChange}
                    />
                </div>
                <HelpIcon text={this.i18n('help.local-name')} glyph="help"/>
            </div>
        </div>
    }
}

export default injectIntl(withI18n(RequiredAttributes));
