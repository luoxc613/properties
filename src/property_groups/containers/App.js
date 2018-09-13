import React from 'react';
import { observer } from 'mobx-react';
import { Route, withRouter } from 'react-router-dom';
import { Container } from 'react-gears';
import EditPropertyGroupPage from './EditPropertyGroupPage';
import NewPropertyGroupPage from './NewPropertyGroupPage';
import propertiesStore from '../stores/PropertiesStore';
import propertyGroupsStore from '../stores/PropertyGroupsStore';
import PropertyGroupsPage from './PropertyGroupsPage';


@withRouter
@observer
export default class App extends React.Component {
  render() {
    return (
      <div id="app" className="mt-4">
        <Container>
          <Route
            exact
            path="/"
            render={props => <PropertyGroupsPage {...props} propertyGroupsStore={propertyGroupsStore} />}
          />
          <Route
            exact
            path="/new"
            render={props => <NewPropertyGroupPage {...props} propertiesStore={propertiesStore} />}
          />
          <Route
            path="/:id/edit"
            render={props => <EditPropertyGroupPage {...props} propertiesStore={propertiesStore} />}
          />
        </Container>
      </div>
    );
  }
}
