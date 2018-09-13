/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import {
  Button,
  ButtonGroup
} from 'react-gears';
import { expect } from 'chai';
import sinon from 'sinon';
import { Link } from 'react-router-dom';
import PropertyGroupsTableExpandedRow from '../../../src/property_groups/components/PropertyGroupsTableExpandedRow';

describe('<PropertyGroupsTableExpandedRow />', () => {
  let sandbox;
  let wrapper;
  let props = {};

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    props = {
      propertyGroupId: 1,
      remove: sandbox.stub()
    };
    wrapper = shallow(<PropertyGroupsTableExpandedRow {...props} />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('render', () => {
    it('has the correct props', () => {
      expect(wrapper.find(ButtonGroup).length).equal(1);
      expect(wrapper.find(Button).length).equal(2);
      expect(wrapper.find(Link).length).equal(1);
      expect(wrapper.find(Link).props().to.pathname).equal('/1/edit');
    });

    it('delete onClick', () => {
      const deleteButton = wrapper.find(Button).filterWhere(n => n.contains('Delete'));
      deleteButton.props().onClick();
      expect(props.remove.calledWith(1)).to.equal(true);
    });
  });
});
