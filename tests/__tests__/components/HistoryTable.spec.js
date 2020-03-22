'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import HistoryTable from "../../../js/components/history/HistoryTable";
import enLang from '../../../js/i18n/en';

describe('HistoryTable', function () {
    const intlData = enLang;
    let actions = [],
        searchData = {},
        handlers = {
            handleSearch: jasmine.createSpy('handleSearch'),
            handleReset: jasmine.createSpy('handleReset'),
            handleChange: jasmine.createSpy('handleChange'),
            onKeyPress: jasmine.createSpy('onKeyPress'),
            onOpen: jasmine.createSpy('onOpen')
        };

    it('renders table with 4 headers columns', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <HistoryTable handlers={handlers} searchData={searchData}
                              actions={actions}/>
            </IntlProvider>);
        const table = TestUtils.scryRenderedDOMComponentsWithTag(tree,'table');
        expect(table).not.toBeNull();
        const th = TestUtils.scryRenderedDOMComponentsWithTag(tree,'th');
        expect(th.length).toEqual(4);
    });
});
