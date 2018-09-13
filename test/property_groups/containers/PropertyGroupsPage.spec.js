/* eslint-env mocha */
import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import assert from 'assert';
import { expect } from 'chai';
import sinon from 'sinon';
import { Alert, Input, Select } from 'react-gears';
import { FilterBox } from 'react-apm';
import PropertyGroupsPage from '../../../src/property_groups/containers/PropertyGroupsPage';
import { PropertyGroupsStore } from '../../../src/property_groups/stores/PropertyGroupsStore';
import * as API from '../../../src/property_groups/api/propertyGroups';
import AlertMessage from '../../../src/property_groups/components/AlertMessage';
import State from '../../../src/property_groups/components/States';

describe('<PropertyGroupsPage />', () => {
  let sandbox;
  let wrapper;
  let props;
  let propertyGroupsStore;
  let Sidebar;
  let sidebarStub;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    Sidebar = () => (<div>Test</div>);
    sidebarStub = sandbox.stub(ReactDOM, 'createPortal').returns(Sidebar);
    sandbox.stub(API, 'getPropertyGroups').returns(Promise.resolve([]));
    propertyGroupsStore = new PropertyGroupsStore();
    props = { propertyGroupsStore };
    wrapper = mount(
      <PropertyGroupsPage {...props} />
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('constructor', () => {
    it('messageType and messageAction should be empty when no set state', () => {
      wrapper.instance().constructor(props);
      expect(wrapper.instance().messageType).equal('');
      expect(wrapper.instance().messageAction).equal('');
    });

    it('messageType and messageAction should be set when set state', () => {
      wrapper.instance().constructor({ ...props, location: { state: { messageType: 'success', messageAction: 'add' } } });
      wrapper.update();
      expect(wrapper.instance().messageType).equal('success');
      expect(wrapper.instance().messageAction).equal('add');
    });
  });

  describe('componentDidMount', () => {
    it('should call load', () => {
      const loadStub = sandbox.stub(propertyGroupsStore, 'load');
      wrapper.instance().componentDidMount();
      expect(loadStub.calledOnce).equal(true);
    });
  });

  describe('renderSidebar', () => {
    it('render sidebar', () => {
      wrapper.instance().renderSidebar(Sidebar);
      expect(sidebarStub.calledWith(Sidebar, document.getElementById('site-sidebar-content'))).equal(true);
    });
  });

  describe('remove', () => {
    it('remove one property group on success', () => {
      sandbox.stub(propertyGroupsStore, 'remove').returns(Promise.resolve([]));
      const removeStub = sandbox.spy(wrapper.instance(), 'remove');
      wrapper.instance().remove(1).then((result) => {
        expect(wrapper.instance().messageType).equal('success');
        expect(wrapper.instance().messageAction).equal('delete');
      });
      expect(removeStub.calledWith(1)).equal(true);
    });

    it('falis to remove one property group when remove falis', () => {
      const promise = Promise.reject();
      const removeStub = sandbox.stub(wrapper.instance().props.propertyGroupsStore, 'remove').returns(promise);
      return wrapper.instance().remove(1)
        .then(() => {
          assert(false, 'should not resolve successfully');
        })
        .catch(() => {
          expect(wrapper.instance().messageAction).equal('delete');
          expect(wrapper.instance().messageType).equal('error');
          assert(true);
        });
    });
  });

  describe('render', () => {
    it('renders sidebar', () => {
      expect(wrapper.find(Sidebar).length).equal(0);
    });

    it('should render the correct h2 text', () => {
      expect(wrapper.find('h2')).to.have.length(1);
      expect(wrapper.find('h2').text()).to.equal('Property Groups');
    });

    it('should render loading component when loading is true', () => {
      expect(wrapper.find('Loading')).to.have.length(1);
      expect(wrapper.find('PropertyGroupsTable')).to.have.length(0);
    });

    describe('Alert message', () => {
      it('should render one alert when message is not empty', () => {
        wrapper.instance().messageAction = 'add';
        wrapper.instance().messageType = 'error';
        wrapper.update();
        expect(wrapper.find(AlertMessage).length).equal(1);
        expect(wrapper.find(AlertMessage).props().action).equal('add');
        expect(wrapper.find(AlertMessage).props().type).equal('error');
      });

      it('should not render alert  when message is not empty', () => {
        expect(wrapper.find(Alert).length).equal(0);
      });
    });

    describe('FilterBox', () => {
      const filterBox = () => wrapper.find(FilterBox);
      it('set the correct isOpen value', () => {
        expect(filterBox().length).equal(1);
        expect(filterBox().props().isOpen).equal(true);
      });

      describe('set correct filters value', () => {
        it('the length of filters should be 4', () => {
          expect(filterBox().props().filters.length).equal(4);
        });

        it('set the correct property name label value', () => {
          const propertyNameLabel = filterBox().props().filters[0];
          expect(propertyNameLabel.label).equal('Property Name');
          const input = mount(propertyNameLabel.control).find(Input);
          expect(input.length).equal(1);
          expect(input.props().value).equal(propertyGroupsStore.propertyName);
          const changeStub = sandbox.stub(propertyGroupsStore, 'changePropertyName');
          const event = { target: { value: 'test' } };
          input.props().onChange(event);
          expect(changeStub.calledWith(event.target.value)).equal(true);
        });

        it('set the correct user label value', () => {
          const userLabel = filterBox().props().filters[1];
          expect(userLabel.label).equal('Users');
          const input = mount(userLabel.control).find(Input);
          expect(input.length).equal(1);
          expect(input.props().value).equal(propertyGroupsStore.users);
          const changeStub = sandbox.stub(propertyGroupsStore, 'changeUsers');
          const event = { target: { value: 'test' } };
          input.props().onChange(event);
          expect(changeStub.calledWith(event.target.value)).equal(true);
        });

        it('set the correct address or zip label value', () => {
          const addressLabel = filterBox().props().filters[2];
          expect(addressLabel.label).equal('Address or Zip');
          const input = mount(addressLabel.control).find(Input);
          expect(input.length).equal(1);
          expect(input.props().value).equal(propertyGroupsStore.displayAddress);
          const changeStub = sandbox.stub(propertyGroupsStore, 'changeDisplayAddress');
          const event = { target: { value: 'test' } };
          input.props().onChange(event);
          expect(changeStub.calledWith(event.target.value)).equal(true);
        });

        it('set the correct state label value', () => {
          const stateLabel = filterBox().props().filters[3];
          expect(stateLabel.label).equal('State');
          const select = mount(stateLabel.control).find(Select);
          expect(select.length).equal(1);
          expect(select.props().disabled).equal(false);
          expect(select.props().options).equal(State);
          expect(select.props().value).equal(propertyGroupsStore.stateCode);
          const changeStub = sandbox.stub(propertyGroupsStore, 'changeState');
          select.props().onChange();
          expect(changeStub.calledOnce).equal(true);
        });
      });

      it('set correct selectedFilters value', () => {
        expect(filterBox().props().selectedFilters).equal(propertyGroupsStore.selectedFilters);
      });

      it('set correct onRemove value', () => {
        const removeStub = sandbox.stub(propertyGroupsStore, 'removeSelectedFilters');
        const filter = 'test';
        filterBox().props().onRemove(filter);
        expect(removeStub.calledWith(filter)).equal(true);
      });
    });

    it('should render property groups table when loading is false', () => {
      propertyGroupsStore.loading = false;
      wrapper.update();
      expect(wrapper.find('PropertyGroupsTable')).have.length(1);
      expect(wrapper.find('Loading')).to.have.length(0);
      expect(wrapper.find('PropertyGroupsTable').props().propertyGroups).to.deep.equal(propertyGroupsStore.propertyGroups);
      expect(wrapper.find('PropertyGroupsTable').props().expandRow).to.equal(propertyGroupsStore.expandRow);
      expect(wrapper.find('PropertyGroupsTable').props().remove).to.equal(wrapper.instance().remove);
    });
  });
});
