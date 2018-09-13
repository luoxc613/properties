import { action, observable, computed } from 'mobx';
import { addPropertyGroup, searchPropertyGroup, editPropertyGroup } from '../api/propertyGroups';

export class PropertyGroupStore {
  //new group
  @observable groupName;
  @observable isSaving;

  constructor() {
    this.groupName = '';
    this.isSaving = false;
    this.propertiesSelected = observable.map();
  }

  //create new group list
  @action
  updateGroupName = (name) => {
    this.groupName = name;
  }

  @computed
  get canSave() {
    return this.groupName && this.groupName.length > 0 && !this.isSaving;
  }

  @action
  createPropertyGroup = () => {
    const propertyIds = [];
    this.isSaving = true;
    this.propertiesSelected.forEach((value, key) => {
      propertyIds.push(key);
    });

    const dataPram = { property_list: { name: this.groupName, property_ids: propertyIds } };
    return addPropertyGroup(dataPram).then((propertyList) => {
      this.isSaving = false;
      return propertyList;
    });
  }

  @action
  getPropertyGroup = id => searchPropertyGroup(id)
    .then((propertyList) => {
      this.groupName = propertyList.name;
      propertyList.properties.map(property => this.propertiesSelected.set(property.id, true));
    })
    .catch(e => e)

  @action
  updatePropertyGroup = (id) => {
    const propertyIds = [];
    this.isSaving = true;
    this.propertiesSelected.forEach((value, key) => {
      propertyIds.push(key);
    });

    const dataPram = { property_list: { name: this.groupName, property_ids: propertyIds } };
    return editPropertyGroup(id, dataPram).then((propertyList) => {
      this.isSaving = false;
      return propertyList;
    });
  }
}

const store = new PropertyGroupStore();

export default store;
