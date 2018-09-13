import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import {
  Button
} from 'react-gears';
import PropertyGroupsTableUser from '../../../src/property_groups/components/PropertyGroupsTableUser';
import PropertyGroupsTableCell from '../../../src/property_groups/components/PropertyGroupsTableCell';

describe('<PropetyGroupsTableProperties>', () => {
  let wrapper;
  let props;
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    props = {
      users: [{ email: 'test' }],
      openModal: sandbox.stub()
    };
    wrapper = shallow(<PropertyGroupsTableUser {...props} />, { disableLifecycleMethods: true });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('render the  address detail when properties length equal one', () => {
    expect(wrapper.find(PropertyGroupsTableCell).children().text()).equal('test');
  });

  it('render view included properties button when propeties length more than one', () => {
    wrapper.setProps({ ...props, users: [{ email: 'test1' }, { email: 'test2' }] });
    expect(wrapper.find(Button).length).equal(1);
    wrapper.find(Button).props().onClick();
    expect(props.openModal.calledOnce).equal(true);
  });
});
