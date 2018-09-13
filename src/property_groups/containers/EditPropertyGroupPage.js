import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import { Icon } from 'react-gears';
import { PropertyGroupStore } from '../stores/PropertyGroupStore';
import PropertyGroupForm from '../components/PropertyGroupForm';

@observer
export default class EditPropertyGroupPage extends Component {
  @observable redirectToIndex;
  @observable messageType;

  constructor(props) {
    super(props);
    this.propertyGroupStore = new PropertyGroupStore();
    this.redirectToIndex = false;
    this.messageType = null;
  }

  componentDidMount() {
    return Promise.all([this.propertyGroupStore.getPropertyGroup(this.props.match.params.id), this.props.propertiesStore.load()]);
  }

  submit = () => {
    this.messageType = null;
    return this.propertyGroupStore.updatePropertyGroup(this.props.match.params.id)
      .then(() => {
        this.messageType = 'success';
        this.redirectToIndex = true;
      })
      .catch((response) => {
        if (response.status === 404) {
          this.redirectToIndex = true;
          this.messageType = 'notFound';
        } else {
          this.messageType = 'error';
        }
      });
  }

  render() {
    const { propertiesStore } = this.props;

    if (this.redirectToIndex) {
      return (
        <Redirect to={{
          pathname: '/',
          state: { messageType: this.messageType, messageAction: 'edit' }
        }}
        />);
    }

    return (
      <div>
        <Link to="/" href="/">
          <Icon name="angle-double-left" /> Back to Manage Property Groups
        </Link>
        <h2 className="border-bottom my-3">Edit Property Group</h2>

        <PropertyGroupForm
          propertyGroupStore={this.propertyGroupStore}
          propertiesStore={propertiesStore}
          messageType={this.messageType}
          actionType="edit"
          submit={this.submit}
        />
      </div>
    );
  }
}
