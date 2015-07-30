var models = require('../models/models.js');
var statisticVar = {
      quizes: 0,
      comments: 0,
      quizesWithComments: 0,
      commentsNotPublish:0
};
var publish = false;
if(models.dialect === 'sqlite'){
	publish = 0;
}
var errors = [];
exports.statistics = function(req,res,next){
	//nº preguntas
	models.Quiz.count().then(
	function(numPreguntas){
		statisticVar.quizes = numPreguntas;
		//nº commentarios
		models.Comment.count().then(
		function(numComments){
			statisticVar.comments = numComments;
			//nº comentarios sin publicar
			models.Comment.findAll({where:{publicado: 0}}).then(
			function(commentsNotPublish){
				statisticVar.commentsNotPublish = commentsNotPublish.length;
				//nº preguntas con comentarios
				models.Quiz.findAndCountAll(
				{include:[{
                    model: models.Comment,
                    required: true}],
					distinct: true}).then(
				function(quizesWithComments){
						statisticVar.quizesWithComments=quizesWithComments.count;			
				});
			});
		});
	}).catch(function(err){ errors.push(err);}).finally(function() {
    next();
  });
  };	
exports.show = function (req, res) {
	res.render('quizes/statistics',{statisticVar: statisticVar , errors:[]});
};