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
        const possibleValuesQuery = "http://onto.fel.cvut.cz/rdf4j-server/repositories/ofn-form-manager-formgen?query=prefix%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0Aprefix%20skos%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0Aprefix%20fm%3A%20%3Chttp%3A%2F%2Fonto.fel.cvut.cz%2Fontologies%2Fform-metadata%2F%3E%0Aprefix%20dcterms%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0A%0ACONSTRUCT%20%7B%0A%20%20%20%20%20%20%3FformGraph%20rdfs%3Alabel%20%3Flabel%20.%0A%20%20%20%20%20%20%3FformGraph%20rdfs%3Acomment%20%3Fexplanation%20.%0A%7D%0AWHERE%20%7B%0A%20%20%20%20GRAPH%20%3FformGraph%20%7B%0A%20%20%20%20%20%20%20%3FformRoot%20a%20fm%3Aroot-entity%20.%20%20%0A%20%20%20%20%7D%0A%20%20%20%20SERVICE%20%3Chttps%3A%2F%2Fxn--slovnk-7va.gov.cz%2Fsparql%3E%20%7B%0A%20%20%20%20%20%20%3FformRoot%20skos%3AprefLabel%20%3Flabel%20.%0A%20%20%20%20%20%20OPTIONAL%20%7B%0A%20%20%20%20%20%20%20%20%20%3FformRoot%20dcterms%3Adescription%20%3Fexplanation%20.%0A%20%20%20%20%20%20%7D%0A%20%20%20%7D%0A%7D";

        const formTypeLabel = "Typ formuláře*";
        // If the 'completed' prop is true, the attributes (except for the name) should be read only
        return <div>
            <div className='row'>
                <div className='col-11 col-sm-6'>
                    <HorizontalInput
                        labelWidth={4} inputWidth={8}
                        type='autocomplete' name='formType' value={record.formType}
                        label={formTypeLabel} onChange={this.props.onChange}
                        possibleValueQuery={possibleValuesQuery}
                    />
                </div>
            </div>
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
}

export default injectIntl(withI18n(RequiredAttributes));
