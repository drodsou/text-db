const CsvFile = require('./csvFile')
const {tableGroupBy, tableLeftJoin} = require('./tableUtil')

let fAlumno = new CsvFile('./csvDb/alumnos.csv')
let fAlumnoCurso = new CsvFile('./csvDb/alumno-curso.csv')

console.log(fAlumno.data)
console.log('----------------------\n')
console.log(fAlumnoCurso.data)
console.log('----------------------\n')


// -- cursos/alumno
let numCursosAlumnos = tableGroupBy(fAlumnoCurso.data, 'id_person', [
  { name:'numCursosAlumno', default:0, fn: (acc,row)=>++acc },
  { name:'concatCursosAlumno', default:'', fn:(acc,row)=>acc + (acc?',':'') + row.curso },
  { name:'ultAno', default:'', fn:(acc,row)=>row.ano>acc?row.ano:acc }
])


console.log(numCursosAlumnos)
console.log('----------------------\n')


let joined = tableLeftJoin('id_person', [fAlumno.data, numCursosAlumnos])
console.log(joined)
console.log('----------------------\n')

console.log(stringify(joined))



