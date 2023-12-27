'use strict';

import React from 'react';

import HelpIcon from '../HelpIcon';
import withI18n from '../../i18n/withI18n';
import {injectIntl} from "react-intl";
import HorizontalInput from '../HorizontalInput';
import PropTypes from "prop-types";
import {API_URL} from "../../../config";
import {isAdmin} from "../../utils/SecurityUtils";

class RequiredAttributes extends React.Component {
    static propTypes = {
        record: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        completed: PropTypes.bool.isRequired,
        currentUser: PropTypes.object.isRequired,
        formTemplate: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        const {record, formTemplate} = this.props;
        const possibleValuesEndpoint = `${API_URL}/rest/formGen/formTemplates`;

        // If the 'completed' prop is true, the attributes (except for the name) should be read only
        return <div>
            {this._showFormTemplateSelection() && <div className='row'>
                <div className='col-11 col-sm-6'>
                    <HorizontalInput
                        labelWidth={4} inputWidth={8}
                        isDisabled={!!record.formTemplate}
                        type='autocomplete' name='formTemplate' value={record.formTemplate || formTemplate}
                        label={this.i18n('records.form-template') + '*'} onChange={this.props.onChange}
                        possibleValuesEndpoint={possibleValuesEndpoint}
                    />
                </div>
            </div>
            }
            {this._showLocalNameEntry() && <div className='row'>
                <div className='col-11 col-sm-6'>
                    <HorizontalInput
                        labelWidth={4} inputWidth={8}
                        type='text' name='localName' value={record.localName}
                        label={this.i18n('records.local-name')} onChange={this.props.onChange}
                    />
                </div>
                <HelpIcon text={this.i18n('help.local-name')} glyph="help"/>
            </div>
            }
        </div>
    }

    _showLocalNameEntry() {
        return isAdmin(this.props.currentUser);
    }

    _showFormTemplateSelection() {
        return isAdmin(this.props.currentUser) || !(this.props.record.formTemplate || this.props.formTemplate)
    }
}

export default injectIntl(withI18n(RequiredAttributes));
