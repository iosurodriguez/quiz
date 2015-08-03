//MW de autorizacion de accesos HTTP restringidos
exports.loginRequired = function(req,res,next){
	if(req.session.user){
		next();
	}
	else{
		res.redirect('/login');
	}
}

//GET /login
exports.new = function(req,res){
	var errors = req.session.errors ||{};
	req.session.errors={};
	
	res.render('sessions/new',{errors:errors});
};

//POST /login
exports.create = function(req,res){
	var login = req.body.login;
	var password = req.body.password;
	
	var userController=require('./user_controller');
	userController.autenticar(login,password,function(error,user){
		if(error){
			req.session.errors=[{"message":'Se ha producido un error: '+error}];
			res.redirect("/login");
		}
		
		//crear req.session.user y guardar campos id y username
		//La sesion se define por la existencia de: req.session.user
		req.session.user = {id:user.id,username:user.username,isAdmin: user.isAdmin};
		req.session.ultimaAccion = (new Date()).getTime();
		//res.redirect(req.session.redir.toString());//redireccion a path anterior a login
		res.redirect("/");//redireccion a path anterior a login
	});
};

//DELETE /logout
exports.destroy = function(req,res){
	delete req.session.user;
	//res.redirect(req.session.redir.toString());
	res.redirect("/");
};