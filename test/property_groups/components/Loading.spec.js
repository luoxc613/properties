/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Spinner } from 'react-gears';
import Loading from '../../../src/property_groups/components/Loading';

describe('<Loading />', () => {
  it('should render spinner component', () => {
    const wrapper = shallow(
      <Loading />);
    expect(wrapper.find(Spinner).length).equal(1);
  });
});
