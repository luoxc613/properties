/* eslint-env mocha */

import { expect } from 'chai';
import assert from 'assert';
import sinon from 'sinon';

import { PropertyGroupStore } from '../../../src/property_groups/stores/PropertyGroupStore';
import * as PropertyGroupAPI from '../../../src/property_groups/api/propertyGroups';

describe('PropertyGroupStore', () => {
  let propertyGroupStore;

  beforeEach(() => {
    propertyGroupStore = new PropertyGroupStore();
  });

  describe('updateGroupName', () => {
    it('set new property group name', () => {
      const name = 'test';
      propertyGroupStore.updateGroupName(name);

      expect(propertyGroupStore.groupName).equal(name);
    });
  });

  describe('createPropertyGroup', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });
    it('create one property group from addPropertyGroup on success', () => {
      const dataParam = { property_list: { name: 'test', property_ids: [1] } };
      const promise = Promise.resolve(dataParam);
      sandbox.stub(PropertyGroupAPI, 'addPropertyGroup').returns(promise);

      return propertyGroupStore.createPropertyGroup().then((result) => {
        expect(result).equal(dataParam);
      });
    });

    it('fails to create one property group when addPropertyGroup fails', () => {
      const promise = Promise.reject();
      sandbox.stub(PropertyGroupAPI, 'addPropertyGroup').returns(promise);

      return propertyGroupStore.createPropertyGroup()
        .then(() => {
          assert(false, 'Should not resolve successfully');
        })
        .catch(() => {
          assert(true);
        });
    });
  });

  describe('getPropertyGroup', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('get one property group from getPropertyGroup by id on success', () => {
      const dataParam = { name: 'test', properties: [{ id: 1 }] };
      const promise = Promise.resolve(dataParam);
      sandbox.stub(PropertyGroupAPI, 'searchPropertyGroup').returns(promise);

      return propertyGroupStore.getPropertyGroup(1).then(() => {
        expect(propertyGroupStore.groupName).equal(dataParam.name);
        dataParam.properties.map(property => expect(propertyGroupStore.propertiesSelected.get(property.id)).equal(true));
      });
    });

    it('fails to get one property group when getPropertyGroup fails', () => {
      const promise = Promise.reject();
      sandbox.stub(PropertyGroupAPI, 'searchPropertyGroup').returns(promise);

      return propertyGroupStore.getPropertyGroup()
        .then(() => {
          assert(false, 'should not resolve successfully');
        })
        .catch(() => {
          assert(true);
        });
    });
  });

  describe('updatePropertyGroup', () => {
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });
    it('update one property group from updatePropertyGroup on success', () => {
      const dataParam = { property_list: { name: 'test', property_ids: [1] } };
      const promise = Promise.resolve(dataParam);
      sandbox.stub(PropertyGroupAPI, 'editPropertyGroup').returns(promise);

      return propertyGroupStore.updatePropertyGroup().then((result) => {
        expect(result).equal(dataParam);
      });
    });

    it('fails to update one property group when updatePropertyGroup fails', () => {
      const promise = Promise.reject();
      sandbox.stub(PropertyGroupAPI, 'editPropertyGroup').returns(promise);

      return propertyGroupStore.updatePropertyGroup()
        .then(() => {
          assert(false, 'Should not resolve successfully');
        })
        .catch(() => {
          assert(true);
        });
    });
  });
});
