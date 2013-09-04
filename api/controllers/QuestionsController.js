/**
 * QuestionController
 *
 * @module      :: Controller
 * @description :: Contains logic for handling requests.
 */

 module.exports = {
    // CRUD API
    index: function(req, res) {
    	res.api.failure_code(404);
    },

    show: function(req, res) {
    	var qid = req.param('id');
    	Questions.getQuestionWithDetails(qid, {user: req.session.user.id}, function(err, question) {
    		if (err || question === undefined) return res.api.failure(err);
    		res.api.success({'question': question});
    	});
    },

    create: function(req, res) {
    	if (req.body.user_id === undefined) {
    		req.body.user_id = req.session.user.id;
    	}
    	Questions.create(req.body, function(err, question) {
    		if (err || question === undefined) res.api.failure(err);
    		else {
    			Questions.getQuestionWithDetails(question.id, {user: req.session.user.id}, function(err, question){
    				res.api.success({'question': question});
    				Questions.publishCreate(question);

    				var fbActionName = 'osmosetest:ask';
    				var objectToLike = req.protocol + "://" + req.get('host') + '/questions/' + question.id;
    				req.facebook.api(
    				                 'https://graph.facebook.com/me/'.concat(fbActionName),
    				                 'post',
    				                 { question: objectToLike,
    				                 	privacy: {'value': 'SELF'} },
    				                 	function(response) {
    				                 	});
    			});
    		}
    	});
    },

    update: function(req, res) {
    	var id = req.param('id');
    	Questions.update(id, req.body, function(err, questions) {
    		if (err || questions === undefined) res.api.failure(err);
    		else {
    			Questions.getQuestionWithDetails(questions[0].id, {user: req.session.user.id}, function(err, question){
    				res.api.success({'question': question});
    				Questions.publishUpdate(question.id, question);
    			})
    		}
    	});
    },

    remove: function(req, res) {
    	var qid = req.param('id');
    	Questions.deleteQuestion(qid, function(err, question) {
    		if (err || question === undefined) res.api.failure(err);
    		else {
    			res.api.success({'question': question});
    			Questions.publishDestroy(req.param('id'));
    		}
    	});
    },

    // VIEW ROUTES
    details: function(req, res) {
    	var qid = req.param('id');
    	Questions.getQuestionWithDetails(qid, {user: req.session.user.id}, function(err, question) {
    		if (err || question === undefined) return res.render(404);
    		console.log(question);
            var url = req.protocol + "://" + req.get('host') + '/questions/' + qid;
    		res.view({
    			_layoutFile: '../layout.ejs',
    			fb_user: req.session.fb_user,
    			question_id: question.id,
    			display_type: 'question',
    			og_type: 'osmosetest:question',
    			og_url: url,
    			og_title: question.title
    		});
    	});
    }
  };
