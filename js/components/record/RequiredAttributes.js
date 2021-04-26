'use strict';

import React from 'react';

import HelpIcon from '../HelpIcon';
import withI18n from '../../i18n/withI18n';
import {injectIntl} from "react-intl";
import HorizontalInput from '../HorizontalInput';
import PropTypes from "prop-types";
import {API_URL} from "../../../config";
import {ROLE} from "../../constants/DefaultConstants";

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

    componentDidMount() {
        const {record, formTemplate} = this.props;

        if (!record.formTemplate) {
            if (formTemplate) {
                record.formTemplate = formTemplate;
            }
        }
    }

    render() {
        const {record, formTemplate} = this.props;
        const possibleValuesEndpoint = `${API_URL}/rest/formGen/formTemplates`;

        // If the 'completed' prop is true, the attributes (except for the name) should be read only
        return <div>
            {this._hideFormTemplateSelection && <div className='row'>
                    <div className='col-11 col-sm-6'>
                        <HorizontalInput
                            labelWidth={4} inputWidth={8}
                            type='autocomplete' name='formTemplate' value={record.formTemplate || formTemplate}
                            label={this.i18n('records.form-template') + '*'} onChange={this.props.onChange}
                            possibleValuesEndpoint={possibleValuesEndpoint}
                        />
                    </div>
                </div>
            }
            <div className='row'>
                <div className='col-11 col-sm-6'>
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

    _showFormTemplateSelection() {
        return this._isAdmin() || !this.props.formTemplate
    }

    _isAdmin() {
        return this.props.currentUser.role === ROLE.ADMIN
    }
}

export default injectIntl(withI18n(RequiredAttributes));
