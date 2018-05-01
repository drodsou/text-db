const fs = require('fs')
const Papa = require('papaparse')


class CsvFile {
  
  constructor(filename) {
    this.filename = filename
    this.reload()
  }

  reload () {
    this.data={}
    try {
      let parsedCsv = Papa.parse( fs.readFileSync(this.filename, 'utf8') ,{
        header:true, 
        comments:true,
        skipEmptyLines: true,
        trimHeader:true
        ,dynamicTyping:true
        // delimiter:',',
        // quoteChar: '"',
        // newline : '\n',
      })
      this.data = parsedCsv.data
      this.errors = parsedCsv.errors

      return {error:false}
    }
    catch (err) {
      return {error:err}
    }
  }

  async save () {
    try {
      await new Promise(resolve=>{
        fs.writeFile(this.filename, 
          Papa.unparse(this.data),  
          'utf8', 
          resolve)
      })
      return {error:false}
    }
    catch (err) {
      return {error:err}
    }
  }
}


module.exports = CsvFile
//export {CsvFile}











