import { it, describe, expect } from "vitest";

const Adapter = require("@cfaester/enzyme-adapter-react-18").default;
const enzyme = require("enzyme");
const jest = require("jest");
const jestMock = require("jest-mock");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const path = require("path");

enzyme.configure({ adapter: new Adapter() });

require("dotenv-safe").config({
  allowEmptyValues: true,
  path: "./.env.test",
  sample: "./.env.example",
});
global.shallow = enzyme.shallow;
global.mount = enzyme.mount;

/* some files use jest mock methods that are not shipped with jest, with the jest-mock */
jest.fn = jestMock.fn;
jest.spyOn = jestMock.spyOn;

global.jest = jest;
global.xit = it.skip;
global.describe = describe;
global.expect = expect;

/* emulate web browser subset for testing, using jsdom */
const rootHtml = fs.readFileSync(path.join(process.cwd(), "index.html"));
const jsdomWindow = new JSDOM(rootHtml).window;
const { document } = jsdomWindow;
global.document = document;
global.window = jsdomWindow;
