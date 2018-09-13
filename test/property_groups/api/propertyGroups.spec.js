/* eslint-env mocha */
import 'jsdom-global/register';
import { expect } from 'chai';
import sinon from 'sinon';
import { apiHelper } from 'js-utils-apm';
import * as api from '../../../src/property_groups/api/propertyGroups';


describe('<propertyGroups />', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('getPropertyGroups calls correct api', () => {
    const propertyGroups = [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }];
    const promise = Promise.resolve(propertyGroups);
    const getStub = sandbox.stub(apiHelper, 'get').returns(promise);
    api.getPropertyGroups()
      .then(results => results.map((result, i) => expect(result).deep.equal({
        ...propertyGroups[i],
        key: propertyGroups[i].id
      })));
    expect(getStub.calledWith('/api/property_lists')).equal(true);
  });

  it('addPropertyGroups calls correct api', () => {
    const postStub = sandbox.stub(apiHelper, 'post');

    const formData = { name: 'test' };
    api.addPropertyGroup(formData);
    expect(postStub.calledWith('/api/property_lists', formData)).equal(true);
  });

  it('editPropertyGroup calls correct api', () => {
    const putStub = sandbox.stub(apiHelper, 'put');

    const id = 1;
    const formData = { name: 'test' };
    api.editPropertyGroup(id, formData);
    expect(putStub.calledWith('/api/property_lists/1', formData)).equal(true);
  });

  it('deletePropertyGroup calls correct api', () => {
    const delStub = sandbox.stub(apiHelper, 'del');

    const id = 1;
    api.deletePropertyGroup(id);
    expect(delStub.calledWith('/api/property_lists/1')).equal(true);
  });

  it('searchPropertyGroup calls correct api', () => {
    const getStub = sandbox.stub(apiHelper, 'get');

    const id = 1;
    api.searchPropertyGroup(id);
    expect(getStub.calledWith('/api/property_lists/1')).equal(true);
  });
});
