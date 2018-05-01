const CsvFile = require('./csvFile')
const {tableGroupBy, tableLeftJoin} = require('./tableUtil')

let fPerson = new CsvFile('./csv/person.csv')
let fPersonCourse = new CsvFile('./csv/person-course.csv')

console.log(fPerson.data)
console.log('----------------------\n')
console.log(fPersonCourse.data)
console.log('----------------------\n')


// -- cursos/alumno
let groupedCoursesByPerson = tableGroupBy(fPersonCourse.data, 'id_person', [
  { name:'numCoursesPerson', default:0, fn: (acc,row)=>++acc },
  { name:'concatCoursesPerson', default:'', fn:(acc,row)=>acc + (acc?',':'') + row.course },
  { name:'lastCourseYear', default:'', fn:(acc,row)=>row.year>acc?row.year:acc }
])


console.log(groupedCoursesByPerson)
console.log('----------------------\n')


let joinedTables = tableLeftJoin('id_person', [fPerson.data, groupedCoursesByPerson])
console.log(joinedTables)
console.log('----------------------\n')

// -- test
//console.log(JSON.stringify(joinedTables))
if (JSON.stringify(joinedTables) !== `[{"id_person":"a1","nombre":"devid","lastname":"redrid","numCoursesPerson":2,"concatCoursesPerson":"procoder wannaby,youtubefy","lastCourseYear":2016},{"id_person":"a2","nombre":"patriz","lastname":"lechúr","numCoursesPerson":1,"concatCoursesPerson":"hippieness all along","lastCourseYear":2018},{"id_person":"a3","nombre":"matheus","lastname":"lewar","numCoursesPerson":2,"concatCoursesPerson":"becoming you,youtubefy","lastCourseYear":2018},{"id_person":"a4","nombre":"lehare","lastname":"deperr","numCoursesPerson":null,"concatCoursesPerson":null,"lastCourseYear":null}]`) {
  console.log('test FAILED!')
  process.exit(1)
}
else {
  console.log('test OK')
}



