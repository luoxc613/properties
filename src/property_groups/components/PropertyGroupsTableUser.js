import React from 'react';
import {
  Button
} from 'react-gears';
import PropertyGroupsTableCell from './PropertyGroupsTableCell';

const PropertyGroupsTableUser = ({ users, openModal }) => (
  <PropertyGroupsTableCell>
    {(users.length > 1) &&
    <div>
      <div>
        {users.length} users
        <Button
          color="link"
          className="pl-0 text-left"
          onClick={() => openModal('Users', users.slice())}
        >
          View Users
        </Button>
      </div>
    </div>}
    {(users.length < 2) && users.map(user => user.email).join(',')}
  </PropertyGroupsTableCell>
);

export default PropertyGroupsTableUser;
