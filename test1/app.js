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
app.use(bodyParser.urlencoded({ extended: true }));
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
// mqttClient.subscribe('s_val/dust/uid/cur_val');
// mqttClient.subscribe('s_val/humid/uid/cur_val');
// mqttClient.subscribe('s_val/lumi/uid/cur_val');
// mqttClient.subscribe('s_val/temp/uid/cur_val');
mqttClient.subscribe('iot_state/uid/cleaner/state');
mqttClient.subscribe('iot_state/uid/air_con/state');
mqttClient.subscribe('iot_state/uid/dehumid/state');
mqttClient.subscribe('iot_state/uid/doorlock/state');
mqttClient.subscribe('iot_state/uid/table/state');
mqttClient.subscribe('iot_state/uid/window/state');


// mqttClient.subscribe('users/custom_uid/name');


/***************************************** 
** MQTT Handler Settings !
******************************************/
// Subscribe event
mqttClient.on('message', (topic, message) => {
  // console.log('/*********************************');
  // console.log('/*       Subscribe MQTT ');
  // console.log('/*********************************');
  own_topic = topic;
  topic = topic.split('/');
  // console.log('topic : ' + topic);
  // console.log('   >>>       ' + own_topic + ' : ' + message.toString());


  //update firebase database
  // console.log('update firebase database...');
  // var usersRef = firebase.database().ref().child(topic[0]+'/'+topic[1]);
  // usersRef.update({
  //   name : message.toString()
  // });


  if (topic[0] == 's_val') {
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
    var userRef = firebase.database().ref().child(topic[0] + '/' + topic[1] + '/' + topic[2]);
    userRef.update({
      cur_val: message.toString()
    })
  }
  if (topic[0] == 'iot_state') {
    var userRef = firebase.database().ref().child(topic[0] + '/' + topic[1] + '/' + topic[2]);
    userRef.update({
      state: message.toString()
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
  // console.log('update complete...');
  // console.log('firebase Completely update !!');
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
var passwordRef = firebase.database().ref('iot_state/uid/doorlock/pw');
passwordRef.on('value', function (snapshot) {
  console.log('password update! : ' + snapshot.val());
  mqttClient.publish('iot_state/uid/doorlock/pw', snapshot.val().toString());
});


/***************************************** 
** Door Lock State Listener !
******************************************/
var doorStateRef = firebase.database().ref('iot_state/uid/doorlock/state');
doorStateRef.on('value', function (snapshot) {
  console.log('doorlock : ' + snapshot.val());
  mqttClient.publish('iot_state/uid/doorlock/state', snapshot.val().toString());
});


/***************************************** 
** air conditioner State Listener !
******************************************/
var airconStateRef = firebase.database().ref('iot_state/uid/air_con/state');
airconStateRef.on('value', function (snapshot) {
  console.log('aircon State : ' + snapshot.val());
  mqttClient.publish('iot_state/uid/air_con/state', snapshot.val());
});


/***************************************** 
** air cleaner State listener !
******************************************/
var cleanerStateRef = firebase.database().ref('iot_state/uid/cleaner/state');
cleanerStateRef.on('value', function (snapshot) {
  console.log('cleaner State : ' + snapshot.val());
  mqttClient.publish('iot_state/uid/cleaner/state', snapshot.val());
});


/***************************************** 
** dehumidifier State listener !
******************************************/
var dehumStateRef = firebase.database().ref('iot_state/uid/dehumid/state');
dehumStateRef.on('value', function (snapshot) {
  console.log('dehumidifier State : ' + snapshot.val());
  mqttClient.publish('iot_state/uid/dehumid/state', snapshot.val());
});


/***************************************** 
** table State listener !
******************************************/
var tableStateRef = firebase.database().ref('iot_state/uid/table/state');
tableStateRef.on('value', function (snapshot) {
  console.log('table : ' + snapshot.val());
  mqttClient.publish('iot_state/uid/table/state', snapshot.val());
});


/***************************************** 
** window State listener !
******************************************/
var windowStateRef = firebase.database().ref('iot_state/uid/window/state');
windowStateRef.on('value', function (snapshot) {
  console.log('window : ' + snapshot.val());
  mqttClient.publish('iot_state/uid/window/state', snapshot.val());
});



/***************************************** 
** SENSOR(fine_dust) listener !
******************************************/
var dustRef = firebase.database().ref('s_val/dust/uid/cur_val');
firebase.database().ref('iot_state/uid/window/state').once('value').then(function (snapshot) {
  //창문 현재 상태 확인
  var cur_val = snapshot.val();
  dustRef.on('value', function (snapshot) {
    var val = snapshot.val();
    console.log('fine_dust : ' + val);

    //숫자로 변형
    val *= 1;
    var userRef = firebase.database().ref().child('iot_state/uid/window');

    //미세먼지 최악
    if (val <= 200) {
      console.log('under 200');
      if (val <= 150) {
        console.log('under 150');
        if (val <= 100) {
          console.log('under 100');
          if (val <= 50) {
            console.log('under 50');
            //최고로 좋음
            //창문 닫혀있다면 열기
            console.log('cur_val : ' + cur_val);
            if (cur_val == 'CLOSE') {
              console.log('pub open');
              cur_val = "OPEN"
              mqttClient.publish('iot_state/uid/window/state', "OPEN");
              userRef.update({
                state: 'OPEN'
              })
            }
          } else {
            //창문 열려있다면 닫기
            console.log('cur_val : ' + cur_val.toString());
            if (cur_val == 'OPEN') {
              console.log('pub close');
              cur_val = "CLOSE"

              mqttClient.publish('iot_state/uid/window/state', 'CLOSE');
              userRef.update({
                state: 'CLOSE'
              })
            }
            //나쁨
          }
        } else {
          console.log('cur_val : ' + cur_val.toString());

          //창문 열려있다면 닫기
          if (cur_val == 'OPEN') {
            cur_val = "CLOSE"

            console.log('pub close');
            mqttClient.publish('iot_state/uid/window/state', 'CLOSE');
            userRef.update({
              state: 'CLOSE'
            })
          }
        }
        //상당히 나쁨
      } else {
        console.log('cur_val : ' + cur_val.toString());

        //창문 열려있다면 닫기
        if (cur_val == 'OPEN') {
          cur_val = "CLOSE"

          console.log('pub close');
          mqttClient.publish('iot_state/uid/window/state', 'CLOSE');
          userRef.update({
            state: 'CLOSE'
          })
        }
        //최악일 때 할 것
      }
    }
  });
});



/***************************************** 
** SENSOR(humidity) listener !
******************************************/
var humidRef = firebase.database().ref('s_val/humid/uid/cur_val');
firebase.database().ref('iot_state/uid/dehumid/state').once('value').then(function (snapshot) {
  //현재 제습기 상태
  console.log('들어옴들어옴 ');
  var cur_val = snapshot.val();
  console.log('제습기 현재 상태 : ' + cur_val);
  humidRef.on('value', function (snapshot) {
    console.log('humidity : ' + snapshot.val());
    //창문 현재 상태 확인
    //습도는 0~100%까지 존재
    var val = snapshot.val();
    val *= 1;
    console.log('습도 : ' + val);
    console.log('제습기 상태 : ' + cur_val);
    var userRef = firebase.database().ref().child('iot_state/uid/dehumid');

    if (val >= 50) {
      //제습기가 가동중이 아니라면
      console.log('50보다 높을때 : ' + val);
      console.log('cur_val : ' + cur_val);
      if (cur_val == 'OFF') {
        console.log('꺼져있으면 : ' + val);
        cur_val = 'ON'
        mqttClient.publish('iot_state/uid/dehumid/state', 'ON');
        userRef.update({
          state: 'ON'
        })
      }
      //제습기 가동
    }
    else if (val <= 30) {
      //제습기가 가동중이라면 
      console.log('가동중인데 30보다 아래 : ' + val);

      if (cur_val == 'ON') {
        cur_val = 'OFF'
        mqttClient.publish('iot_state/uid/dehumid/state', 'OFF');
        userRef.update({
          state: 'OFF'
        })
      }
      //제습기 정지
    }
  });
});



/***************************************** 
** SENSOR(illuminance) listener !
******************************************/
var lumiRef = firebase.database().ref('s_val/lumi/uid/cur_val');
firebase.database().ref('iot_state/uid/table/alarm').once('value').then(function (snapshot) {
  cur_val = snapshot.val();
  lumiRef.on('value', function (snapshot) {
    console.log('illuminance : ' + snapshot.val());
    var val = snapshot.val();
    val *= 1;
    var userRef = firebase.database().ref().child('iot_state/uid/table');


    //테이블에 물건이 있는경우
    if (val <= 350) {
      //현재 알람이 꺼져 있다면 
      //물건을 가져가라고 알람을 ON해줌
      if (cur_val == 'OFF') {
        console.log('alarm on!!!!!');
        cur_val = 'ON'
        mqttClient.publish('iot_state/uid/table/alarm', "ON");
        userRef.update({
          alarm: 'ON'
        })
      }
    }
    else {
      //알람이 켜져있다면 알람을 끄기
      //알람이 꺼져있다면 아무 행동도 하지 않음
      if (cur_val == 'ON') {
        console.log('alarm off!!!!!!');
        cur_val = 'OFF'
        mqttClient.publish('iot_state/uid/table/alarm', "OFF");
        userRef.update({
          alarm: 'OFF'
        })
      }
    }
  });
});


/***************************************** 
** SENSOR(temperature) listener !
******************************************/
var tempRef = firebase.database().ref('s_val/temp/uid/cur_val');
firebase.database().ref('iot_state/uid/air_con/state').once('value').then(function (snapshot) {
  //에어컨 현재 상태
  cur_val = snapshot.val();
  // console.log(cur_val);

  tempRef.on('value', function (snapshot) {
    console.log('temperature : ' + snapshot.val());
    var val = snapshot.val();
    val *= 1;
    // console.log('tmp : ' + cur_val);
    var userRef = firebase.database().ref().child('iot_state/uid/air_con');
    if (val >= 30) {
      //에어컨이 가동중이 아니라면
      //30도가 넘으면 에어컨 가동
      // if (cur_val == 'OFF') {
      //   cur_val = 'ON'
      //   mqttClient.publish('iot_state/uid/air_con/state', 'ON');
      //   userRef.update({
      //     state: 'ON'
      //   })
      // }
      cur_val = 'ON'
      mqttClient.publish('iot_state/uid/air_con/state',"ON");
      userRef.update({
        state:"ON"
      })
    }
    else if (val <= 25) {
      //에어컨이 가동되고 있다면 가동 중지
      // if (cur_val == 'ON') {
        cur_val = 'OFF'
        mqttClient.publish('iot_state/uid/air_con/state', 'OFF');
        userRef.update({
          state: 'OFF'
        })
      }
    // }
  });
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
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
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
