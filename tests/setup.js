// this handles setup of the fake DOM when the tests are run in Node
// Based on https://github.com/robertknight/react-testing
import jsdom from "jsdom";

const {JSDOM} = jsdom;

var FAKE_DOM_HTML = `
<html>
<body>
</body>
</html>
`;

function setupFakeDOM() {
    if (typeof document !== 'undefined') {
        // if the fake DOM has already been set up, or
        // if running in a real browser, do nothing
        return;
    }

    // setup the fake DOM environment.
    //
    // Note that we use the synchronous jsdom.jsdom() API
    // instead of jsdom.env() because the 'document' and 'window'
    // objects must be available when React is require()-d for
    // the first time.
    //
    // If you want to do any async setup in your tests, use
    // the before() and beforeEach() hooks.

    const {window} = new JSDOM(FAKE_DOM_HTML);
    const {document} = window;

    const reloadMock = jasmine.createSpy('reload');
    delete window.location;
    window.location = {reload: reloadMock};

    global.process.env = require('dotenv').config().parsed;

    global.document = document;
    global.window = window;
    global.navigator = window.navigator;
    global.HTMLElement = window.HTMLElement;
    global.HTMLAnchorElement = window.HTMLAnchorElement;
    global.removeEventListener = () => {
    };
    global.addEventListener = () => {
    };

}

setupFakeDOM();