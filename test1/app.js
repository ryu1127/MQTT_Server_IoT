/***************************************** 
2018.11.19 ++ Dongheon for MQTT

Smart Home IoT Project

name : Dongheon Ryu
Version : 1.0.0
******************************************/


/***************************************** 
** Load Module
******************************************/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
//++ add firebase module
var firebase = require('firebase');


/*****/
console.log('Initialize variable...\n');

/***************************************** 
** 
******************************************/


//for body parser 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/***************************************** 
** Configure MQTT
******************************************/
var mqtt = require('mqtt');
//Broker's IP Address
var mqttClient = mqtt.connect('mqtt://localhost:1883');

/**log**/
console.log('mqtt Successfully Connect...');

/***************************************** 
** Configure for MQTT Publish Event!
******************************************/
//Publish Event
mqttClient.on('connect', () => {
  console.log('Connected to MQTT for Publishing...');
});

console.log('MQTT Handler Settings Complete...');

/***************************************** 
** Subscribe MQTT Topics
******************************************/
mqttClient.subscribe('sensor_values/fine_dust/uid/current_value');
mqttClient.subscribe('sensor_values/humidity/uid/current_value');
mqttClient.subscribe('sensor_values/illuminance/uid/current_value');
mqttClient.subscribe('sensor_values/temperature/uid/current_value');
mqttClient.subscribe('iot_state/uid/air_cleaner/state');
mqttClient.subscribe('iot_state/uid/air_conditioner/state');
mqttClient.subscribe('iot_state/uid/dehumidifier/state');
mqttClient.subscribe('iot_state/uid/doorlock/state');
mqttClient.subscribe('iot_state/uid/table/state');
mqttClient.subscribe('iot_state/uid/window/state');


// mqttClient.subscribe('users/custom_uid/name');


/***************************************** 
** MQTT Handler Settings !
******************************************/
// Subscribe event
mqttClient.on('message', (topic,message) => {
  console.log('Subscribe MQTT *******');
  topic = topic.split('/');
  console.log('topic : '+topic);
  console.log(message.toString());

    //update firebase database
    // console.log('update firebase database...');
    // var usersRef = firebase.database().ref().child(topic[0]+'/'+topic[1]);
    // usersRef.update({
    //   name : message.toString()
    // });

    console.log('update complete...');
    console.log('firebase Completely update !!');

  if(topic[0]=='sensor_values'){
    // if(topic[1]=='fine_dust'){
    //   var userRef = firebase.database().ref().child(topic[0]+'/'+topic[1]+'/'+topic[2]);
    //   userRef.update({
    //     current_value : message.toString()
    //   })
    // }else if(topic[1]=='humidity'){
    //   var userRef = firebase.database().ref().child(topic[0]+'/'+topic[1]+'/'+topic[2]);
    //   userRef.update({
    //     current_value : message.toString()
    //   })
    // }else if(topic[1]=='illuminance'){
    //   var userRef = firebase.database().ref().child(topic[0]+'/'+topic[1]+'/'+topic[2]);
    //   userRef.update({
    //     current_value : message.toString()
    //   })
    // }else if(topic[1]=='temperature'){
    //   var userRef = firebase.database().ref().child(topic[0]+'/'+topic[1]+'/'+topic[2]);
    //   userRef.update({
    //     current_value : message.toString()
    //   })
    // }
    var userRef = firebase.database().ref().child(topic[0]+'/'+topic[1]+'/'+topic[2]);
    userRef.update({
      current_value : message.toString()
    })
  }
  if(topic[0]=='iot_state'){
    var userRef = firebase.database().ref().child(topic[0]+'/'+topic[1]+'/'+topic[2]);
    userRef.update({
      state : message.toString()
    })
  }


  // //set firebase database
  // console.log('set firebase database...');
  // var lockerRef = firebase.database().ref().child(topic[0]+'/'+topic[1]);
  // lockerRef.set({
  //   password : message.toString()
  // });
  // console.log('set complete...');

  //update firebase database
  // console.log('update firebase database...');
  // var usersRef = firebase.database().ref().child(topic[0]+'/'+topic[1]);
  // usersRef.update({
  //   name : message.toString()
  // });
  console.log('update complete...');
  console.log('firebase Completely update !!');
});





/***************************************** 
** Configure Firebase
******************************************/

  // Configuration for firebase 
  var config = {
    apiKey: "AIzaSyCXejis-IpYqTa4eO0jxUGZBFjATvOJofc",
    authDomain: "smart-doorlock-9fe12.firebaseapp.com",
    databaseURL: "https://smart-doorlock-9fe12.firebaseio.com/",
  };
  firebase.initializeApp(config);

  /**log**/
console.log('Firebase Initialize App Complete...');

  // Get a reference to the database service
  var database = firebase.database();

  /**log**/
