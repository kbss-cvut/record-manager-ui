import React from 'react';
import TestUtils from "react-addons-test-utils";
import Loader, {LoaderMask, LoaderPanel} from "../../../js/components/Loader";
import {IntlProvider} from "react-intl";

describe('Loader', function () {
    const intlData = require('../../../js/i18n/en');

    it('renders loader', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <Loader />
            </IntlProvider>
        );
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'loader-spin');
        expect(result).not.toBeNull();
    });

    it('renders loader with panel', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <LoaderPanel />
            </IntlProvider>
        );
        const panelHeading = TestUtils.findRenderedDOMComponentWithClass(tree, 'panel');
        expect(panelHeading).not.toBeNull();
        const loaderSpin = TestUtils.findRenderedDOMComponentWithClass(tree, 'loader-spin');
        expect(loaderSpin).not.toBeNull();
    });

    it('renders loader as mask', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <LoaderMask />
            </IntlProvider>
        );
        const mask = TestUtils.findRenderedDOMComponentWithClass(tree, 'mask');
        expect(mask).not.toBeNull();
        const loaderSpin = TestUtils.findRenderedDOMComponentWithClass(tree, 'loader-spin');
        expect(loaderSpin).not.toBeNull();
    });

});