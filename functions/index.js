'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');


// a. the action name from the make_name Dialogflow intent
const NAME_ACTION = 'cook_food';
// b. the parameters that are parsed from the cook_food intent
const FOOD_NAME = 'name';


exports.suggestRecipe = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));


// c. The function that suggests recipe
  function recipe (app) {
    let name = app.getArgument(FOOD_NAME);
    app.tell('Alright, the recipe is ' +
      name + '! I hope you like it. See you next time.');
  }
  // d. build an action map, which maps intent names to functions
  let actionMap = new Map();
  actionMap.set(NAME_ACTION, makeName);


app.handleRequest(actionMap);
});
