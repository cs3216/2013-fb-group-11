/**
 * VotesController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {  
  index: function(req, res) {
    res.api.failure();
  },

  show: function(req, res) {
    res.api.failure();
  },

  create: function(req, res) {
    Votes.create(req.body, function(err, vote) {
      if (err || vote === undefined) res.api.failure();
      else res.api.success({'vote': vote});
    });
  },

  update: function(req, res) {
    res.api.failure();
  },
  
  remove: function(req, res) {
    var vid = req.param('id');
    Votes.destroy(vid, function(err, vote) {
      if (err) res.api.failure();
      else res.api.success({'vote': vote});
    });
  }
};
