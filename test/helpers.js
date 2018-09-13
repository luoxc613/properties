import 'jsdom-global/register';
import Adapter from 'enzyme-adapter-react-16/build/index';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });
