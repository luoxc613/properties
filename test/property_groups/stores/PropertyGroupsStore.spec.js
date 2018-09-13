/* eslint-env mocha */
/* eslint-env mocha */

import { expect } from 'chai';
import assert from 'assert';
import sinon from 'sinon';

import { PropertyGroupsStore } from '../../../src/property_groups/stores/PropertyGroupsStore';
import * as PropertyGroupAPI from '../../../src/property_groups/api/propertyGroups';

describe('PropertyGroupsStore', () => {
  let propertyGroupsStore;

  beforeEach(() => {
    propertyGroupsStore = new PropertyGroupsStore();
  });

  describe('remove', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('remove one property list on success', () => {
      const dataParam = { property_list: { name: 'test', property_ids: [1] } };
      const promise = Promise.resolve(dataParam);
      sandbox.stub(PropertyGroupAPI, 'deletePropertyGroup').returns(promise);
      sandbox.stub(PropertyGroupAPI, 'getPropertyGroups').returns(promise);
      return propertyGroupsStore.remove(1).then((result) => {
        expect(result).equal(dataParam);
      });
    });

    it('fails to remove one property group when remove fails', () => {
      const promise = Promise.reject();
      sandbox.stub(PropertyGroupAPI, 'deletePropertyGroup').returns(promise);
      sandbox.stub(PropertyGroupAPI, 'getPropertyGroups').returns(promise);

      return propertyGroupsStore.remove(1)
        .then(() => {
          assert(false, 'should not resolve successfully');
        })
        .catch(() => {
          assert(true);
        });
    });
  });

  describe('filteredPropertyGroups', () => {
    beforeEach(() => {
      propertyGroupsStore.propertyGroups = [
        { name: 'name test1', users: [{ email: 'test1@example.com' }], properties: [{ displayAddress: 'address test1', address: { state: 'state1' } }] },
        { name: 'name test2', users: [{ email: 'test2@example.com' }], properties: [{ displayAddress: 'address test2', address: { state: 'state2' } }] },
        { name: 'name test3', users: [{ email: 'test3@example.com' }], properties: [{ displayAddress: 'address test3', address: { state: 'state3' } }] }];
    });

    it('given property name, return filter result', () => {
      propertyGroupsStore.propertyName = 'name test1';
      expect(propertyGroupsStore.filteredPropertyGroups).to.deep.equal([propertyGroupsStore.propertyGroups[0]]);
      propertyGroupsStore.propertyName = 'name test4';
      expect(propertyGroupsStore.filteredPropertyGroups).to.deep.equal([]);
    });

    it('given user email, return filter result', () => {
      propertyGroupsStore.users = 'test2@example.com';
      expect(propertyGroupsStore.filteredPropertyGroups).to.deep.equal([propertyGroupsStore.propertyGroups[1]]);
      propertyGroupsStore.users = 'test4@example.com';
      expect(propertyGroupsStore.filteredPropertyGroups).to.deep.equal([]);
    });


    it('given displayAddress, return filter result', () => {
      propertyGroupsStore.displayAddress = 'address test3';
      expect(propertyGroupsStore.filteredPropertyGroups).to.deep.equal([propertyGroupsStore.propertyGroups[2]]);
      propertyGroupsStore.displayAddress = 'address test4';
      expect(propertyGroupsStore.filteredPropertyGroups).to.deep.equal([]);
    });

    it('given state code, return filter result', () => {
      propertyGroupsStore.stateCode = 'state2';
      expect(propertyGroupsStore.filteredPropertyGroups).to.deep.equal([propertyGroupsStore.propertyGroups[1]]);
      propertyGroupsStore.stateCode = 'state4';
      expect(propertyGroupsStore.filteredPropertyGroups).to.deep.equal([]);
    });

    it('no filter, return property groups', () => {
      expect(propertyGroupsStore.propertyName).equal('');
      expect(propertyGroupsStore.displayAddress).equal('');
      expect(propertyGroupsStore.users).equal('');
      expect(propertyGroupsStore.stateCode).equal('');
      expect(propertyGroupsStore.filteredPropertyGroups).to.deep.equal(propertyGroupsStore.propertyGroups);
    });
  });

  describe('change filter value', () => {
    it('change property name', () => {
      const propertyName = 'test';
      propertyGroupsStore.changePropertyName(propertyName);
      expect(propertyGroupsStore.propertyName).equal(propertyName);
    });

    it('change display address', () => {
      const displayAddress = 'test';
      propertyGroupsStore.changeDisplayAddress(displayAddress);
      expect(propertyGroupsStore.displayAddress).equal(displayAddress);
    });

    it('change users', () => {
      const users = 'test';
      propertyGroupsStore.changeUsers(users);
      expect(propertyGroupsStore.users).equal(users);
    });

    it('change state code', () => {
      const stateCode = { value: 'test' };
      propertyGroupsStore.changeState(stateCode);
      expect(propertyGroupsStore.stateCode).equal(stateCode.value);
    });
  });

  it('resetFilters', () => {
    propertyGroupsStore.resetFilters();
    expect(propertyGroupsStore.propertyGroups).deep.equal([]);
    expect(propertyGroupsStore.propertyName).equal('');
    expect(propertyGroupsStore.displayAddress).equal('');
    expect(propertyGroupsStore.stateCode).equal('');
    expect(propertyGroupsStore.users).equal('');
    expect(propertyGroupsStore.loading).equal(true);
  });

  describe('remove selected filters', () => {
    it('when filter lable is property name', () => {
      const filter = { label: 'Property Name' };
      propertyGroupsStore.removeSelectedFilters(filter);
      expect(propertyGroupsStore.propertyName).equal('');
    });

    it('when filter lable is Address', () => {
      const filter = { label: 'Address' };
      propertyGroupsStore.removeSelectedFilters(filter);
      expect(propertyGroupsStore.displayAddress).equal('');
    });

    it('when filter lable is Users', () => {
      const filter = { label: 'Users' };
      propertyGroupsStore.removeSelectedFilters(filter);
      expect(propertyGroupsStore.users).equal('');
    });

    it('when filter lable is stateCode ', () => {
      const filter = { label: 'State' };
      propertyGroupsStore.removeSelectedFilters(filter);
      expect(propertyGroupsStore.stateCode).equal('');
    });
  });

  describe('selected filters', () => {
    it('when property name is not null, show propertyName selected filters', () => {
      propertyGroupsStore.propertyName = 'test';
      const filters = [{ label: 'Property Name', value: 'test' }];
      expect(propertyGroupsStore.selectedFilters).deep.equal(filters);
    });

    it('when display address is not null, show displayAddress selected filters', () => {
      propertyGroupsStore.displayAddress = 'test';
      const filters = [{ label: 'Address', value: 'test' }];
      expect(propertyGroupsStore.selectedFilters).deep.equal(filters);
    });

    it('when users is not null, show users selected filters', () => {
      propertyGroupsStore.users = 'test';
      const filters = [{ label: 'Users', value: 'test' }];
      expect(propertyGroupsStore.selectedFilters).deep.equal(filters);
    });

    it('when state code is not null, show stateCode selected filters', () => {
      propertyGroupsStore.stateCode = 'test';
      const filters = [{ label: 'State', value: 'test' }];
      expect(propertyGroupsStore.selectedFilters).deep.equal(filters);
    });

    it('when all is null, do not show any selected filters', () => {
      const filters = [];
      expect(propertyGroupsStore.selectedFilters).deep.equal(filters);
    });
  });
  describe('load', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('sets property group to result from getPropertyGroups on success', () => {
      const propertyGroups = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
      const promise = Promise.resolve(propertyGroups);
      sandbox.stub(PropertyGroupAPI, 'getPropertyGroups').callsFake(() => {
        expect(propertyGroupsStore.loading).to.equal(true);
        return promise;
      });

      return propertyGroupsStore.load().then(() => {
        expect(propertyGroupsStore.loading).to.equal(false);
        expect(propertyGroupsStore.propertyGroups).to.deep.equal(propertyGroups);
      });
    });

    it('fails to load when getPropertyGroups fails', () => {
      const promise = Promise.reject();
      sandbox.stub(PropertyGroupAPI, 'getPropertyGroups').callsFake(() => {
        expect(propertyGroupsStore.loading).to.equal(true);
        return promise;
      });

      return propertyGroupsStore.load()
        .then(() => {
          assert(false);
        })
        .catch(() => {
          expect(propertyGroupsStore.loading).to.equal(false);
          expect(propertyGroupsStore.propertyGroups).to.deep.equal([]);
        });
    });
  });
});
