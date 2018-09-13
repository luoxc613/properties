/* eslint-env mocha */
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import assert from 'assert';
import EditPropertyGroupPage from '../../../src/property_groups/containers/EditPropertyGroupPage';
import { PropertiesStore } from '../../../src/property_groups/stores/PropertiesStore';
import * as ApiProperties from '../../../src/property_groups/api/properties';
import * as ApiPropertiesGroups from '../../../src/property_groups/api/propertyGroups';
import { searchPropertyGroup } from '../../../src/property_groups/api/propertyGroups';
import PropertyGroupForm from '../../../src/property_groups/components/PropertyGroupForm';

describe('<EditPropertyGroupPage />', () => {
  let sandbox;
  let props;
  let wrapper;
  let propertiesStore;
  let match;
  let property_list;
  let promise;

  beforeEach(() => {
    property_list = { name: 'test', properties: [{ id: 1 }] };
    promise = Promise.resolve(property_list);
    sandbox = sinon.createSandbox();
    sandbox.stub(ApiProperties, 'getProperties').returns(Promise.resolve([]));
    sandbox.stub(ApiPropertiesGroups, 'searchPropertyGroup').returns(promise);
    sandbox.stub(ApiPropertiesGroups, 'editPropertyGroup').returns(Promise.resolve([]));
    propertiesStore = new PropertiesStore();
    match = { params: { id: 1 } };
    props = { propertiesStore };
    wrapper = shallow(
      <EditPropertyGroupPage {...props} />, { disableLifecycleMethods: true }
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

  describe('submit', () => {
    it('calls update property group successfully', () => {
      wrapper.setProps({ ...props, match });
      const updateSpy = sandbox.spy(wrapper.instance().propertyGroupStore, 'updatePropertyGroup');
      wrapper.instance().submit()
        .then(() => {
          expect(wrapper.instance().messageType).equal('success');
          expect(wrapper.instance().redirectToIndex).equal(true);
        });
      expect(updateSpy.calledOnce).equal(true);
    });

    it('falis to calls update property group when response state equal 404', () => {
      wrapper.setProps({ ...props, match });
      const updateStub = sandbox.stub(wrapper.instance().propertyGroupStore, 'updatePropertyGroup').returns(Promise.reject({ status: 404 }));
      wrapper.instance().submit()
        .then(() => {
          assert(false, 'should not resolve successfully');
        })
        .catch((response) => {
          expect(wrapper.instance().messageType).equal('notFound');
          expect(wrapper.instance().redirectToIndex).equal(true);
          assert(true);
        });
      expect(updateStub.calledOnce).equal(true);
    });

    it('falis to calls update property group when response state equal others', () => {
      wrapper.setProps({ ...props, match });
      const updateStub = sandbox.stub(wrapper.instance().propertyGroupStore, 'updatePropertyGroup').returns(Promise.reject({ status: 400 }));
      wrapper.instance().submit()
        .then(() => {
          assert(false, 'should not resolve successfully');
        })
        .catch((response) => {
          expect(wrapper.instance().messageType).equal('error');
          expect(wrapper.instance().redirectToIndex).equal(false);
          assert(true);
        });
      expect(updateStub.calledOnce).equal(true);
    });
  });

  describe('render', () => {
    describe('redirect', () => {
      it('render redirect when state redirect is true', () => {
        wrapper.instance().redirectToIndex = true;
        wrapper.update();
        expect(wrapper.find(Redirect).length).equal(1);
        expect(wrapper.find(Redirect).props().to.pathname).equal('/');
        expect(wrapper.find(Redirect).props().to.state.messageType).equal(wrapper.instance().messageType);
        expect(wrapper.find(Redirect).props().to.state.messageAction).equal('edit');
      });

      it('do not render redirect when state rredirect is false', () => {
        expect(wrapper.find(Redirect).length).equal(0);
      });
    });

    it('link to manage property groups', () => {
      expect(wrapper.find(Link).props().to).equal('/');
      expect(wrapper.find(Link).props().href).equal('/');
    });

    it('set correct props for PropertyGroupForm', () => {
      expect(wrapper.find(PropertyGroupForm).length).equal(1);
      expect(wrapper.find(PropertyGroupForm).props().propertyGroupStore).equal(wrapper.instance().propertyGroupStore);
      expect(wrapper.find(PropertyGroupForm).props().propertiesStore).equal(propertiesStore);
      expect(wrapper.find(PropertyGroupForm).props().messageType).equal(wrapper.instance().messageType);
      expect(wrapper.find(PropertyGroupForm).props().actionType).equal('edit');
      expect(wrapper.find(PropertyGroupForm).props().submit).equal(wrapper.instance().submit);
    });
  });
});
