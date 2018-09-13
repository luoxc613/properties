import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import {
  UncontrolledTable
} from 'react-gears';
import { Link } from 'react-router-dom';
import PropertyGroupsTableUser from './PropertyGroupsTableUser';
import PropertyGroupsTableExpandedRow from './PropertyGroupsTableExpandedRow';
import ViewMoreModal from './ViewMoreModal';
import PropertyGroupsTableProperties from './PropertyGroupsTableProperties';

// This is a quirk of UncontrolledTable + mobx, and lets you modify observables directly:
const Table = observer(UncontrolledTable);

export default class PropertyGroupsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      viewMoreData: {
        type: '',
        rows: []
      }
    };
  }

  static propTypes = {
    propertyGroups: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
    remove: PropTypes.func
  }

  openModal = (type, rows) => {
    this.setState({
      isModalOpen: true,
      viewMoreData: {
        type,
        rows
      }
    });
  }


  closeModal = () => {
    this.setState({
      isModalOpen: false,
      viewMoreData: {
        type: '',
        rows: []
      }
    });
  }

  render() {
    const {
      propertyGroups,
      remove
    } = this.props;

    return (
      <div>

        <ViewMoreModal isOpen={this.state.isModalOpen} data={this.state.viewMoreData} toggle={this.closeModal} />
        <Table
          columns={[
            {
              cell: propertyGroup => (
                <span id={propertyGroup.id} className="text-capitalize">
                  <Link to={{ pathname: `/${propertyGroup.id}/edit` }}>{propertyGroup.name}</Link>
                </span>),
              header: 'Property Name',
              key: 'name',
              width: '30%'
            },
            {
              cell: propertyGroup => (<PropertyGroupsTableUser
                id={propertyGroup.id}
                users={propertyGroup.users}
                openModal={this.openModal}
              />),
              header: 'Users',
              key: 'users',
              width: '30%'
            },
            {
              cell: propertyGroup => (<PropertyGroupsTableProperties
                id={propertyGroup.id}
                properties={propertyGroup.properties}
                openModal={this.openModal}
              />),
              header: 'Properties',
              key: 'properties',
              width: '30%'
            }
          ]}
          rowExpanded={
            row => <PropertyGroupsTableExpandedRow propertyGroupId={row.id} remove={remove} />
          }
          responsive
          expandable
          paginated
          rows={propertyGroups}
          size="sm"
        />
      </div>
    );
  }
}
