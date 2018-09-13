/* eslint-env mocha */
import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  Button,
  Paginator,
  UncontrolledTable
} from 'react-gears';
import { expect } from 'chai';
import sinon from 'sinon';
import { Link } from 'react-router-dom';
import PropertyGroupsTable from '../../../src/property_groups/components/PropertyGroupsTable';
import ViewMoreModal from '../../../src/property_groups/components/ViewMoreModal';
import PropertyGroupsTableUser from '../../../src/property_groups/components/PropertyGroupsTableUser';
import PropertyGroupsTableProperties from '../../../src/property_groups/components/PropertyGroupsTableProperties';

describe('<PropertyGroupsTable />', () => {
  let sandbox;
  let wrapper;
  let props = {};

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    props = {
      propertyGroups: [{ id: 1, name: 'name test1', user: 'user test1', properties: 'properties test1' }],
      remove: sandbox.spy()
    };
    wrapper = shallow(<PropertyGroupsTable {...props} />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('render', () => {
    it('should render one table', () => {
      expect(wrapper.find(UncontrolledTable).length).equal(1);
      expect(wrapper.find(UncontrolledTable).props().rows).to.deep.equal([{
        id: 1,
        name: 'name test1',
        user: 'user test1',
        properties: 'properties test1'
      }]);
    });
    describe('constructor', () => {
      it('set the correct props', () => {
        wrapper.instance().constructor(props);
        expect(wrapper.instance().state.isModalOpen).equal(false);
        expect(wrapper.instance().state.viewMoreData.type).equal('');
        expect(wrapper.instance().state.viewMoreData.rows).deep.equal([]);
      });
    });
    describe('openModal', () => {
      it('set the state correctly', () => {
        const type = 'Users';
        const rows = [{ id: 1, email: 'test' }];
        wrapper.instance().openModal(type, rows);
        expect(wrapper.instance().state.isModalOpen).equal(true);
        expect(wrapper.instance().state.viewMoreData.type).equal(type);
        expect(wrapper.instance().state.viewMoreData.rows).deep.equal(rows);
      });
    });
    describe('closeModal', () => {
      it('set the state correctly', () => {
        wrapper.instance().closeModal();
        expect(wrapper.instance().state.isModalOpen).equal(false);
        expect(wrapper.instance().state.viewMoreData.type).equal('');
        expect(wrapper.instance().state.viewMoreData.rows).deep.equal([]);
      });
    });
    describe('<ViewMoreModal>', () => {
      it('set the props correctly', () => {
        expect(wrapper.find(ViewMoreModal).length).equal(1);
        expect(wrapper.find(ViewMoreModal).props().isOpen).equal(wrapper.instance().state.isModalOpen);
        expect(wrapper.find(ViewMoreModal).props().data).equal(wrapper.instance().state.viewMoreData);
        expect(wrapper.find(ViewMoreModal).props().toggle).equal(wrapper.instance().closeModal);
      });
    });
    describe('table content', () => {
      describe('property name', () => {
        const getPropertyColumn = () => wrapper.find(UncontrolledTable).props().columns[0];
        it('it passed the correct props', () => {
          expect(getPropertyColumn().header).equal('Property Name');
          expect(getPropertyColumn().key).equal('name');
        });
        it('cell property group renders property group name', () => {
          const propertyGroup = { id: 1, name: 'test' };
          const propertyGroupName = getPropertyColumn().cell(propertyGroup);

          expect(propertyGroupName.props.id).equal(propertyGroup.id);
          expect(propertyGroupName.props.children.props.to.pathname).equal('/1/edit');
          expect(shallow(propertyGroupName).find(Link).props().children).equal('test');
        });
      });

      describe('users name', () => {
        const getPropertyColumn = () => wrapper.find(UncontrolledTable).props().columns[1];

        it('it passed the correct props', () => {
          expect(getPropertyColumn().header).equal('Users');
          expect(getPropertyColumn().key).equal('users');
        });

        it('cell users set correct props for PropertyGroupTableUser', () => {
          const propertyGroup = { id: 1, users: 'test' };
          const propertyGroupName = getPropertyColumn().cell(propertyGroup);
          const userTable = mount(propertyGroupName).find(PropertyGroupsTableUser);
          expect(userTable.length).equal(1);
          expect(userTable.props().id).equal(propertyGroup.id);
          expect(userTable.props().users).equal(propertyGroup.users);
          expect(userTable.props().openModal).equal(wrapper.instance().openModal);
        });
      });

      describe('properties', () => {
        const getPropertyColumn = () => wrapper.find(UncontrolledTable).props().columns[2];

        it('it passed the correct props', () => {
          expect(getPropertyColumn().header).equal('Properties');
          expect(getPropertyColumn().key).equal('properties');
        });

        it('cell property group renders PropertyGroupsTableProperties', () => {
          const propertyGroup = { id: 1, properties: 'test' };
          const propertyGroupName = getPropertyColumn().cell(propertyGroup);
          const propertiesTable = mount(propertyGroupName).find(PropertyGroupsTableProperties);
          expect(propertiesTable.length).equal(1);
          expect(propertiesTable.props().id).equal(propertyGroup.id);
          expect(propertiesTable.props().properties).equal(propertyGroup.properties);
          expect(propertiesTable.props().openModal).equal(wrapper.instance().openModal);
        });
      });

      describe('Row Expanded', () => {
        const propertyGroup = { id: 1, name: 'name test1', user: 'user test1', properties: 'properties test1', expanded: true };
        const rowExpand = () => wrapper.find(UncontrolledTable).props().rowExpanded(propertyGroup).props;
        it('render one propertyGroupTableExpandRow component when one row expanded', () => {
          expect(rowExpand().propertyGroupId).equal(1);
          expect(rowExpand().remove).equal(props.remove);
          rowExpand().remove();
          expect(props.remove.calledOnce).equal(true);
        });
      });

      describe('set correct props ', () => {
        const tableProps = () => wrapper.find(UncontrolledTable).props();
        it('set the expandable as true', () => {
          expect(tableProps().expandable).equal(true);
        });
        it('set the paginated as true', () => {
          expect(tableProps().paginated).equal(true);
        });
        it('set the responsive as true', () => {
          expect(tableProps().responsive).equal(true);
        });
      });
    });
  });
});
