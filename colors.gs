function myFunction() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i = 170; i < sheets.length ; i++ ) {
    var sheet = sheets[i];
    var range = sheet.getDataRange();
    var numRows = range.getNumRows();
    var numColumns = range.getNumColumns();
    for (var x = 1; x < numColumns+1; x++){
      var colName = sheet.getRange(2, x).getValue();
      if( colName == "humidity (%)" || colName == "humidity"){
        for (var j = 3; j < numRows+1; j++) {
          var valu = sheet.getRange(j, x).getValue();
          if (valu <= 1){
            var value = valu * 100  
          }
          else{
            var value = valu
          }
          var cell = sheet.getRange(j, x)
          if (!cell.isBlank()){
            if (value <= 25 ) {
              cell.setBackground("red");   
            }      
            else if(value < 75 && value > 25){
              cell.setBackground("yellow"); 
            }
            else if(value >= 75){
              cell.setBackground("green"); 
            }
          }
        }
      }
    }
  }
}
