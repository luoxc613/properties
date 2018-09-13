import { apiHelper } from 'js-utils-apm';

const getPropertyGroups = () => apiHelper.get('/api/property_lists').then(propertyGroups => propertyGroups.map((propertyGroup) => {
  return {
    ...propertyGroup,
    key: propertyGroup.id
  };
}));

const searchPropertyGroup = id => apiHelper.get(`/api/property_lists/${id}`);

const addPropertyGroup = formData => apiHelper.post('/api/property_lists', formData);

const editPropertyGroup = (id, formData) => apiHelper.put(`/api/property_lists/${id}`, formData);

const deletePropertyGroup = id => apiHelper.del(`/api/property_lists/${id}`);

export {
  getPropertyGroups,
  addPropertyGroup,
  editPropertyGroup,
  deletePropertyGroup,
  searchPropertyGroup
};
