'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import * as RecordState from "../../../js/model/RecordState";
import RecordProvenance from "../../../js/components/record/RecordProvenance";

describe('RequiredProvenance', function () {
    const intlData = require('../../../js/i18n/en');
    let createdRecord,
        modifiedRecord,
        newRecord;

    newRecord = {
        localName: '',
        complete: false,
        isNew: true,
        state: RecordState.createInitialState()
    };

    createdRecord = {
        author: {firstName: 'test', lastName: 'test'},
        institution: {localName: 'testInstitution'},
        dateCreated: 1521225180115,
        key: '640579951330382351',
        localName: 'test',
        state: RecordState.createRecordState()
    };

    modifiedRecord = {
        author: {firstName: 'test', lastName: 'test'},
        institution: {localName: 'testInstitution'},
        dateCreated: 1521225180115,
        key: '640579951330382351',
        localName: 'test',
        lastModified: 1521277544192,
        state: RecordState.createRecordState()
    };

    it('does not render info about created date', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <RecordProvenance record={newRecord}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'span');
        expect(result.length).toEqual(0);
    });

    it('renders info only about date created', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <RecordProvenance record={createdRecord}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'span');
        expect(result.length).toEqual(1);
    });

    it('renders info about date created and modified', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <RecordProvenance record={modifiedRecord}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'span');
        expect(result.length).toEqual(2);
    });
});