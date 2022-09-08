import enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

enzyme.configure({adapter: new Adapter()});

require('dotenv-safe').config({
    allowEmptyValues: [ 'RECORD_MANAGER_BASENAME' ],
    sample: './.env.example',
})
global.shallow = shallow;
global.mount = mount;
