import React from 'react';
import {
  Button,
  ButtonToolbar,
} from 'react-gears';
import { Link } from 'react-router-dom';

const PropertyFormToolbar = ({ canSave, submit }) => (
  <ButtonToolbar>
    <Button
      disabled={!canSave}
      color="primary"
      onClick={() => submit()}
    >Save
    </Button>
    <Link to="/" href="/">
      <Button>Cancel</Button>
    </Link>
  </ButtonToolbar>
);

export default PropertyFormToolbar;
