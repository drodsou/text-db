
/**
 * tableGroupBy
 * Grouped version of Array.reduce()
 * For non grouped results (no index file to group on) just use Array.reduce() or specify null as indexField
 * @param {string} indexFieldName : tableData column name we'll be grouping on
 * @param {array} groupFields : [ {
 *   @param {string} name : new computed field name,
 *   @param {any} default : default value for this computed field 
 *   @param {function} fn : (
 *     @param {any} currFieldValue: defaults to param 'default', accumulated computed value for current row's index field value (eg id03.count)
 *     @param {object} currDataRowObject : object with whole tableData row
  *  ) => {any} newFieldValue  : to be passed in next row with same 'indexField' thatn current one
 * ]
 */
function tableGroupBy(dataTable, indexFieldName='_none_', groupFields) {

  //let dataTable = this

  let indexFieldValueGroups = {}    // results

  for (let dataRow of dataTable) {
    let dataRowIndexFieldValue = (indexFieldName === '_none_' ? '_all_' : dataRow[indexFieldName]) 

    if (!indexFieldValueGroups[ dataRowIndexFieldValue ]) { 
      indexFieldValueGroups[ dataRowIndexFieldValue ] = {} 
    }  // initialize each index field object where groupd fields will be stored
    let indexFieldValueGroup = indexFieldValueGroups[ dataRowIndexFieldValue ]   // object with accumulated computed groupfields for this dataRow indexfile value (eg id03)

    for (let groupField of groupFields) {
      if (!indexFieldValueGroup[ groupField.name ]) { indexFieldValueGroup[ groupField.name ] = groupField.default }
      indexFieldValueGroup[ groupField.name ] = groupField.fn( 
        indexFieldValueGroup[ groupField.name ],  // curFieldValue (accumulated)
        dataRow
      )
    }
  }

  // -- indexFieldValueGroups 
  let resultTable = []
  for (let indexFieldValue of Object.keys(indexFieldValueGroups)) {
    let indexFieldValueGroup = indexFieldValueGroups[indexFieldValue]

    let resultTableRow = {}
    if (indexFieldValue !== '_all_') {
      resultTableRow[indexFieldName] = indexFieldValue
    }

    resultTableRow = Object.assign(resultTableRow, indexFieldValueGroup)
    resultTable.push( resultTableRow)
  }

  return resultTable
} 




/**
 * tableLeftJoin
 * like SQL lef join several tables together using first one as master
 * @param {string} indexFieldName : index
 * @param {array} tablesArray : [ array of arrayOfObjects(tables) to be joined, ...]
 */
function tableLeftJoin(indexFieldName, tablesArray) {

  let leftTable = tablesArray.slice(0,1)[0]  // copy first table
  
  leftTable.forEach( (leftTableRow,ltrIndex)=>{
    // each row of left table
    let leftTableRowIndexFieldValue = leftTableRow[indexFieldName]

    for (let t=1; t<tablesArray.length; ++t) {
      // each right table: find if has a row that matches this current leftTable index value
      let aRightTable = tablesArray[t]
      let aRightTableFields = Object.keys(aRightTable[0])
      let aRightTableMatchingRow = aRightTable.find(r=>r[indexFieldName]===leftTableRowIndexFieldValue)
      
      // add columns to leftTable (with null if no matching index field record found)
      aRightTableFields.forEach(f=>{
        if (f===indexFieldName) { return }
        let newFieldName = Object.keys(leftTableRow).includes(f) ? 't'+t+'_'+f : f    // if duplicate field name, add t1, t2_ etc before field name
        leftTableRow[newFieldName] = aRightTableMatchingRow ? aRightTableMatchingRow[f] : null
      })
    }

  })

  return leftTable

}


// ---------------------------------------------- EXPORT

module.exports = {tableGroupBy, tableLeftJoin}
// export {tableGroupBy, tableLeftJoin}