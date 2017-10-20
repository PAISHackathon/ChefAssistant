'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');


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
    app.tell('Alright, lets start with the ingredients');
    // Logic to read from json
    //var data

  }

  // Function that confirms if all ingredients are present
    function confirmIngredients (app) {

    }
  // d. build an action map, which maps intent names to functions
  let actionMap = new Map();
  actionMap.set('confirm_food_name.confirm_food_name-yes', readIngredients);


app.handleRequest(actionMap);
});
