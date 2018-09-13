/* eslint-env mocha */

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import EditPropertyGroupPage from '../../../src/property_groups/containers/EditPropertyGroupPage';
import NewPropertyGroupPage from '../../../src/property_groups/containers/NewPropertyGroupPage';
import PropertyGroupsPage from '../../../src/property_groups/containers/PropertyGroupsPage';
import propertiesStore from '../../../src/property_groups/stores/PropertiesStore';
import propertyGroupsStore from '../../../src/property_groups/stores/PropertyGroupsStore';
import * as PropertyGroupAPI from '../../../src/property_groups/api/propertyGroups';
import App from '../../../src/property_groups/containers/App';

describe('<App />', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(ReactDOM, 'createPortal').returns(null);
    sandbox.stub(propertiesStore, 'load').returns(Promise.resolve([]));
    sandbox.stub(propertyGroupsStore, 'load').returns(Promise.resolve([]));
    sandbox.stub(propertyGroupsStore, 'remove').returns(Promise.resolve([]));
    sandbox.stub(PropertyGroupAPI, 'searchPropertyGroup').returns(Promise.resolve([]));
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders groups index', () => {
    const wrapper = mount(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(wrapper.find(PropertyGroupsPage)).to.have.length(1);
  });

  it('renders new page', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/new']}>
        <App />
      </MemoryRouter>
    );

    expect(wrapper.find(NewPropertyGroupPage)).to.have.length(1);
  });

  it('renders edit page', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/1/edit']}>
        <App />
      </MemoryRouter>
    );

    expect(wrapper.find(EditPropertyGroupPage)).to.have.length(1);
  });
});
