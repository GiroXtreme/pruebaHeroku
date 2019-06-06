const hbs = require ('hbs');
const fs = require ('fs');
const path = require("path");
const funciones = require('./funciones');

hbs.registerHelper('listarCursos',(accion)=>{
	listaCursos=[];
	try{
		const file = fs.readFileSync(path.resolve(__dirname, "../data/listadoCursos.json"));
		listaCursos = JSON.parse(file);

	}catch(error){
		listaCursos=[];

	}

	

	nomBoton = "";
	action = "";

	if(accion=='gestionCurso'){

		nomBoton = "Gestionar Curso";
		action = "gestionarCurso";

	}else{

		nomBoton = "Ver más";
		action = "detalleInscripcionCurso";
	}

	let texto = "<table>\
				<thead> \
				<th> Seleccionar </th> \
				<th> Nombre </th> \
				<th> Id </th> \
				<th> Descripción </th> \
				<th> Valor </th>\
				<th> Modalidad </th>\
				<th> Intensidad Horaria (semanal) </th>\
				<th> Estado </th>\
				</thead> \
				<tbody>";

	listaCursos.forEach(curso =>{
		if(accion=='gestionCurso' || curso.estado=='D' ){

			texto = texto +"<tr name='tupla'>"+
				"<td> "+
					"<form action='/"+action+"' method='post'>"+
					"<input type='hidden' name='idCurso' value="+curso.id+">"+
					"<input type='hidden' name='nomCurso' value="+curso.nombre+">"+
					"<button>"+nomBoton+"</button></form>"+
				"</td>" +
				"<td>" + curso.nombre+ "</td>" +
				"<td>" + curso.id+ "</td>" +
				"<td>" + curso.descripcion+ "</td>" +
				"<td>" + curso.valor+ "</td>" +
				"<td>" + curso.modalidad+ "</td>" +
				"<td>" + curso.intensidad+ "</td>" +
				"<td>" + curso.estado+ "</td></tr>" ;


		}
	});

	texto = texto + "</tbody></table>";
	return texto;

});

hbs.registerHelper('listarInscritos',(idCurso)=>{
	listadoInscritos=funciones.listarInscritos(idCurso);



let texto = "<table>\
				<thead> \
				<th> Número de Documento </th> \
				<th> Nombre </th> \
				<th> Email </th> \
				<th> Teléfono </th> \
				<th> Eliminar </th> \
				</thead> \
				<tbody>";

	listadoInscritos.forEach(estudiante =>{

			texto = texto +"<tr name='tupla'>"+
				"<td>" + estudiante.id+ "</td>" +
				"<td>" + estudiante.nombre+ "</td>" +
				"<td>" + estudiante.email+ "</td>" +
				"<td>" + estudiante.telefono+ "</td>" +
				"<td> "+
					"<form action='/eliminarInscrito' method='post'>"+
					"<input type='hidden' name='idEstudiante' value="+estudiante.id+">"+
					"<input type='hidden' name='idCurso' value="+idCurso+">"+
					"<button>Eliminar</button></form>"+
				"</td>" +


				"</tr>" ;
	});

	texto = texto + "</tbody></table>";
	return texto;









});
