import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Icon } from 'react-gears';

@withRouter
export default class PropertyGroupsSidebar extends React.Component {
  render() {
    return [
      <ul className="list-unstyled">
        <h4 className="text-muted text-uppercase">
          <Icon name="star" fixedWidth /> Tasks
        </h4>
        <hr />
        <li className="py-1">
          <Link to="/new" href="/property_lists/new">
            New Property Group
          </Link>
        </li>
      </ul>,
      <ul className="list-unstyled pt-3">
        <h4 className="text-muted text-uppercase">
          <Icon name="bar-chart" fixedWidth /> Reports
        </h4>
        <hr />
        <li className="py-1">
          <a
            href="/buffered_reports/property_group_directory?customize=false"
            target="_blank"
            rel="noopener noreferrer"
          >
            Property Group Directory
          </a>
        </li>
      </ul>
    ];
  }
}
