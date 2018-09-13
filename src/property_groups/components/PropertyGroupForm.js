import React, { Component, Fragment } from 'react';
import {
  BlockPanel,
  Input,
  FormLabelGroup,
  CheckboxInput,
  Select
} from 'react-gears';
import { FilterBox } from 'react-apm';
import { observer } from 'mobx-react';
import Loading from '../components/Loading';
import PropertyTable from '../components/PropertyTable';
import AlertMessage from '../components/AlertMessage';
import States from './States';
import PropertyFormToolbar from '../components/PropertyFormToolbar';



const PropertyNameFilterCell = ({ propertiesStore }) => (
  <Input value={propertiesStore.propertyName} onChange={e => propertiesStore.filterByPropertyName(e.target.value)} />
);

const AddressFilterCell = ({ propertiesStore }) => (
  <Input
    value={propertiesStore.displayAddress}
    onChange={(e) => {
    propertiesStore.filterByDisplayAddress(e.target.value);
  }}
  />
);

@observer
export default class PropertyGroupForm extends Component {
  displayOnlySelected() {
    const { propertyGroupStore, propertiesStore } = this.props;
    const propertiesSelected = propertyGroupStore.propertiesSelected.toJS();
    propertiesStore.filterBySelected(propertiesSelected);
  }

  render() {
    const { propertyGroupStore, propertiesStore, messageType, actionType, submit } = this.props;

    return (
      <Fragment>
        <div className="mb-5">
          <FormLabelGroup label="Property Group Name" required stacked width={{ sm: 9, md: 6 }}>
            <Input
              value={propertyGroupStore.groupName}
              onChange={e => propertyGroupStore.updateGroupName(e.target.value)}
            />
          </FormLabelGroup>
          {messageType && <AlertMessage type={messageType} action={actionType} />}
          <PropertyFormToolbar canSave={propertyGroupStore.canSave} submit={submit} />
        </div>

        <FilterBox
          isOpen
          filters={[{
          label: 'Property Name',
          control: <PropertyNameFilterCell propertiesStore={propertiesStore} />
        }, {
          label: 'Address or Zip',
          control: <AddressFilterCell propertiesStore={propertiesStore} />
        },
          {
            label: 'State',
            control: <Select
              className="w-100"
              disabled={false}
              multi={false}
              options={States}
              value={propertiesStore.stateCode}
              onChange={(state) => {
                propertiesStore.filterByState(state);
              }}
            />
          },
          {
            label: 'Selection',
            control: <CheckboxInput
              checked={!!propertiesStore.selected}
              onChange={() => this.displayOnlySelected()}
              checkboxLabel="Show only selected properties"
            />
          }
        ]}
          selectedFilters={propertiesStore.selectedFilters}
          onRemove={filter => propertiesStore.removeSelectedFilters(filter)}
        />

        <BlockPanel
          title="Properties"
        >
          {propertiesStore.loading ? <Loading /> : (
            <PropertyTable
              total={propertiesStore.filteredProperties.length}
              propertiesSelected={propertyGroupStore.propertiesSelected}
              properties={propertiesStore.filteredProperties}
            />
          )}
        </BlockPanel>

        {messageType && <AlertMessage type={messageType} action={actionType} />}
        <PropertyFormToolbar canSave={propertyGroupStore.canSave} submit={submit} />
      </Fragment>
    );
  }
}
