function get_temp() {
  
  
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  //The main function of the script, it receives date, country and city, extracting the day and month from the date, and calling the get_coordinates and check weather_functions
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  function body(dates, country, city){
    var date = new Date(dates);
    var day = date.getDate();
    if( day < 10){
      var day = "0"+day;
    } 
    var month = date.getMonth()+1;
    if( month < 10){
      month = "0"+month;
    }
    var coord =  get_coordinates(country, city);
    var check = check_weather(country, city, month, day, coord[0], coord[1]);
    return [day+"/"+month, check[0] , check[1]];           
  }
  
  
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  // this function will generate an array with the last 14 days 
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  function get_lust_14_days(){   
    var dates = []
    var endDate = new Date ();
    var startDate = new Date();
    startDate.setDate( startDate.getDate() -13);
    while (startDate.getTime() <= endDate.getTime() ) {
      dates.push ( [new Date(startDate)] );
      startDate.setDate( startDate.getDate() +1);
    }
    return dates
  }
  
  
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  //this function uses mapquestapi to get the coordinates of the country or a city in the country ***NOTE: the api is limited to 1000 uses per day + it uses MY key
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  function get_coordinates(country,city){
    var link = "http://www.mapquestapi.com/geocoding/v1/address?key=AYzQHAGezTNSnWOGUnNvrwyYTFJ9lkCH&location="+country+","+city+"&outformat=json";
    var coordinates = UrlFetchApp.fetch(link, {muteHttpExceptions: true});
    if (coordinates.getResponseCode() >= 200 && coordinates.getResponseCode() < 400){
      var jcoor = JSON.parse(coordinates.getContentText());
      var lat = jcoor.results[0].locations[0].displayLatLng.lat;
      var lon = jcoor.results[0].locations[0].displayLatLng.lng;
      return [lat, lon];    
    }
    else{
      Logger.log("The city "+city+" in country "+country+" doesn't exist! Kindly check");
      return[0, 0]
    }
  }
  
  
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  // This function using climacell api to get the temperature and the humidity of a specific location (provided coordinates) in a specific day of a specific month
  // NOTE: the function tries my api key, if its not working it will use Yvis and if  even Yvis script wont work it will use Rons
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  function check_weather( country, city, month, day, lat, lon){
    //arkadys key
    var link = "https://api.climacell.co/v3/weather/historical/station?start_time=2020-"+month+"-"+day+"T12%3A00%3A00Z&end_time=2020-"+month+"-"+day+"T12%3A10%3A00Z&lat="+lat+"&lon="+lon+"&fields=humidity,temp&unit_system=si&apikey=QArSjTlBxmYcRoN0Odv3pDDsvge1gkVJ"
    //yvis key
    var link2 = "https://api.climacell.co/v3/weather/historical/station?start_time=2020-"+month+"-"+day+"T12%3A00%3A00Z&end_time=2020-"+month+"-"+day+"T12%3A10%3A00Z&lat="+lat+"&lon="+lon+"&fields=humidity,temp&unit_system=si&apikey=G1BYAnZi1h74C2zX4APeYJg7ppbMrrtS"
    //Rons key
    var link3 = "https://api.climacell.co/v3/weather/historical/station?start_time=2020-"+month+"-"+day+"T12%3A00%3A00Z&end_time=2020-"+month+"-"+day+"T12%3A10%3A00Z&lat="+lat+"&lon="+lon+"&fields=humidity,temp&unit_system=si&apikey=XkuZueAhsU1z0n5FyJNLxnxk2HCSgCem"
    var text = UrlFetchApp.fetch(link, {muteHttpExceptions: true});
    if (text.getResponseCode() >= 200 && text.getResponseCode() < 400){
      var json = JSON.parse(text.getContentText());
      var humidity = json[0].temp.value;
      var temp = json[0].humidity.value;
      return [ temp , humidity+"%"];
    }
    else{
      var text = UrlFetchApp.fetch(link2, {muteHttpExceptions: true});
      if (text.getResponseCode() >= 200 && text.getResponseCode() < 400){
      var json = JSON.parse(text.getContentText());
      var humidity = json[0].temp.value;
      var temp = json[0].humidity.value;
      return [ temp , humidity+"%"];
      }
      else{
        var text = UrlFetchApp.fetch(link3, {muteHttpExceptions: true});
        if (text.getResponseCode() >= 200 && text.getResponseCode() < 400){
          var json = JSON.parse(text.getContentText());
          var humidity = json[0].temp.value;
          var temp = json[0].humidity.value;
          return [ temp , humidity+"%"];
        }
        else{
          Logger.log("Couldn't find wheather information for "+country+" "+city+" at "+day+"/"+month+" try a different date please.");
          return ["x", "x"+"%"];
        }
      }
      
      
    }
  }
  
  
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  //                                                            THE SCRIPT!!!
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  //reading the country list in a sheet named 1, receiving an array of the last 14 dates  creating a sheet for every country and writing the data in each of them
  //----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var places = ss.getSheetByName ('1').getDataRange().getValues()
  var dates = get_lust_14_days();
  for(j=0;j<places.length;j++){
    var stat = [["date", "temperature", "humidity"]]
    var country = places[j][0]
    var city = places[j][1]
    for(i=0; i<dates.length; i++){
      stat.push(body(dates[i], country, city));
    }
    ss.insertSheet(country+"/"+city);
    ss.getSheetByName(country+"/"+city).clear().getRange(1,1,stat.length,stat[0].length).setValues(stat);
    Logger.log(stat)
    
  }
}