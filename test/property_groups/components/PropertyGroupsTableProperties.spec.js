import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import {
  Button
} from 'react-gears';
import PropertyGroupsTableProperties from '../../../src/property_groups/components/PropertyGroupsTableProperties';

describe('<PropetyGroupsTableProperties>', () => {
  let wrapper;
  let props;
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    props = {
      properties: [{ displayAddress: 'test' }],
      openModal: sandbox.stub()
    };
    wrapper = shallow(<PropertyGroupsTableProperties {...props} />, { disableLifecycleMethods: true });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('render the  address detail when properties length equal one', () => {
    expect(wrapper.find('Address').length).equal(1);
    expect(wrapper.find('Address').props().address).equal(props.properties[0].displayAddress);
  });

  it('render view included properties button when propeties length more than one', () => {
    wrapper.setProps({ ...props, properties: [{ displayAddress: 'test1' }, { displayAddress: 'test2' }] });
    expect(wrapper.find(Button).length).equal(1);
    wrapper.find(Button).props().onClick();
    expect(props.openModal.calledOnce).equal(true);
  });
});
