import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import {
  Button,
  ButtonToolbar,
} from 'react-gears';
import { Link } from 'react-router-dom';
import sinon from 'sinon';
import PropertyFormToolbar from '../../../src/property_groups/components/PropertyFormToolbar';

describe('<PropertyFormToolbar>', () => {
  let wrapper;
  let props;
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    props = {
      canSave: true,
      submit: sandbox.stub()
    };
    wrapper = shallow(<PropertyFormToolbar {...props} />, { disableLifecycleMethods: true });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('render', () => {
    it('one ButtonToolbar', () => {
      expect(wrapper.find(ButtonToolbar).length).equal(1);
    });
    it('two Buttons', () => {
      expect(wrapper.find(Button).length).equal(2);
    });
    it('set correct props', () => {
      expect(wrapper.find(Button).at(0).props().disabled).equal(!props.canSave);
      wrapper.find(Button).at(0).props().onClick();
      expect(props.submit.calledOnce).equal(true);
    });
    it('set correct cancle button', () => {
      const link = wrapper.find(Link);
      expect(link.length).equal(1);
      expect(link.props().to).equal('/');
      expect(link.props().href).equal('/');
    });
  });
});
