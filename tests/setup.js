const Adapter = require("@cfaester/enzyme-adapter-react-18").default;
const enzyme = require("enzyme");

enzyme.configure({ adapter: new Adapter() });

require("dotenv-safe").config({
  allowEmptyValues: true,
  path: "./.env.test",
  sample: "./.env.example",
});
global.shallow = enzyme.shallow;
global.mount = enzyme.mount;
