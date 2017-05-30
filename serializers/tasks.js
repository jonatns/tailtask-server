const attributes = [
  'title',
  'description',
  'company_id',
  'location'
];

const relationships = [
  'user'
];

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

    // Generate users relationship
    const users = [];
    model.user_ids.forEach(function(user_id) {
      users.push({id: user_id, type: "user"});
    });
    var relationship = 'users';
    data.relationships[''+relationship+''] = {
      'data': users
    };

    return data;
  }
};
