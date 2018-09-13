import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import { Icon } from 'react-gears';
import { PropertyGroupStore } from '../stores/PropertyGroupStore';
import PropertyGroupForm from '../components/PropertyGroupForm';

@observer
export default class NewPropertyGroupPage extends Component {
  @observable redirectToIndex;
  @observable messageType;

  constructor(props) {
    super(props);
    this.propertyGroupStore = new PropertyGroupStore();
    this.redirectToIndex = false;
    this.messageType = null;
  }

  componentDidMount() {
    return this.props.propertiesStore.load();
  }

  submit = () => {
    this.messageType = null;
    return this.propertyGroupStore.createPropertyGroup()
      .then(() => {
        this.redirectToIndex = true;
      })
      .catch(() => {
        this.messageType = 'error';
      });
  }

  render() {
    const { propertiesStore } = this.props;

    if (this.redirectToIndex) {
      return (
        <Redirect to={{
          pathname: '/',
          state: { messageType: 'success', messageAction: 'add' }
        }}
        />);
    }
    return (
      <div>
        <Link to="/" href="/">
          <Icon name="angle-double-left" /> Back to Manage Property Groups
        </Link>
        <h2 className="border-bottom my-3">New Property Group</h2>

        <PropertyGroupForm
          propertyGroupStore={this.propertyGroupStore}
          propertiesStore={propertiesStore}
          messageType={this.messageType}
          actionType="add"
          submit={this.submit}
        />
      </div>
    );
  }
}
