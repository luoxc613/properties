import { action, computed, observable } from 'mobx';
import filter from 'lodash.filter';
import { getProperties } from '../api/properties';

export class PropertiesStore {
  @observable properties = [];
  @observable loading = false;

  // Filters
  @observable propertyName = '';
  @observable displayAddress = '';
  @observable stateCode = '';
  @observable selected = null;

  // Table
  @observable ascending = true;
  @observable column = 'name';

  constructor() {
  }

  @computed
  get filteredProperties() {
    const propertyNameInput = this.propertyName.toLowerCase();
    const displayAddressInput = this.displayAddress.toLowerCase();
    let result = this.properties;

    if (this.selected) {
      result = result.filter(property => this.selected.has(property.id));
    }

    return filter(result, ({ name, displayAddress, address }) => (
      name.toLowerCase().includes(propertyNameInput) &&
      displayAddress.toLowerCase().includes(displayAddressInput) &&
      address.state.includes(this.stateCode)
    ));
  }

  @action
  filterByPropertyName = (propertyName) => {
    this.propertyName = propertyName;
  }

  @action
  filterByDisplayAddress = (displayAddress) => {
    this.displayAddress = displayAddress;
  }

  @action
  filterByState = (state) => {
    this.stateCode = state ? state.value : '';
  }

  @action
  filterBySelected = (selected) => {
    this.selected = this.selected == null ? observable.map(selected) : null;
  }

  @action
  removeSelectedFilters(filterSelected) {
    if (filterSelected.label === 'Property Name') this.propertyName = '';
    if (filterSelected.label === 'Address') this.displayAddress = '';
    if (filterSelected.label === 'State') this.stateCode = '';
  }


  @computed
  get selectedFilters() {
    const filters = [];
    !!this.propertyName && filters.push({ label: 'Property Name', value: this.propertyName });
    !!this.displayAddress && filters.push({ label: 'Address', value: this.displayAddress });
    !!this.stateCode && filters.push({ label: 'State', value: this.stateCode });
    return filters;
  }

  @action
  resetFilters() {
    this.properties.clear();
    this.propertyName = '';
    this.displayAddress = '';
    this.stateCode = '';
    this.selected = null;
    this.loading = true;
  }

  load() {
    this.resetFilters();
    return getProperties()
      .then((properties) => {
        this.properties.push(...properties);
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  }
}

const store = new PropertiesStore();

export default store;
