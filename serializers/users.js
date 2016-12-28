const attributes = [
  'firstname',
  'lastname',
  'email'
];

const relationships = [];

module.exports = {
  serialize: function(model, type) {
    var data = {'type': type, 'id': model._id, 'attributes': {}, 'relationships': {}};
    for(var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i];
      data.attributes[''+attribute+''] = model[''+attribute+''];
    }
    for(var i = 0; i < relationships.length; i++) {
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
}
