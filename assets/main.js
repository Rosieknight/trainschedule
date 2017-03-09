// Initialize Firebase
var config = {
    apiKey: "AIzaSyD-93rDpmNILKwZ1TQgD24gFB8BrLkav5s",
    authDomain: "train-schedule-223b6.firebaseapp.com",
    databaseURL: "https://train-schedule-223b6.firebaseio.com",
    storageBucket: "train-schedule-223b6.appspot.com",
    messagingSenderId: "1031970789762"
};

firebase.initializeApp(config);

//Using this variable for the database because it's easy to remember. 
var database = firebase.database();

//New trains are added below:
$("#addTrain").on("click", function(event){
	event.preventDefault();

	//Storing input in variables until...
	var trainName = $("#newTrainName").val().trim();
	var trainEnd = $("#newDestination").val().trim();
	var firstTrain = moment($("#newFirst").val().trim(), "HH:mm").format();
	var trainFreque = $("#newFrequency").val().trim();
	
	//the variable are turned into an object..
	var newTrain = {
		name: trainName,
		destination: trainEnd,
		first: firstTrain,
		frequency: trainFreque
	};

	//and then pushed to firebase.
	database.ref().push(newTrain);

	//Alert for tracking purposes.
	alert("You've added a new train!");

	//Clear the input form.
	$("#newTrainName").val("");
	$("#newDestination").val("");
	$("#newFirst").val("");
	$("#newFrequency").val("");
});

//Updates firebase database and then creates a new row in the table.
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  //The demo takes advantage of scope and reuses the variables, but I didn't.
  //It's less confusing that way, I think.
  var nameOfTrain = childSnapshot.val().name;
  var endOfLine = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().first;
  var tFrequency = childSnapshot.val().frequency;

  //The math for next arrival and minutes away.
  //Converting the first run data.
  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  
  //The current time. (AKA the very unoriginal variable name.)
  var currentTime = moment();
  
  //Current Time minus First Run time.
  var diffTime = moment().diff(firstTimeConverted, "minutes");
  
  //If the remainder = 0, the train is there. Otherwise, we need to convert it.
  var tRemainder = diffTime % tFrequency;
  
  //Figuring out how long until the next train.
  var tMinutesTillTrain = tFrequency - tRemainder;
  
  //Next Train is officially set to arrive at this time.
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  
  //Push it all the schedule.
  $("#trainTable > tbody").append("<tr><td>" + nameOfTrain + "</td><td>" + 
  	endOfLine + "</td><td>" + tFrequency + "</td><td class='nextHere'>" + 
  	nextTrain.format("HH:mm") + "</td><td class='tilHere'>" + tMinutesTillTrain + 
  	"</td></tr>");
});

//I know this is probably not what you meant by updating the train times,
//but it does work. It also doesn't repeat the first value for the whole
//table, delete anything in the final column, or generate NAN errors. If 
//I had more time, I'd play around with it some more.
setInterval(function(){
	location.reload();
}, 60*1000);