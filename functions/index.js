'use strict';


var recipe_file = require('./recipe.json');
var current_step = 0;
process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// a. the action name from the make_name Dialogflow intent
const NAME_ACTION = 'cook_food';
const CONFIRM_FOOD_ACTION = 'confirm_food_name';
// b. the parameters that are parsed from the cook_food intent
const FOOD_NAME = 'name';


exports.suggestRecipe = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // An action is a string used to identify what needs to be done in fulfillment
  let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters

  // Parameters are any entites that Dialogflow has extracted from the request.
  const parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters

  // Contexts are objects used to track and store conversation state
  const inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts

  var session = admin.database().ref('/sessions/' + request.body.sessionId)

  // Get the request source (Google Assistant, Slack, API, etc) and initialize DialogflowApp
  const requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;

// c. The function that suggests recipe
  function recipe (app) {
    let name = app.getArgument(FOOD_NAME);
    app.tell('Alright, the recipe is ' +
      name + '! I hope you like it. See you next time.');
  }

// Function that lists the ingredients
  function readIngredients (app) {
    var ingredients = '';
    recipe_file.ingredients.forEach(function(obj) {
      ingredients += obj.name + '    ';
      console.log(ingredients);
    });
    app.tell('Alright, lets start with the ingredients : ' + ingredients);
  }

  // Function that confirms if all ingredients are present
  function confirmIngredients (app) {

  }
// functions that traverse the steps
  function sayStep (app) {
    current_step = app.data.current_step;
    app.tell(recipe_file.ingredients[current_step]);
  }

  function stepsPrevious (app) {
    let name = app.getArgument(FOOD_NAME);
    current_step -= 1;
    if(current_step < 0) current_step = 0;
    app.data = { current_step : current_step };
    sayStep(app);
  }

  function stepsRepeat (app) {
    let name = app.getArgument(FOOD_NAME);
    app.data = { current_step : current_step };
    sayStep(app);
    app.tell('Step ' + session.get('step') + '. Put Jam on the plate again and again');
  }

  function stepsNext (app) {
    let name = app.getArgument(FOOD_NAME);
    current_step += 1;
    if(current_step > recipe_file.ingredients.length) current_step = recipe_file.ingredients.length;
    app.data = { current_step : current_step };
    sayStep(app);
  //  app.tell('Flip Jam like rollercoaster');
  }

  function startCooking (app) {
    session.set({step: 1})
    app.tell('OK');
  }

  // d. build an action map, which maps intent names to functions
  let actionMap = new Map();
  actionMap.set('confirm_food_name.confirm_food_name-yes', readIngredients);
  actionMap.set('steps.previous', stepsPrevious);
  actionMap.set('steps.repeat', stepsRepeat);
  actionMap.set('steps.next', stepsNext);
  actionMap.set('steps.start', startCooking);

app.handleRequest(actionMap);
});
