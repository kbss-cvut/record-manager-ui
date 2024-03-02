import enzyme, { shallow, mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

enzyme.configure({ adapter: new Adapter() });

require("dotenv-safe").config({
  allowEmptyValues: true,
  path: "./.env.test",
  sample: "./.env.example",
});
global.shallow = shallow;
global.mount = mount;
