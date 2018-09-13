/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  BlockPanel,
  Button,
  ButtonToolbar,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  FormLabelGroup,
  Alert,
  Select,
  CheckboxInput
} from 'react-gears';
import { FilterBox } from 'react-apm';
import PropertyGroupForm from '../../../src/property_groups/components/PropertyGroupForm';
import Loading from '../../../src/property_groups/components/Loading';
import PropertyTable from '../../../src/property_groups/components/PropertyTable';
import { PropertiesStore } from '../../../src/property_groups/stores/PropertiesStore';
import { PropertyGroupStore } from '../../../src/property_groups/stores/PropertyGroupStore';
import AlertMessage from '../../../src/property_groups/components/AlertMessage';
import PropertyFormToolbar from '../../../src/property_groups/components/PropertyFormToolbar';
import State from '../../../src/property_groups/components/States';
import { mount } from 'enzyme/build/index';

describe('<PropertyGroupForm />', () => {
  let sandbox;
  let props;
  let wrapper;
  let propertiesStore;
  let propertyGroupStore;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    propertiesStore = new PropertiesStore();
    propertyGroupStore = new PropertyGroupStore();

    props = {
      propertyGroupStore,
      propertiesStore,
      messageType: 'success',
      actionType: 'add',
      submit: sandbox.spy()
    };
    wrapper = shallow(
      <PropertyGroupForm {...props} />, { disableLifecycleMethods: true }
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('dispalyOnlySelected', () => {
    const filterByselectedStub = sandbox.stub(propertiesStore, 'filterBySelected');
    wrapper.instance().displayOnlySelected();
    expect(filterByselectedStub.calledWith(propertyGroupStore.propertiesSelected.toJS())).equal(true);
  });
  describe('render', () => {
    describe('<FormLabelGroup />', () => {
      const formLabelGroup = () => wrapper.find(FormLabelGroup);

      it('set correct props', () => {
        expect(formLabelGroup().props().label).equal('Property Group Name');
      });

      it('the input value is correct', () => {
        wrapper.update();
        const groupName = propertyGroupStore.groupName;
        expect(formLabelGroup().find(Input).props().value).equal(groupName);
      });

      it('call onchange properly', () => {
        const updateStub = sandbox.stub(propertyGroupStore, 'updateGroupName');
        const mockedEvent = { target: { value: 'other' } };
        formLabelGroup().find(Input).props().onChange(mockedEvent);
        expect(updateStub.calledWith(mockedEvent.target.value)).equal(true);
      });
    });

    describe('<AlertMessage />', () => {
      const alertMessage = () => wrapper.find(AlertMessage);
      it('render two alert message when messageType exists', () => {
        expect(alertMessage().length).equal(2);
      });

      it('should set correct props', () => {
        expect(alertMessage().at(0).props().type).equal(props.messageType);
        expect(alertMessage().at(0).props().action).equal(props.actionType);
      });

      it('do not render alert message when messageType is null', () => {
        wrapper.setProps({ ...props, messageType: null });
        expect(alertMessage().length).equal(0);
      });
    });

    describe('<PropertyFormToolbar>', () => {
      const propertyFormToolbar = () => wrapper.find(PropertyFormToolbar);
      it('render tow PropertyFormToolbar', () => {
        expect(propertyFormToolbar().length).equal(2);
      });

      it('set correct props', () => {
        expect(propertyFormToolbar().at(0).props().canSave).equal(propertyGroupStore.canSave);
        expect(propertyFormToolbar().at(0).props().submit).equal(props.submit);
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
          expect(input.props().value).equal(propertiesStore.propertyName);
          const changeStub = sandbox.stub(propertiesStore, 'filterByPropertyName');
          const event = { target: { value: 'test' } };
          input.props().onChange(event);
          expect(changeStub.calledWith(event.target.value)).equal(true);
        });

        it('set the correct address or zip label value', () => {
          const addressLabel = filterBox().props().filters[1];
          expect(addressLabel.label).equal('Address or Zip');
          const input = mount(addressLabel.control).find(Input);
          expect(input.length).equal(1);
          expect(input.props().value).equal(propertiesStore.displayAddress);
          const changeStub = sandbox.stub(propertiesStore, 'filterByDisplayAddress');
          const event = { target: { value: 'test' } };
          input.props().onChange(event);
          expect(changeStub.calledWith(event.target.value)).equal(true);
        });

        it('set the correct state label value', () => {
          const stateLabel = filterBox().props().filters[2];
          expect(stateLabel.label).equal('State');
          const select = mount(stateLabel.control).find(Select);
          expect(select.length).equal(1);
          expect(select.props().disabled).equal(false);
          expect(select.props().options).equal(State);
          expect(select.props().value).equal(propertiesStore.stateCode);
          const changeStub = sandbox.stub(propertiesStore, 'filterByState');
          select.props().onChange();
          expect(changeStub.calledOnce).equal(true);
        });

        it('set the correct selection label value', () => {
          const selectionLabel = filterBox().props().filters[3];
          expect(selectionLabel.label).equal('Selection');
          const selection = mount(selectionLabel.control).find(CheckboxInput);
          expect(selection.length).equal(1);
          expect(selection.props().checked).equal(!!propertiesStore.selected);
          expect(selection.props().checkboxLabel).equal('Show only selected properties');
          const changeStub = sandbox.stub(wrapper.instance(), 'displayOnlySelected');
          selection.props().onChange();
          expect(changeStub.calledOnce).equal(true);
        });
      });

      it('set correct selectedFilters value', () => {
        expect(filterBox().props().selectedFilters).equal(propertiesStore.selectedFilters);
      });

      it('set correct onRemove value', () => {
        const removeStub = sandbox.stub(propertiesStore, 'removeSelectedFilters');
        const filter = 'test';
        filterBox().props().onRemove(filter);
        expect(removeStub.calledWith(filter)).equal(true);
      });
    });

    describe('<BlockPanel />', () => {
      const blockPanel = () => wrapper.find(BlockPanel);

      it('set correct props', () => {
        expect(blockPanel().props().title).equal('Properties');
      });

      it('renders loading component when propertiesStore loading is true', () => {
        props.propertiesStore.loading = true;
        wrapper.update();
        expect(wrapper.find(Loading).length).equal(1);
        expect(wrapper.find(PropertyTable).length).equal(0);
      });

      it('renders PropertyTable when propertiesStore loading is false', () => {
        props.propertiesStore.loading = false;
        wrapper.update();
        expect(wrapper.find(Loading).length).equal(0);
        expect(wrapper.find(PropertyTable).length).equal(1);
      });

      it('set the propertyTable props correctly', () => {
        props.propertiesStore.loading = false;
        wrapper.update();
        const propertyTable = wrapper.find(PropertyTable);
        expect(propertyTable.props().total).equal(propertiesStore.filteredProperties.length);
        expect(propertyTable.props().propertiesSelected).equal(propertyGroupStore.propertiesSelected);
        expect(propertyTable.props().properties).equal(propertiesStore.filteredProperties);
      });
    });
  });
});
