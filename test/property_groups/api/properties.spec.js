/* eslint-env mocha */
import 'jsdom-global/register';
import { expect } from 'chai';
import sinon from 'sinon';
import { apiHelper } from 'js-utils-apm';
import * as api from '../../../src/property_groups/api/properties';


describe('<properties />', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('getProperties calls correct api', () => {
    const properties = [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }];
    const promise = Promise.resolve(properties);
    const getStub = sandbox.stub(apiHelper, 'get').returns(promise);

    api.getProperties()
      .then(results => results.map((result, i) => expect(result).deep.equal({
        ...properties[i],
        key: properties[i].id
      })));


    expect(getStub.calledWith('/api/properties')).to.equal(true);
  });
});
