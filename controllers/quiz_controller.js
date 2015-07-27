var models = require('../models/models.js');

//Autoload - factoriza el codigosi ruta incluye :quizId
exports.load = function(req,res,next,quizId){
	models.Quiz.findById(quizId).then(
		function(quiz){
			if(quiz){
				req.quiz=quiz;
				next();
			}
			else{next(new Error('No existe quizId='+quizId));}		
	})
};

//GET /quizes
exports.index = function(req,res){
	var search="%";
	
	if(req.query.search){//hay busqueda
		search = "%" + req.query.search.trim().replace(/\s+/g,"%") + "%";
	}
	models.Quiz.findAll({where:["upper(pregunta) like ?", search.toUpperCase()], order: 'pregunta ASC'}
			).then(function(quizes){
			res.render('quizes/index',{quizes: quizes, errors:[]});
		}).catch(function(error){next(error);})
};


//GET /quizes/:id
exports.show = function(req,res){
	res.render('quizes/show',{quiz: req.quiz, errors:[]});
};

//GET /quizes/answer
exports.answer = function(req,res){
	var resultado='Incorrecto';
	if(req.query.respuesta ===req.quiz.respuesta){
		resultado='Correcto';
	}
	res.render('quizes/answer',{quiz: req.quiz, respuesta:resultado, errors:[]});
};

//GET /quizes/new
exports.new = function(req,res){
	var quiz= models.Quiz.build(//crea objeto quiz
		{pregunta: "Pregunta", respuesta:"Respuesta"});
	res.render('quizes/new',{quiz: quiz, errors:[]});
};

//POST /quizes/create
exports.create = function(req,res){
	var quiz= models.Quiz.build(req.body.quiz);//crea objeto quiz
	
	quiz.validate().then(
		function(err){
			if(err){
				res.render("quizes/new",{quiz:quiz,errors:err.errors});
			}
			else{
				quiz.save//save:guarda en DB los campos pregunta y respuesta de quiz
				({fields:["pregunta","respuesta"]})
				.then(function(){res.redirect('/quizes')})
			}
		}
	);
};

//GET /quizes/:id/edit
exports.edit = function(req,res){
	var quiz = req.quiz;
	res.render('quizes/edit',{quiz: quiz, errors:[]});
};

//PUT /quizes/:id
exports.update = function(req,res){
	req.quiz.pregunta=req.body.quiz.pregunta;
	req.quiz.respuesta=req.body.quiz.respuesta;
	
	req.quiz.validate().then(
		function(err){
			if(err){
				res.render('quizes/edit',{quiz: req.quiz, errors: err.errors});
			}
			else{//save guarda campos pregunta y respuesta en DB
				req.quiz.save({fields:["pregunta","respuesta"]})
				.then(function(){res.redirect('/quizes');});
			}//redireccion http a lista de preguntas
		}
	);	
};

//DELETE /quizes/:id
exports.destroy = function(req,res){	
	req.quiz.destroy().then(function(){res.redirect('/quizes');})
	.catch(function(error){next(error)});
};