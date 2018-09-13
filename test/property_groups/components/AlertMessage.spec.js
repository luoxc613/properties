/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Alert } from 'react-gears';

import AlertMessage from '../../../src/property_groups/components/AlertMessage';

describe('<AlertMessage />', () => {
  const messages = {
    default: 'Sorry, something went wrong.',
    edit: {
      success: 'Successfully updated the Property Group.',
      error: 'Failed to edit Property Group. Please try again.',
      notFound: 'Failed to update Property Group because it no longer exists.'
    },
    add: {
      success: 'Successfully added a Property Group.',
      error: 'Failed to add a Property Group. Please try again.'
    },
    delete: {
      success: 'Successfully deleted the Property Group',
      error: 'Failed to delete Property Group. Please try again.'
    }
  };

  describe(('when the action is edit'), () => {
    it('should render success alert correctly', () => {
      const wrapper = shallow(<AlertMessage action='edit' type='success' />);
      expect(wrapper.find(Alert).length).equal(1);
      expect(wrapper.find(Alert).props().color).equal('success');
      expect(wrapper.find(Alert).props().children).equal(messages.edit.success);
    });

    it('should render error alert correctly', () => {
      const wrapper = shallow(<AlertMessage action='edit' type='error' />);
      expect(wrapper.find(Alert).length).equal(1);
      expect(wrapper.find(Alert).props().color).equal('danger');
      expect(wrapper.find(Alert).props().children).equal(messages.edit.error);
    });

    it('should render notFound alert correctly', () => {
      const wrapper = shallow(<AlertMessage action='edit' type='notFound' />);
      expect(wrapper.find(Alert).length).equal(1);
      expect(wrapper.find(Alert).props().color).equal('danger');
      expect(wrapper.find(Alert).props().children).equal(messages.edit.notFound);
    });
  });

  describe(('when the action is add'), () => {
    it('should render success alert correctly', () => {
      const wrapper = shallow(<AlertMessage action='add' type='success' />);
      expect(wrapper.find(Alert).length).equal(1);
      expect(wrapper.find(Alert).props().color).equal('success');
      expect(wrapper.find(Alert).props().children).equal(messages.add.success);
    });

    it('should render error alert correctly', () => {
      const wrapper = shallow(<AlertMessage action='add' type='error' />);
      expect(wrapper.find(Alert).length).equal(1);
      expect(wrapper.find(Alert).props().color).equal('danger');
      expect(wrapper.find(Alert).props().children).equal(messages.add.error);
    });
  });

  describe(('when the action is delete'), () => {
    it('should render success alert correctly', () => {
      const wrapper = shallow(<AlertMessage action='delete' type='success' />);
      expect(wrapper.find(Alert).length).equal(1);
      expect(wrapper.find(Alert).props().color).equal('success');
      expect(wrapper.find(Alert).props().children).equal(messages.delete.success);
    });

    it('should render error alert correctly', () => {
      const wrapper = shallow(<AlertMessage action='delete' type='error' />);
      expect(wrapper.find(Alert).length).equal(1);
      expect(wrapper.find(Alert).props().color).equal('danger');
      expect(wrapper.find(Alert).props().children).equal(messages.delete.error);
    });
  });

  describe(('when the action or type is invalid'), () => {
    it('should render a default messager correctly', () => {
      const wrapper = shallow(<AlertMessage action='invalid' type='invalid' />);
      expect(wrapper.find(Alert).length).equal(1);
      expect(wrapper.find(Alert).props().color).equal('danger');
      expect(wrapper.find(Alert).props().children).equal(messages.default);
    });
  });
});
