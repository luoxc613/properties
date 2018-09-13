/* eslint-env mocha */
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import assert from 'assert';
import NewPropertyGroupPage from '../../../src/property_groups/containers/NewPropertyGroupPage';
import { PropertiesStore } from '../../../src/property_groups/stores/PropertiesStore';
import * as ApiProperties from '../../../src/property_groups/api/properties';
import * as ApiPropertiesGroups from '../../../src/property_groups/api/propertyGroups';
import PropertyGroupForm from '../../../src/property_groups/components/PropertyGroupForm';

describe('<NewPropertyGroupPage />', () => {
  let sandbox;
  let props;
  let wrapper;
  let propertiesStore;
  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(ApiProperties, 'getProperties').returns(Promise.resolve([]));
    sandbox.stub(ApiPropertiesGroups, 'addPropertyGroup').returns(Promise.resolve([]));
    sandbox.stub(ApiPropertiesGroups, 'getPropertyGroups').returns(Promise.resolve([]));
    propertiesStore = new PropertiesStore();
    props = { propertiesStore };
    wrapper = shallow(
      <NewPropertyGroupPage {...props} />, { disableLifecycleMethods: true }
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    it('set correct props', () => {
      wrapper.instance().constructor(props);
      expect(wrapper.instance().redirectToIndex).equal(false);
      expect(wrapper.instance().messageType).equal(null);
    });
  });
  describe('componentDidMount', () => {
    it('calls properties load successfully', () => {
      const properties = [{ name: 'a' }];
      const promise = Promise.resolve(properties);
      const loadStub = sandbox.stub(wrapper.instance(), 'componentDidMount').returns(promise);
      wrapper.instance().componentDidMount()
        .then((result) => {
          expect(result).equal(properties);
        });
      expect(loadStub.calledOnce).equal(true);
    });

    it('falis to calls properties load', () => {
      const promise = Promise.reject();
      const loadStub = sandbox.stub(wrapper.instance(), 'componentDidMount').returns(promise);
      wrapper.instance().componentDidMount()
        .then(() => {
          assert(false, 'should not resolve successfully');
        })
        .catch(() => {
          assert(true);
        });
      expect(loadStub.calledOnce).equal(true);
    });
  });
  describe('submit', () => {
    it('calls create property group successfully', () => {
      const createSpy = sandbox.spy(wrapper.instance().propertyGroupStore, 'createPropertyGroup');
      wrapper.instance().submit()
        .then(() => {
          expect(wrapper.instance().redirectToIndex).equal(true);
        });
      expect(createSpy.calledOnce).equal(true);
      expect(wrapper.instance().messageType).equal(null);
    });

    it('fails to call create property group', () => {
      const createStub = sandbox.stub(wrapper.instance().propertyGroupStore, 'createPropertyGroup').returns(Promise.reject());
      wrapper.instance().submit()
        .then(() => {
          assert(false, 'should not resolve successfully');
        })
        .catch(() => {
          expect(wrapper.instance().messageType).equal('error');
          assert(true);
        });
      expect(createStub.calledOnce).equal(true);
      expect(wrapper.instance().messageType).equal(null);
    });
  });

  describe('render', () => {
    describe('redirect', () => {
      it('render redirect when state redirect is true', () => {
        wrapper.instance().redirectToIndex = true;
        wrapper.update();
        expect(wrapper.find(Redirect).length).equal(1);
        expect(wrapper.find(Redirect).props().to.pathname).equal('/');
        expect(wrapper.find(Redirect).props().to.state.messageType).equal('success');
        expect(wrapper.find(Redirect).props().to.state.messageAction).equal('add');
      });

      it('do not render redirect when state rredirect is false', () => {
        expect(wrapper.find(Redirect).length).equal(0);
      });
    });

    it('link to manage property groups', () => {
      expect(wrapper.find(Link).props().to).equal('/');
      expect(wrapper.find(Link).props().href).equal('/');
    });

    it('render propertyGroupFrom', () => {
      expect(wrapper.find(PropertyGroupForm).length).equal(1);
      expect(wrapper.find(PropertyGroupForm).props().propertyGroupStore).equal(wrapper.instance().propertyGroupStore);
      expect(wrapper.find(PropertyGroupForm).props().propertiesStore).equal(propertiesStore);
      expect(wrapper.find(PropertyGroupForm).props().messageType).equal(wrapper.instance().messageType);
      expect(wrapper.find(PropertyGroupForm).props().actionType).equal('add');
      expect(wrapper.find(PropertyGroupForm).props().submit).equal(wrapper.instance().submit);
    });
  });
});
