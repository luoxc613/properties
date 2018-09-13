import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import PropertyGroupsTableCell from '../../../src/property_groups/components/PropertyGroupsTableCell';

describe('<PropertyGroupsTableCell>', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      children: 'test'
    };
    wrapper = shallow(<PropertyGroupsTableCell {...props} />, { disableLifecycleMethods: true });
  });

  it('set the correct children', () => {
    expect(wrapper.children().text()).equal(props.children);
  });
});
