import Enzyme from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

Object.defineProperty(document, 'readyState', {
  value: 'complete',
  writable: true,
  enumerable: true,
  configurable: true,
});
