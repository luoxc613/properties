/* eslint-env mocha */
import React from 'react';
import { mount } from 'enzyme';
import { Paginator, UncontrolledTable } from 'react-gears';
import { expect } from 'chai';
import sinon from 'sinon';
import PropertyTable from '../../../src/property_groups/components/PropertyTable';

describe('<PropertyTable />', () => {
  let sandbox;
  let wrapper;
  let props = {};

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    props = {
      propertiesSelected: new Map([]),
      properties: [{ id: 1, name: 'name test1', displayAddress: 'displayAddress test1' }]
    };
    wrapper = mount(<PropertyTable {...props} />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('onSelect', () => {
    const rowSelected = [{id: 1, name: 'name test1'}];
    wrapper.instance().onSelect(rowSelected);
    expect(wrapper.instance().props.propertiesSelected.has(1)).equal(true);
  });

  it('selectedRows', () => {
    const properties = [
      { id: 1, name: 'name test1', displayAddress: 'displayAddress test1' },
      { id: 2, name: 'name test2', displayAddress: 'displayAddress test2' },
      { id: 3, name: 'name test3', displayAddress: 'displayAddress test3' }];
    const propertiesSelected = new Map([[1,true]]);
    expect(wrapper.instance().selectedRows(properties, propertiesSelected)).deep.equal([properties[0]]);

  });
  describe('render', () => {
    it('should render one table', () => {
      expect(wrapper.find(UncontrolledTable).length).equal(1);
      expect(wrapper.find(UncontrolledTable).props().rows).to.deep.equal([{
        id: 1,
        name: 'name test1',
        displayAddress: 'displayAddress test1'
      }]);
    });
    describe('table content', () => {
      describe('property name', () => {
        const getPropertyColumn = () => wrapper.find(UncontrolledTable).props().columns[0];

        it('is passed the correct props', () => {
          const propertyNameColumn = getPropertyColumn();
          expect(propertyNameColumn.header).to.equal('Property Name');
          expect(propertyNameColumn.key).to.equal('name');
        });

        it('cell property renders property name', () => {
          const property = { id: 1, name: 'test' };
          const PropertyName = getPropertyColumn().cell(property);
          expect(PropertyName.props.id).to.equal(property.id);
          expect(PropertyName.props.children).to.equal(property.name);
        });
      });

      describe('property address', () => {
        const getPropertyAddress = () => wrapper.find(UncontrolledTable).props().columns[1];

        it('it passed the correct props', () => {
          const propertyAddressColumn = getPropertyAddress();
          expect(propertyAddressColumn.header).equal('Address');
          expect(propertyAddressColumn.key).equal('address');
        });

        it('cell property renders property address', () => {
          const property = { id: 1, displayAddress: 'test' };
          const propertyAddress = getPropertyAddress().cell(property);

          expect(propertyAddress.props.id).equal(property.id);
          expect(propertyAddress.props.children).equal(property.displayAddress);
        });
      });
    });

    describe('set correct props ', () => {
      const tableProps = () => wrapper.find(UncontrolledTable).props();
      it('set the selectable as true', () => {
        expect(tableProps().selectable).equal(true);
      });
      it('set the paginated as true', () => {
        expect(tableProps().paginated).equal(true);
      });

      it('set the correct onSelected', () => {
        const onSelectStub = sandbox.stub(wrapper.instance(), 'onSelect');
        const rowSelected = [{id: 1, name: 'name test1'}];
        wrapper.instance().onSelect(rowSelected);
        expect(onSelectStub.calledWith(rowSelected)).equal(true);
      });

      it('set the correct selected', () => {
        const selectedRowsStub = sandbox.stub(wrapper.instance(), 'selectedRows');
        const properties = [
          { id: 1, name: 'name test1', displayAddress: 'displayAddress test1' },
          { id: 2, name: 'name test2', displayAddress: 'displayAddress test2' },
          { id: 3, name: 'name test3', displayAddress: 'displayAddress test3' }];
        const propertiesSelected = new Map([[1,true]]);
        wrapper.instance().selectedRows(properties, propertiesSelected);
        expect(selectedRowsStub.calledWith(properties, propertiesSelected)).equal(true);
      });
    });
  });
});
