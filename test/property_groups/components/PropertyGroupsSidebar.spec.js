/* eslint-env mocha */
import React from 'react';
import { mount } from 'enzyme';
import { Link, MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import PropertyGroupsSidebar from '../../../src/property_groups/components/PropertyGroupsSidebar';


describe('<PropertyGroupsSidebar />', () => {
  let sandbox;
  let wrapper;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    wrapper = mount(<MemoryRouter><PropertyGroupsSidebar /></MemoryRouter>);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('link to new property list', () => {
    expect(wrapper.find(Link).props().to).equal('/new');
    expect(wrapper.find(Link).props().href).equal('/property_lists/new');
  });

  it('link to property group directory', () => {
    expect(wrapper.find('a').at(1).props().href).equal('/buffered_reports/property_group_directory?customize=false');
    expect(wrapper.find('a').at(1).props().target).equal('_blank');
  });
});
