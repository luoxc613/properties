import React from 'react';
import {
  Button
} from 'react-gears';
import PropertyGroupsTableCell from './PropertyGroupsTableCell';

const Address = ({ address }) => (
  <span className="text-capitalize">
    {`${address}`}
  </span>
);

const PropertyGroupsTableProperties = ({ properties, openModal }) => (
  <PropertyGroupsTableCell>
    {
      (properties.length > 1)
      &&
      <div>
        {properties.length} properties
        <Button
          color="link"
          className="p-0 text-left"
          onClick={() => openModal('Properties', properties.slice())}
        >
          View Included Properties
        </Button>
      </div>
    }
    {
      (properties.length < 2)
      &&
      properties.map(property => <Address address={property.displayAddress} />)
    }
  </PropertyGroupsTableCell>
);

export default PropertyGroupsTableProperties;