console.log('Firebase Database Connection Settings Complete...');

/********************************************************************************** 
************************* Firebase listener Settings  !
***********************************************************************************/
console.log('Firebase listener settings start...');

/***************************************** 
** Door Lock Password Listener !
******************************************/
// State Change Listener
var passwordRef = firebase.database().ref('iot_state/uid/doorlock/password');
passwordRef.on('value',function(snapshot){
  console.log('password update! : ' + snapshot.val());
  mqttClient.publish('iot_state/uid/doorlock/password',snapshot.val().toString());
});
/***************************************** 
** Door Lock State Listener !
******************************************/
var doorStateRef = firebase.database().ref('iot_state/uid/doorlock/state');
doorStateRef.on('value',function(snapshot){
  console.log('doorlock : '+ snapshot.val());
  mqttClient.publish('iot_state/uid/doorlock/state',snapshot.val().toString());
});
/***************************************** 
** air conditioner State Listener !
******************************************/
var airconStateRef = firebase.database().ref('iot_state/uid/air_conditioner/state');
airconStateRef.on('value',function(snapshot){
  console.log('aircon State : '+ snapshot.val());
});
/***************************************** 
** air cleaner State listener !
******************************************/
var cleanerStateRef = firebase.database().ref('iot_state/uid/air_cleaner/state');
cleanerStateRef.on('value',function(snapshot){
  console.log('cleaner State : '+ snapshot.val());
});
/***************************************** 
** dehumidifier State listener !
******************************************/
var dehumStateRef = firebase.database().ref('iot_state/uid/dehumidifier/state');
dehumStateRef.on('value',function(snapshot){
  console.log('dehumidifier State : '+ snapshot.val());
});
/***************************************** 
** table State listener !
******************************************/
var tableStateRef = firebase.database().ref('iot_state/uid/table/state');
tableStateRef.on('value',function(snapshot){
  console.log('table : '+ snapshot.val());
});
/***************************************** 
** window State listener !
******************************************/
var windowStateRef = firebase.database().ref('iot_state/uid/window/state');
windowStateRef.on('value',function(snapshot){
  console.log('window : '+ snapshot.val());
});
/***************************************** 
** SENSOR(fine_dust) listener !
******************************************/
var sensorRef = firebase.database().ref('sensor_values/fine_dust/uid/current_value');
windowStateRef.on('value',function(snapshot){
  console.log('fine_dust : '+ snapshot.val());
  var val = snapshot.val();
  //숫자로 변형
  val *= 1;
  //미세먼지 최악
  if(val <= 200){
    if(val <= 150){
      if(val <= 100){
        if(val <= 50){
          //최고로 좋음
          //창문 닫혀있다면 열기
        }
        //창문 열려있다면 닫기
        //나쁨
      }
      //창문 열려있다면 닫기
      //상당히 나쁨
    }
    //창문 열려있다면 닫기
    //최악일 때 할 것
  }
});
/***************************************** 
** SENSOR(humidity) listener !
******************************************/
var sensorRef = firebase.database().ref('sensor_values/humidity/uid/current_value');
windowStateRef.on('value',function(snapshot){
  console.log('humidity : '+ snapshot.val());
  //습도는 0~100%까지 존재
  var val = snapshot.val();
  val *= 1;
  if(val >= 50){
    //제습기가 가동중이 아니라면
    //제습기 가동
  }
  else if(val < 30){
    //제습기가 가동중이라면 
    //제습기 정지
  }

});
/***************************************** 
** SENSOR(illuminance) listener !
******************************************/
var sensorRef = firebase.database().ref('sensor_values/illuminance/uid/current_value');
windowStateRef.on('value',function(snapshot){
  console.log('illuminance : '+ snapshot.val());
  var val = snapshot.val();
  val *= 1;
});
/***************************************** 
** SENSOR(temperature) listener !
******************************************/
var sensorRef = firebase.database().ref('sensor_values/temperature/uid/current_value');
windowStateRef.on('value',function(snapshot){
  console.log('temperature : '+ snapshot.val());
  var val = snapshot.val();
  val *= 1;
});







/* Define Port */
var port = process.env.PORT || 3000;

/**log**/
console.log('Port Settings Complete...');


/***************************************** 
** Route
******************************************/
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/**log**/
console.log('Router settings complete...');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**log**/
console.log('App Engine settings complete...');


/***************************************** 
** Setting Routes
******************************************/
app.use('/', indexRouter);
app.use('/users', usersRouter);

/**log**/
console.log('Router set complete...');


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**log**/
console.log('Handler setting complete...');


var server = app.listen(port, () => {
  /**log**/
  console.log('Ready to open server...');

  console.log("Express server has started on port" + port);
});

module.exports = app;
