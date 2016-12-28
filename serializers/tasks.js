const attributes = [
  'title',
  'description'
];

const relationships = [
  'user'
];

module.exports = {
  serialize: function(model, type) {
    var data = {'type': type, 'id': model._id, 'attributes': {}, 'relationships': {}};

    for(var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i];
      data.attributes[''+attribute+''] = model[''+attribute+''];
    }

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
}
