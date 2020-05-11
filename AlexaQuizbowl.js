'strict mode';



var http = require('http');




exports.handler = function(event, context) {
    try {
        // Good to initalize attributes
         var request = event.request;
         var session = event.session;
        if(!event.session.attributes) {
          event.session.attributes = {};
        }
        

         if (request.type === "LaunchRequest") {
           handleLaunchRequest(context);
    
         } else if (request.type === "IntentRequest") {
           
           if (request.intent.name === "QuestionIntent") {
             
             handleHelloIntent(request, context);
             
           } else if(request.intent.name === "QuoteIntent") {
             
             handleQuoteIntent(request,context,session);
             
           } else if(request.intent.name === "NextQuoteIntent") {
             
             handleNextQuoteIntent(request, context, session);
             
           } else if(request.intent.name === "BuzzIntent") {
             
             buzzIntent(request, context, session);
             
           } else if(request.intent.name === "AMAZON.HelpIntent") {
             
             let options = {};
             options.speechText = "Hey, just say the category that you would like to practice in.";
             options.endSession = false;
             context.succeed(buildResponse(options));
             
           } else if(request.intent.name === "AMAZON.FallbackIntent") {
             
             let options = {};
             options.speechText = "Oh no looks like something went wrong, try again by saying a category";
             options.endSession = false;
             context.succeed(buildResponse(options));
             
           } else if(request.intent.name === "AMAZON.StopIntent" || request.intent.name === "AMAZON.CancelIntent") {
             
             // Maybe put some logic in this one
             context.succeed(buildResponse({
               speechText: "You got " + points + " out of " + (negPoints + points) + " points.",
               endSession: true
               
             }));
           }  else {
              throw "Unknown Intent";
           }
    
          } else if (request.type === "SessionEndedRequest") {
    
          } else {
             throw "Unknown intent type";
          }
           
       } catch(e) {
         context.fail("Excpetion: " + e);
       }
};



function buildResponse(options) {
  var response = {
    version: 1.0,
    response: {
      outputSpeech: {
        type: "SSML",
        ssml: "<speak>" + options.speechText + "</speak>"
      },
      shouldEndSession: options.endSession
    }
  };

  if(options.repromptText) {
    response.response.reprompt = {
      outputSpeech: {
        type: "SSML",
        ssml: "<speak>" + options.repromptText + "</speak>"
      }
    };
  }
  
  if(options.session && options.session.attributes) {
    response.sessionAttributes = options.session.attributes;
  }
  
  return response;
  
}

function handleLaunchRequest(context) {
  let options = {};
           options.speechText = "Welcome <break time=\".08s\"/>, what category would you like to practice in?";
           options.repromptText = " You can say for example, history ";
           options.endSession = false;
           context.succeed(buildResponse(options));
}


var config = require('./questions.json');

function getRandomInt(max) {
  return Math.floor((Math.random() * Math.floor(max)));
}

 

var answer = "";
var text = "";

function Category(name) {
var category = "";
var difficulty = "";
while(category !== name && difficulty !== "HS") {
   var randomNumber = getRandomInt(2000);
   category = config.questions[randomNumber].category;
   difficulty = config.questions[randomNumber].difficulty;
   text = config.questions[randomNumber].text;
   answer = config.questions[randomNumber].answer.split();
  }
  return [text, answer];
}


var negPoints = 0;
var value = "";
var vals = "";
function handleHelloIntent(request, context) {
  let options = {};
  var name = request.intent.slots.name.value; 
  if(name.indexOf("history") != -1) {
    value = "History";
    vals = Category(value);
    options.speechText = vals[0];
    options.speechText += "Would you like another history question?" ;
    options.endSession = false;
    negPoints++;
    context.succeed(buildResponse(options));
  } else if (name.indexOf("literature") != -1 || name.indexOf("english") != -1) {
    value = "Literature";
    vals = Category(value);
    options.speechText = vals[0];
    options.speechText += "Would you like another literature question?";
    options.endSession = false;
    context.succeed(buildResponse(options));
    negPoints++;
  } else if (name.indexOf("science") != -1) {
    value = "Science";
    vals = Category(value);
    options.speechText = vals[0];
    options.speechText += "Would you like another science question?";
    options.endSession = false;
    context.succeed(buildResponse(options)); 
    negPoints++;
  } else if (name.indexOf("philosphy") != -1 || name.indexOf("philosophy") != -1 || name.indexOf("Philosophy") != -1 || name.indexOf("Philosophy") != -1)  {
    value = "Philosophy";
    vals = Category(value);
    options.speechText = vals[0];
    options.speechText += "Would you like another philosphy question?";
    options.endSession = false;
    context.succeed(buildResponse(options)); 
    negPoints++;
  } else if (name.indexOf("Fine Arts ") != -1 || name.indexOf("fine arts") != -1 || name.indexOf("humanities") != -1 || name.indexOf("finearts") != -1 || name.indexOf("arts") != -1 || name.indexOf("art") != -1 )  {
    value = "Fine Arts";
    vals = Category(value);
    options.speechText = vals[0];
    options.speechText += "Would you like another fine arts question?";
    options.endSession = false;
    context.succeed(buildResponse(options)); 
    negPoints++;
  } else if (name.indexOf("stem") != -1 || name.indexOf("math") != -1 || name.indexOf("mathematics") != -1 || name.indexOf("random") != -1 || name.indexOf("general") != -1 || name.indexOf("ath") != -1)  {
    options.speechText = "Looks like we don't support that category currently. Try again.";
    options.endSession = true;
    context.succeed(buildResponse(options)); 
  }  else {
    options.speechText = "Oh no looks like something went wrong<break time=\".1s\"/>, restart the skill by asking alexa to open it again.";
    options.endSession = true;
    context.succeed(buildResponse(options));
  }
}

var points = 0;


function buzzIntent(request, context) {
  let options = {};
  var cal =  request.intent.slots.buzz.value;
  cal = (String) (cal);
  cal = cal.toLowerCase();
  var cowss = vals[1];
  cowss = cowss = (String)(cowss);
  cowss = cowss.toString().replace("-", "");
  cowss = cowss.toString().replace("(", "");
  cowss = cowss.toString().replace(")", "");
  cowss = cowss.toString().replace("[", "");
  cowss = cowss.toString().replace("]", "");
  cowss = cowss.toString().replace("/", "");
  cowss = cowss.toLowerCase();
  if( cowss.includes(cal))  {
    options.speechText = "Correct!" + "<break time=\".5s\"/>" + " Would you like another question?";
    points+=1;
    options.endSession = false;

    context.succeed(buildResponse(options));
    
  } else {
    options.speechText = "Wrong, the answer was " + vals[1] + "<break time=\".5s\"/>" + " Would you like another question";
    options.endSession = false;

    context.succeed(buildResponse(options));

  }


  
}

function handleQuoteIntent(request,context,session) {
  let options = {};
  options.session = session;
                vals = Category(value);
                options.speechText =  vals[0];
                options.speechText += "Would you like another question?";
                options.repromptText = "You can say yes <break time=\".1s\"/> or one more.";
                options.session.attributes.quoteIntent= true;
                options.endSession = false;
                context.succeed(buildResponse(options));
              }
              
function handleNextQuoteIntent(request, context, session) {
  let options = {};
  options.session = session;
                vals = Category(value);
                options.speechText = vals[0];
                options.speechText += "Would you like another question?";
                options.repromptText = "You can say yes <break time=\".1s\"/> or one more.";
                session.attributes.quoteIntent= true;
                options.endSession = false;
                context.succeed(buildResponse(options));
              
              }
            