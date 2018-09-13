/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';

import { PropertiesStore } from '../../../src/property_groups/stores/PropertiesStore';
import * as PropertiesAPI from '../../../src/property_groups/api/properties';

describe('PropertiesStore', () => {
  let propertiesStore;

  beforeEach(() => {
    propertiesStore = new PropertiesStore();
  });

  describe('filteredProperties', () => {
    beforeEach(() => {
      propertiesStore.properties = [
        { id: 1, name: 'name test1', displayAddress: 'address test1', address: { state: 'state1' } },
        { id: 2, name: 'name test2', displayAddress: 'address test2', address: { state: 'state2' } },
        { id: 3, name: 'name test3', displayAddress: 'address test3', address: { state: 'state3' } }];
    });

    it('given property name, return filter result', () => {
      propertiesStore.propertyName = 'name test1';
      expect(propertiesStore.filteredProperties).to.deep.equal([propertiesStore.properties[0]]);
      propertiesStore.propertyName = 'name test4';
      expect(propertiesStore.filteredProperties).to.deep.equal([]);
    });

    it('given display address, return filter result', () => {
      propertiesStore.displayAddress = 'address test2';
      expect(propertiesStore.filteredProperties).to.deep.equal([propertiesStore.properties[1]]);
      propertiesStore.displayAddress = 'name test4';
      expect(propertiesStore.filteredProperties).to.deep.equal([]);
    });
    it('given stateCode, return filter result', () => {
      propertiesStore.stateCode = 'state3';
      expect(propertiesStore.filteredProperties).to.deep.equal([propertiesStore.properties[2]]);
      propertiesStore.stateCode = 'state4';
      expect(propertiesStore.filteredProperties).to.deep.equal([]);
    });

    it('given selected properties, return filter result', () => {
      propertiesStore.selected = new Map();
      propertiesStore.selected.set(1, true);
      expect(propertiesStore.filteredProperties).to.deep.equal([propertiesStore.properties[0]]);
    });

    it('no filer, return properties', () => {
      expect(propertiesStore.selected).equal(null);
      expect(propertiesStore.propertyName).equal('');
      expect(propertiesStore.displayAddress).equal('');
      expect(propertiesStore.stateCode).equal('');
      expect(propertiesStore.filteredProperties).to.deep.equal(propertiesStore.properties);
    });
  });

  describe('set filter value', () => {
    it('set property name', () => {
      const propertyName = 'name test';
      propertiesStore.filterByPropertyName(propertyName);
      expect(propertiesStore.propertyName).equal(propertyName);
    });

    it('set display address', () => {
      const dispalyAddress = 'address test';
      propertiesStore.filterByDisplayAddress(dispalyAddress);
      expect(propertiesStore.displayAddress).equal(dispalyAddress);
    });

    it('set state code when argument is not null', () => {
      const stateCode = { value: 'state test' };
      propertiesStore.filterByState(stateCode);
      expect(propertiesStore.stateCode).equal(stateCode.value);
    });

    it('set state code when argument is null', () => {
      const stateCode = null;
      propertiesStore.filterByState(stateCode);
      expect(propertiesStore.stateCode).equal('');
    });

    it('set selected properties when previous selected value is null', () => {
      const selected = new Map([[1, true]]);
      propertiesStore.filterBySelected(selected);
      expect([...propertiesStore.selected]).deep.equal([...selected]);
    });

    it('set selected properties as null when previous selected value is not null', () => {
      propertiesStore.selected = new Map([[1, true]]);
      const selected = new Map([[2, true]]);
      propertiesStore.filterBySelected(selected);
      expect(propertiesStore.selected).equal(null);
    });
  });

  describe('remove selected filters', () => {
    it('remove property name selected filters when filter lable is property name', () => {
      const filter = { lable: 'Property Name' };
      propertiesStore.removeSelectedFilters(filter);
      expect(propertiesStore.propertyName).equal('');
    });

    it('remove Address selected filters when filter lable is address', () => {
      const filter = { lable: 'Address' };
      propertiesStore.removeSelectedFilters(filter);
      expect(propertiesStore.displayAddress).equal('');
    });

    it('remove state selected filters when filter lable is state', () => {
      const filter = { lable: 'State' };
      propertiesStore.removeSelectedFilters(filter);
      expect(propertiesStore.stateCode).equal('');
    });
  });

  describe('set selected filters', () => {
    it('set property name selected filters when property name is not empty', () => {
      propertiesStore.propertyName = 'test';
      const filters = [{ label: 'Property Name', value: 'test' }];
      expect(propertiesStore.selectedFilters).deep.equal(filters);
    });

    it('set display address selected filters when display address is not empty', () => {
      propertiesStore.displayAddress = 'test';
      const filters = [{ label: 'Address', value: 'test' }];
      expect(propertiesStore.selectedFilters).deep.equal(filters);
    });

    it('set state selected filters when state code is not empty', () => {
      propertiesStore.stateCode = 'test';
      const filters = [{ label: 'State', value: 'test' }];
      expect(propertiesStore.selectedFilters).deep.equal(filters);
    });

    it('return empty filters when no filters', () => {
      expect(propertiesStore.selectedFilters).deep.equal([]);
    });
  });

  it('resetFilters', () => {
    propertiesStore.resetFilters();
    expect(propertiesStore.properties).deep.equal([]);
    expect(propertiesStore.propertyName).equal('');
    expect(propertiesStore.displayAddress).equal('');
    expect(propertiesStore.stateCode).equal('');
    expect(propertiesStore.loading).equal(true);
  });

  describe('load', () => {
    let sandbox;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('sets properties to result from getProperties on success', () => {
      const properties = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
      const promise = Promise.resolve(properties);
      sandbox.stub(PropertiesAPI, 'getProperties').callsFake(() => {
        expect(propertiesStore.loading).to.equal(true);
        return promise;
      });

      return propertiesStore.load().then(() => {
        expect(propertiesStore.loading).to.equal(false);
        expect(propertiesStore.properties).to.deep.equal(properties);
      });
    });

    it('fails to load when getProperties fails', () => {
      const promise = Promise.reject();
      sandbox.stub(PropertiesAPI, 'getProperties').callsFake(() => {
        expect(propertiesStore.loading).to.equal(true);
        return promise;
      });

      return propertiesStore.load().then(() => {
        expect(propertiesStore.loading).to.equal(false);
        expect(propertiesStore.properties).to.deep.equal([]);
      });
    });
  });
});
