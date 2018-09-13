/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import {
  Button,
  ButtonToolbar,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'react-gears';
import { expect } from 'chai';
import DeleteModal from '../../../src/property_groups/components/DeleteModal';


describe('<DeleteModal />', () => {
  let wrapper;
  let props = {};
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    props = {
      isOpen: true,
      onDelete: sandbox.spy(),
      toggle: sandbox.spy()
    };
    wrapper = shallow(<DeleteModal {...props} />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('render', () => {
    describe('Modal component', () => {
      const modal = () => wrapper.find(Modal);
      it('sets correct props for modal', () => {
        expect(modal().length).equal(1);
        expect(modal().props().isOpen).equal(props.isOpen);
      });

      it('calls toggle properly', () => {
        modal().props().toggle();
        expect(props.toggle.calledOnce).to.equal(true);
      });
    });

    describe('ModalHeader', () => {
      const modalHeader = () => wrapper.find(ModalHeader);
      it('sets correct text content', () => {
        expect(modalHeader().children().text()).equal('Delete Property Group');
      });

      it('calls toggle properly', () => {
        modalHeader().props().toggle();
        expect(props.toggle.calledOnce).to.equal(true);
      });
    });

    describe('ModalBody', () => {
      const modalBody = () => wrapper.find(ModalBody);
      it('sets correct text content', () => {
        expect(modalBody().children().text()).equal('Are you sure you want to delete this Property Group?');
      });
    });

    describe('ModalFooter', () => {
      const modalFooter = () => wrapper.find(ModalFooter);
      const buttonToolbar = () => wrapper.find(ButtonToolbar);
      const button = () => wrapper.find(Button);

      it('the number of modal footer', () => {
        expect(modalFooter().length).equal(1);
      });

      it('the number of button toolbar', () => {
        expect(buttonToolbar().length).equal(1);
      });

      it('the number of button', () => {
        expect(button().length).equal(2);
      });

      it('the delete button work properly', () => {
        button().at(0).props().onClick();
        expect(props.onDelete.calledOnce).to.equal(true);
      });

      it('the cancel button work properly', () => {
        button().at(1).props().onClick();
        expect(props.toggle.calledOnce).to.equal(true);
      });
    });
  });
});

