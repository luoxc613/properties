import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import {
  Button,
  ButtonToolbar,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from 'react-gears';
import sinon from 'sinon';
import ViewMoreModal from '../../../src/property_groups/components/ViewMoreModal';

describe('<ViewMoreModal />', () => {
  let sandbox;
  let wrapper;
  let props = {};

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    props = {
      isOpen: true,
      toggle: sandbox.spy(),
      data: {
        type: 'Properties',
        rows: [{ displayAddress: 'address test' }]
      }
    };
    wrapper = shallow(<ViewMoreModal {...props} />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('rowRenderer', () => {
    it('when data type is properties', () => {
      expect(wrapper.instance().props.data.type).equal('Properties');
      expect(wrapper.instance().rowRenderer(props.data.rows[0])).equal('address test');
    });

    it('when data type is Users', () => {
      wrapper.setProps({ ...props, data: { type: 'Users', rows: [{ email: 'email test' }] } });
      expect(wrapper.instance().props.data.type).equal('Users');
      expect(wrapper.instance().rowRenderer(wrapper.instance().props.data.rows[0])).equal('email test');
    });

    it('when data type is invalid type', () => {
      wrapper.setProps({ ...props, data: { type: 'invalid', rows: [{ row: 'test' }] } });
      expect(wrapper.instance().rowRenderer(wrapper.instance().props.data.rows[0])).equal('');
    });
  });

  describe('render', () => {
    it('set correct modal props', () => {
      const modal = wrapper.find(Modal);
      expect(modal.length).equal(1);
      expect(modal.props().isOpen).equal(true);
      modal.props().toggle();
      expect(props.toggle.calledOnce).equal(true);
    });

    it('set correct ModalHeader props and children', () => {
      const modalHeader = wrapper.find(ModalHeader);
      expect(modalHeader.length).equal(1);
      modalHeader.props().toggle();
      expect(props.toggle.calledOnce).equal(true);
      expect(wrapper.instance().props.data.type).equal('Properties');
      expect(modalHeader.props().children).equal('Properties Information');
    });

    it('set correct table', () => {
      const table = wrapper.find(Table);
      expect(wrapper.instance().props.data.type).equal('Properties');
      expect(table.find('th').children().text()).equal('Properties in Group');
      expect(table.find('td').children().text()).equal('address test');
    });

    it('set correct ModalFooter', () => {
      const modalFooter = wrapper.find(ModalFooter);
      expect(modalFooter.find(Button).length).equal(1);
      modalFooter.find(Button).props().onClick();
      expect(props.toggle.calledOnce).equal(true);
    });
  });
});
