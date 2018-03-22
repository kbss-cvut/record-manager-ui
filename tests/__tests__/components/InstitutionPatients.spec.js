import TestUtils from "react-addons-test-utils";
import React from "react";
import {IntlProvider} from "react-intl";
import InstitutionPatients from "../../../js/components/institution/InstitutionPatients";

describe('InstitutionPatients', function () {
    const intlData = require('../../../js/i18n/en');
    let recordsLoaded,
        records,
        onEdit = jasmine.createSpy('onEdit');

    it('renders panel', function () {
        recordsLoaded = {
            records
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <InstitutionPatients recordsLoaded={recordsLoaded} onEdit={onEdit}/>
            </IntlProvider>);
        const panelHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'panel');
        expect(panelHeading).not.toBeNull();
        const panelBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'panel-body');
        expect(panelBody).not.toBeNull();
    });
});