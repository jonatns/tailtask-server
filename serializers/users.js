const attributes = [
  'firstname',
  'lastname',
  'email',
  'location'
];

const relationships = [];

module.exports = {
  serialize: function(model, type) {
    var data = {'type': type, 'id': model._id, 'attributes': {}, 'relationships': {}};
    for(var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i];
      if(attribute === 'location') {
        if(model.location !== undefined) {
          data.attributes[''+attribute+''] = model.location.coordinates;
        } else {
          data.attributes[''+attribute+''] = null;
        }
      } else {
        data.attributes[''+attribute+''] = model[''+attribute+''];
      }
    }
    for(i = 0; i < relationships.length; i++) {
      var relationship = relationships[i];
      data.relationships[''+relationship+''] = {
        'data': {
          'id': model[''+relationship+'-id'],
          'type': relationship
        }
      };
    }
    return data;
  }
};
