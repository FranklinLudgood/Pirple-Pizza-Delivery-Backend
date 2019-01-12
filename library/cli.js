/******************************************************************************************
* Title: cli.js
* Author: Franklin Ludgood
* Project: Pizza Server Backend.
* Date Created: 1-8-2019
******************************************************************************************/
var readLine  = require('readline');
var Events    = require('events');

class _events extends Events{};
var event = new _events();

event.on('users login', function(str){
  if (commandLine.callbacks.login)
  {
    commandLine.callbacks.login(str);
  }
});

event.on('total registered users', function(str){
  if (commandLine.callbacks.registered)
  {
    commandLine.callbacks.registered(str);
  }
});

event.on('pizza toppings', function(str){
  if (commandLine.callbacks.toppings)
  {
    commandLine.callbacks.toppings(str);
  }
});


var  commandLine = {};
commandLine.callbacks = {};
commandLine.callbacks.login      = null;
commandLine.callbacks.registered = null;
commandLine.callbacks.toppings   = null;


commandLine.processInput = function(inputString)
{
  let inputStringTrim = '';
  if (typeof(inputString) == 'string' && inputString.trim().length > 0)
  {
    inputStringTrim =  inputString.trim();
    inputStringTrim = inputStringTrim.toLowerCase();
    let keywords = [
      'users login',
      'total registered users',
      'pizza toppings'
    ];

    let matchFound = false;
    keywords.some(function(input){
      if (inputStringTrim.indexOf(input) > -1)
      {
        matchFound = true;
        // Emit event matching the unique input, and include the full string given.
        event.emit(input, inputStringTrim);
        return true;
      }
    });

    if (matchFound === false)
    {
      console.log("Wrong Input try again!");
    }
  }
}

// Init commandLine
commandLine.init = function()
{
  // Send to console, in dark blue
console.log('\x1b[34m%s\x1b[0m','The Server command Line is running.');

 // Starting the interface.
 var cliInterface = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
  });

 // Create an initial prompt.
 cliInterface.prompt();

 // Handle each line of input separately.
 cliInterface.on('line', function (str){

   // Processing input string.
   commandLine.processInput(str);

   // Re-initialize the prompt afterwards
   cliInterface.prompt();
 });

  cliInterface.on('close', function(){
    process.exit(0);
  });

};

module.exports = commandLine;
