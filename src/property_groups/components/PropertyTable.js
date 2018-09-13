import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import {
  UncontrolledTable
} from 'react-gears';
import { action } from 'mobx';

// This is a quirk of SortableTable + mobx, and lets you modify observables directly:
const Table = observer(UncontrolledTable);

export default class PropertyTable extends Component {
  static propTypes = {
    properties: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ])
  }

  @action
  onSelect = (rowsSelected) => {
    rowsSelected.forEach((selected) => {
      this.props.propertiesSelected.set(selected.id,true);
    });
  }

  selectedRows(properties, propertiesSelected) {
    return properties.filter((property) => propertiesSelected.has(property.id));
  }

  render() {
    const {
      propertiesSelected,
      properties
    } = this.props;

    const tableRows = properties.slice();

    return (
      <div>
        <Table
          columns={[
            {
              cell: property => <span id={property.id} className="text-capitalize">{property.name}</span>,
              header: 'Property Name',
              key: 'name',
              width: '40%'
            },
            {
              cell: property => <span id={property.id} className="text-capitalize">{property.displayAddress}</span>,
              header: 'Address',
              key: 'address',
              width: '60%'
            }
          ]}
          selectable
          onSelect={rowsSelected => this.onSelect(rowsSelected)}
          paginated
          rows={tableRows}
          selected={() => this.selectedRows(tableRows, propertiesSelected)}
          size="sm"
        />
      </div>
    );
  }
}
