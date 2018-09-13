import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup } from 'react-gears';

export default class PropertyGroupsTableExpandedRow extends Component {
  render() {
    const {
      propertyGroupId,
      remove
    } = this.props;
    return (
      <hr />,
        <ButtonGroup>
          <Button color="link" className="pl-0"><Link to={{ pathname: `/${propertyGroupId}/edit` }}>Edit</Link></Button>
          <Button color="link" className="text-danger" onClick={() => remove(propertyGroupId)}>Delete</Button>
        </ButtonGroup>
    );
  }
}
