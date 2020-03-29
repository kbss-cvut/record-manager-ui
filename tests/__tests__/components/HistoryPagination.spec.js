'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-dom/test-utils';
import HistoryPagination from "../../../js/components/history/HistoryPagination";
import enLang from '../../../js/i18n/en';

describe('HistoryPagination', function () {
    const intlData = enLang;
    let handlePagination = jasmine.createSpy('handlePagination');

    it('renders pagination with previous and next button', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <HistoryPagination pageNumber={1}
                                   numberOfActions={26}
                                   handlePagination={handlePagination}/>
            </IntlProvider>);
        const pagination = TestUtils.findRenderedDOMComponentWithClass(tree, 'pagination');
        expect(pagination).not.toBeNull();
        const li = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'li');
        expect(li.length).toEqual(3);
    });
});
