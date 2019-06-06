const fs = require ('fs');
const path = require("path");

listaCursos=[];
listaEstudiantes=[];
listaInscripciones=[];

const listarCursos = ()=>{
	try{

		const file = fs.readFileSync(path.resolve(__dirname, "../data/listadoCursos.json"));

		listaCursos = JSON.parse(file);

	}catch(error){
		listaCursos=[];
	}

}

const listarEstudiantes = ()=>{
	try{
		const file = fs.readFileSync(path.resolve(__dirname, "../data/listadoEstudiantes.json"));
		listaEstudiantes = JSON.parse(file);

	}catch(error){
		listaEstudiantes=[];
	}

}

const listarInscripciones = ()=>{
	try{
		const file = fs.readFileSync(path.resolve(__dirname, "../data/listadoInscripciones.json"));
		listaInscripciones = JSON.parse(file);

	}catch(error){
		listaInscripciones=[];
	}

}

const guardarCursos = ()=>{

	let datos = JSON.stringify(listaCursos);
	fs.writeFileSync(path.resolve(__dirname, "../data/listadoCursos.json"),datos);

}

const guardarEstudiantes = ()=>{

	let datos = JSON.stringify(listaEstudiantes);
	fs.writeFileSync(path.resolve(__dirname, "../data/listadoEstudiantes.json"),datos);

}

const guardarInscripciones = ()=>{

	let datos = JSON.stringify(listaInscripciones);
	fs.writeFileSync(path.resolve(__dirname, "../data/listadoInscripciones.json"),datos);

}


const crearCurso = (cursoNuevo)=>{

	listarCursos();

	let duplicado = listaCursos.find(cursoBusq => cursoBusq.id==cursoNuevo.idCurso);

	if(!duplicado){
		let curso={
			nombre: cursoNuevo.nomCurso,
			id: cursoNuevo.idCurso,
			descripcion: cursoNuevo.descCurso,
			valor: cursoNuevo.valCurso,
			modalidad: cursoNuevo.modCurso,
			intensidad: cursoNuevo.horasCurso,
			estado: 'D'
		}

		listaCursos.push(curso);

		guardarCursos();

	}else{
		throw ('Ya existe un curso con el Id indicado!:' +cursoNuevo.idCurso);
	}
}

const crearEstudiante = (estNuevo)=>{

	listaEstudiantes.push(estNuevo);
	guardarEstudiantes();
}

const crearInscripcion = (inscNueva)=>{

	listaInscripciones.push(inscNueva);
	guardarInscripciones();
}

const consultarCurso = (idCursoConsultar)=>{
	listarCursos();

	let curso = listaCursos.find(cursoBusq => cursoBusq.id==idCursoConsultar);

	return curso;
}

const consultarEstudiante= (idEstudianteConsultar)=>{
	listarEstudiantes();

	let estudiante = listaEstudiantes.find(estBusq => estBusq.id==idEstudianteConsultar);

	return estudiante;
}

const consultarInscripcion=(idEstudianteConsultar,idCursoConsultar)=>{

	let inscripcion = listaInscripciones.find(inscBusq => (inscBusq.idEstudiante==idEstudianteConsultar &&
														   inscBusq.idCurso==idCursoConsultar));

	return inscripcion;

}

const cerrarCurso = (idCursoCerrar)=>{
	listarCursos();

	let cursoCerrar = consultarCurso(idCursoCerrar);

	cursoCerrar.estado = 'I';
	guardarCursos();
}

const validarRegistroEstCurso=(idEstudianteConsultar,idCursoConsultar)=>{

	listarInscripciones();
	let inscripcion = consultarInscripcion(idEstudianteConsultar,idCursoConsultar);

	if(inscripcion){
		return false;
	}else{
		return true;
	}

}

const inscribirAspirante = (datosInscripcion)=>{
	listarEstudiantes();
	let aspirante = consultarEstudiante(datosInscripcion.id);

	if(!aspirante){

		let estNuevo ={
			id:datosInscripcion.id,
			nombre:datosInscripcion.nombre,
			email:datosInscripcion.email,
			telefono:datosInscripcion.telefono
		}

		crearEstudiante(estNuevo);
	}

	if(validarRegistroEstCurso(datosInscripcion.id,datosInscripcion.idCurso)){

		let inscNueva ={
			idEstudiante:datosInscripcion.id,
			idCurso:datosInscripcion.idCurso
		}

		crearInscripcion(inscNueva);

	}else{
		throw ('El estudiante con documento:' +datosInscripcion.id+
		 'Ya se encuentra inscrito al curso '+datosInscripcion.nomCurso);
	}

}

const listarInscritos=(idCurso)=>{

	listadoInscritos=[];
	regBusqueda=[];

	listarInscripciones();
	regBusqueda = listaInscripciones.filter(inscBusq => (inscBusq.idCurso==idCurso));

	regBusqueda.forEach(reg =>{
		listadoInscritos.push(consultarEstudiante(reg.idEstudiante));
	});
	return listadoInscritos;
}

function filtrarInscrito(inscBusq,idEstudiante, idCurso){
	if (inscBusq.idCurso==idCurso && inscBusq.idEstudiante==idEstudiante){
		return false;
	}else{
		return true;
	}
}

const eliminarInscrito=(idEstudiante, idCurso)=>{
	listarInscripciones();
	regBusqueda = listaInscripciones.filter(inscBusq =>filtrarInscrito(inscBusq,idEstudiante, idCurso) );

	listaInscripciones = regBusqueda;
	guardarInscripciones();

}

module.exports={
	crearCurso,
	cerrarCurso,
	consultarCurso,
	inscribirAspirante,
	listarInscritos,
	eliminarInscrito
}