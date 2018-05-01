const fs = require('fs')

class JsonFile {
  
  constructor(filename) {
    this.filename = filename
    this.reload()
  }

  reload () {
    this.data={}
    try {
      this.data = JSON.parse( fs.readFileSync(this.filename, 'utf8') )  
      return {error:false}
    }
    catch (err) {
      return {error:err}
    }
  }

  async save () {
    try {
      await new Promise(resolve=>{
        fs.writeFile(this.filename, JSON.stringify(this.data,null,2),  'utf8', resolve)
      })
      return {error:false}
    }
    catch (err) {
      return {error:err}
    }
  }
}

module.exports = JsonFile
//export {JsonFile}