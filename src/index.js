import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import createHistory from 'history/createBrowserHistory';
import propertyGroupsStore from './property_groups/stores/PropertyGroupsStore.js';
import propertiesStore from './property_groups/stores/PropertiesStore.js';
import App from './property_groups/containers/App';

const history = createHistory({ basename: '/property_lists' });

render(
  <Router history={history} basename="/property_lists">
    <Provider
      propertyGroupsStore={propertyGroupsStore}
      propertiesStore={propertiesStore}
    >
      <App />
    </Provider>
  </Router>,
  document.getElementById('properties-main')
);

if (module.hot) {
  module.hot.accept();
}
