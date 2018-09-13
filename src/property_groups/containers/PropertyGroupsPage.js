import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Input, Select } from 'react-gears';
import { FilterBox } from 'react-apm';
import Loading from '../components/Loading';
import PropertyGroupsTable from '../components/PropertyGroupsTable';
import PropertyGroupsSidebar from '../components/PropertyGroupsSidebar';
import AlertMessage from '../components/AlertMessage';
import State from '../components/States';

@observer
export default class PropertyGroupsPage extends React.Component {
  @observable messageAction;
  @observable messageType;

  constructor(props) {
    super(props);
    this.messageType = (props.location && props.location.state && props.location.state.messageType) || '';
    this.messageAction = (props.location && props.location.state && props.location.state.messageAction) || '';
  }

  renderSidebar(sidebar) {
    return ReactDOM.createPortal(sidebar, document.getElementById('site-sidebar-content'));
  }

  componentDidMount() {
    if (!!this.messageType || !!this.messageAction) {
      this.props.history.replace({
        pathname: this.props.location.pathname,
        state: {}
      });
    }
    return this.props.propertyGroupsStore.load();
  }

  remove = propertyGroupId => this.props.propertyGroupsStore.remove(propertyGroupId).then(() => {
    this.messageAction = 'delete';
    this.messageType = 'success';
  }).catch(() => {
    this.messageAction = 'delete';
    this.messageType = 'error';
  })

  render() {
    const { propertyGroupsStore } = this.props;
    const { loading } = propertyGroupsStore;

    return (
      <Fragment>
        {this.renderSidebar(<PropertyGroupsSidebar />)}
        {this.messageAction &&
        <AlertMessage visible={this.isVisibel} action={this.messageAction} type={this.messageType} />}
        <h2 className="border-bottom">Property Groups</h2>
        <div className="mb-3">
          <FilterBox
            isOpen
            filters={[{
                       label: 'Property Name',
                       control: <Input
                         value={propertyGroupsStore.propertyName}
                         onChange={e => propertyGroupsStore.changePropertyName(e.target.value)}
                       />
                     },
                       {
                         label: 'Users',
                         control: <Input
                           value={propertyGroupsStore.users}
                           onChange={e => propertyGroupsStore.changeUsers(e.target.value)}
                         />
                       },
                       {
                         label: 'Address or Zip',
                         control: <Input
                           value={propertyGroupsStore.displayAddress}
                           onChange={e => propertyGroupsStore.changeDisplayAddress(e.target.value)}
                         />
                       },
                       {
                         label: 'State',
                         control: <Select
                           className="w-100"
                           disabled={false}
                           multi={false}
                           options={State}
                           value={propertyGroupsStore.stateCode}
                           onChange={state => propertyGroupsStore.changeState(state)}
                         />
                       }
                     ]}
            selectedFilters={propertyGroupsStore.selectedFilters}
            onRemove={filter => propertyGroupsStore.removeSelectedFilters(filter)}
          />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <PropertyGroupsTable
            propertyGroups={propertyGroupsStore.filteredPropertyGroups}
            expandRow={propertyGroupsStore.expandRow}
            remove={this.remove}
          />
        )}

      </Fragment>
    );
  }
}
