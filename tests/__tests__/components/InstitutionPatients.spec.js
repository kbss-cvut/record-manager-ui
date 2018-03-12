import TestUtils from "react-addons-test-utils";
import React from "react";
import {IntlProvider} from "react-intl";
import InstitutionPatients from "../../../js/components/institution/InstitutionPatients";

describe('InstitutionPatients', function () {
    const intlData = require('../../../js/i18n/en');
    let patients,
        patientsEmpty,
        onEdit = jasmine.createSpy('onEdit');

    patients = [
        {
            key: 4324344
        },
        {
            key: 4321434
        }
    ];

    patientsEmpty = [];

    it('renders panel with table and table headers and columns', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <InstitutionPatients patients={patients} onEdit={onEdit}/>
            </IntlProvider>);
        const panelHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'panel');
        expect(panelHeading).not.toBeNull();
        const panelBody = TestUtils.findRenderedDOMComponentWithClass(tree, 'panel-body');
        expect(panelBody).not.toBeNull();
    });

    it('does not render anything', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <InstitutionPatients patients={patientsEmpty} onEdit={onEdit}/>
            </IntlProvider>);
        const panelHeading = TestUtils.scryRenderedDOMComponentsWithClass(tree, 'panel');
        expect(panelHeading.length).toEqual(0);
    });

});