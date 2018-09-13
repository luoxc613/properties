import { action, computed, observable } from 'mobx';
import filter from 'lodash.filter';
import { getPropertyGroups, deletePropertyGroup } from '../api/propertyGroups';


export class PropertyGroupsStore {
  @observable propertyGroups = [];
  @observable loading = false;

  //Filters
  @observable propertyName = '';
  @observable users = '';
  @observable displayAddress = '';
  @observable stateCode = '';

  @action
  remove = id => (
    deletePropertyGroup(id).then(this.load)
  );

  constructor() {
  }

  @computed
  get filteredPropertyGroups() {
    const propertyNameInput = this.propertyName.toLowerCase();
    const usersInput = this.users.toLowerCase();
    const displayAddressInput = this.displayAddress.toLowerCase();
    return filter(this.propertyGroups, ({ name, users, properties }) => (
      this.filterByPropertyName(name, propertyNameInput) &&
      (usersInput.length === 0 || this.filterByUsers(users, usersInput)) &&
      (this.filterByDisplayAddressAndState(properties, displayAddressInput))
    ));
  }

  //Filters
  filterByPropertyName(name, propertyNameInput) {
    return name.toLowerCase().includes(propertyNameInput);
  }

  filterByUsers(users, usersInput) {
    return users.some(user => user.email.toLowerCase().includes(usersInput));
  }

  filterByDisplayAddressAndState(properties, displayAddressInput) {
    return properties.some(property =>
     (displayAddressInput.length === 0 || property.displayAddress.toLowerCase().includes(displayAddressInput)) &&
      (this.stateCode.length === 0 || property.address.state === this.stateCode)
    );
  }

  @action
  changePropertyName = (propertyName) => {
    this.propertyName = propertyName;
  }

  @action
  changeDisplayAddress = (displayAddress) => {
    this.displayAddress = displayAddress;
  }

  @action
  changeUsers = (users) => {
    this.users = users;
  }

  @action
  changeState = (stateCode) => {
    this.stateCode = stateCode ? stateCode.value : '';
  }

  @action
  resetFilters() {
    this.propertyGroups.clear();
    this.propertyName = '';
    this.displayAddress = '';
    this.stateCode = '';
    this.users = '';
    this.loading = true;
  }

  @action
  removeSelectedFilters(filterSelected) {
    if (filterSelected.label === 'Property Name') this.propertyName = '';
    if (filterSelected.label === 'Address') this.displayAddress = '';
    if (filterSelected.label === 'Users') this.users = '';
    if (filterSelected.label === 'State') this.stateCode = '';
  }

  @computed
  get selectedFilters() {
    const filters = [];
    !!this.propertyName && filters.push({ label: 'Property Name', value: this.propertyName });
    !!this.displayAddress && filters.push({ label: 'Address', value: this.displayAddress });
    !!this.users && filters.push({ label: 'Users', value: this.users });
    !!this.stateCode && filters.push({ label: 'State', value: this.stateCode });
    return filters;
  }


  load = () => {
    this.resetFilters();
    return getPropertyGroups()
      .then((propertyGroups) => {
        this.propertyGroups.push(...propertyGroups);
        this.loading = false;
        return propertyGroups;
      })
      .catch((err) => {
        this.loading = false;
        return Promise.reject(err);
      });
  }
}

const store = new PropertyGroupsStore();

export default store;
