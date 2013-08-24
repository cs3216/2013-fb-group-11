/**
 * Question
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	user_id: {
  		type: 'INTEGER',
  		required: true
  	},
  	title: {
  		type: 'TEXT',
  		required: true,
  		notEmpty: true
  	},
  	content: 'TEXT',
  	course_id: {
  		type: 'INTEGER',
  		required: true
  	},
  	deleted: {
  		type: 'BOOLEAN',
  		defaultsTo: false
  	}
  },

  getQuestionsOfCourse: function(cid, cb) {
    this.find({course_id: cid}).done(function(err, questions) {
      if (err || questions === undefined) return cb(err, questions);
      var total = questions.length;
      var check = function() {
        total--;
        if (total <= 0) {
          console.log(questions);
          return cb(err, questions);
        }
      }

      // questions.forEach(function(question) {
      //   Questions.getQuestionWithDetails(question.id, function(err, details) {
      //     question.details = details;
      //     check();
      //   });
      // });

      // check();
      console.log(questions);
    });
  },

 getQuestionWithDetails: function(qid, cb) {
      this.findOne(qid).done(function(err, question) {
      if (err || question === undefined) return cb(err, question);
      Comments.find({parent_id: qid, parent_type: 'QUESTION'}).done(function(err, qcomments) {
        question.comments = qcomments;
        Answers.answersWithComments(qid, function(answers){
          question.answers = answers;
          cb(null, question);
        });
      })
    });
  }

};
