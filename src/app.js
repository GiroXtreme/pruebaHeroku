const express= require('express');
const app = express();
const path= require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const funciones = require('./funciones');

require('./helpers');


const directorioPublico = path.join(__dirname,'../public');
const directorioPartials = path.join(__dirname,'../partials');

const puertoDespliegue = process.env.PORT||3000;


hbs.registerPartials(directorioPartials);

app.use(express.static(directorioPublico));
app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine','hbs');

app.get('/',(req,res)=>{
	res.render('index',{
		rol:'Invitado'
	});
});

app.get('*',(req,res)=>{
	res.render('error404',{
		rol: ''
	})
});

app.post('/menuRol',(req,res)=>{
	res.render('menu'+req.body.rol,{
		rol: req.body.rol
	});
});

app.post('/crearCurso',(req,res)=>{

	console.log('Debe gestionar con:');
	console.log(req.body);

	try{

		funciones.crearCurso(req.body);
		mensaje = 'La creación del curso '+req.body.nomCurso+ ' ha sido exitosa!';

		res.render('confirmacion',{
			rol: req.body.rol,
			mensaje: mensaje
		});


	}catch(error){
		res.render('error',{
			rol: req.body.rol,
			mensaje: error
		});
		console.log(error);
	}

});

app.post('/gestionarCurso',(req,res)=>{

	res.render('gestionCurso',{
			rol: 'Coordinador',
			idCurso: req.body.idCurso,
			nomCurso: req.body.nomCurso
		});
});

app.post('/cerrarCurso',(req,res)=>{
	try{

		funciones.cerrarCurso(req.body.idCurso);
		mensaje = 'El curso '+req.body.nomCurso+ ' ha sido cerrado!';
		res.render('confirmacion',{
			rol: 'Coordinador',
			mensaje: mensaje
		});

	}catch(error){
		res.render('error',{
			rol: 'Coordinador',
			mensaje: error
		});
		console.log(error);
	}

});

app.post('/detalleInscripcionCurso',(req,res)=>{

	cursoInsc = funciones.consultarCurso(req.body.idCurso);

	res.render('detalleInscripcionCurso',{
			rol: 'Invitado',
			cursoInsc: cursoInsc
		});

});

app.post('/inscribirAspirante',(req,res)=>{

	try{

		funciones.inscribirAspirante(req.body);
		mensaje = 'El aspirante '+req.body.nombre+ ' ha quedado inscrito al curso:'+req.body.nomCurso;
		res.render('confirmacion',{
			rol: req.body.nombre,
			mensaje: mensaje
		});

	}catch(error){
		res.render('error',{
			rol: 'Invitado',
			mensaje: error
		});
		console.log(error);
	}

});

app.post('/eliminarInscrito',(req,res)=>{

	try{

		funciones.eliminarInscrito(req.body.idEstudiante, req.body.idCurso);
		mensaje = 'El aspirante '+req.body.idEstudiante+ ' ha sido dado de baja del curso.';
		res.render('confirmacion',{
			rol: 'Coordinador',
			mensaje: mensaje
		});

	}catch(error){
		res.render('error',{
			rol: 'Coordinador',
			mensaje: error
		});
		console.log(error);
	}
	});

app.listen(puertoDespliegue,()=>{
	console.log('Servidor en el puerto'+puertoDespliegue);
});