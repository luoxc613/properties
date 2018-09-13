import { apiHelper } from 'js-utils-apm';

const getProperties = () => apiHelper.get('/api/properties').then(properties => properties.map((property) => {
  return {
    ...property,
    key: property.id
  };
}));


export {
  getProperties
};
