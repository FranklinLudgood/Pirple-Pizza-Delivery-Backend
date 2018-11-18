/******************************************************************************************
* Title: main.js
* Author: Franklin Ludgood
* Project: Pizza Server Backend.
* Date Created: 10-17-2018
******************************************************************************************/

// Includes for project
var https = require("https");
var http = require("http");
var StringDecoder = require('string_decoder').StringDecoder;
var queryString = require('querystring');

var url = require("url");
var config = require("./library/config");
var fileSystem = require('fs');
var Customer = require("./library/Customer");
var Tolken = require("./library/Tolken");

// Global variables.
var tolkenArray = new Array();
var timeToLive = 900000;

// Reading in customer json file.
var customerArray = new Array();
var rawdata = fileSystem.readFileSync('data/Users.json');
if (rawdata.length > 0)
{
  var objects = JSON.parse(rawdata);
  for(var i = 0; i < objects.length; ++i)
  {
    var user = objects[i];
    customerArray.push(new Customer(user['firstName'], user['lastName'], user['email'], user['address'], user['userName'], user['password']));
  }
}

/*
* Function used for login.
*/
function Login(queryValue, response)
{
  // checkout make sure that it is not logged in.
  for(var i = 0; i <  tolkenArray.length; ++i)
  {
    if (tolkenArray[i].getCustomer().getUserName() === queryValue['username'])
    {
      response.setHeader('Content-Type', 'text/plain');
      response.writeHead(409);
      response.end('Already logged in.');
      return;
    }
  }
  
  for(var i = 0; i < customerArray.length; ++i)
  {
    if (customerArray[i].getUserName() === queryValue['username'])
    {
       if (customerArray[i].getPassWord() ===  queryValue['passphrase'])
       {
         var tolken = new Tolken(timeToLive, customerArray[i]);
         tolkenArray.push(tolken);
         response.setHeader('Content-Type', 'text/plain');
         response.writeHead(200);
         response.end(tolken.getID());
         return;
       }
       else
       {
         response.setHeader('Content-Type', 'text/plain');
         response.writeHead(409);
         response.end('Wrong password.');
         return;
       }
    }
  }

  response.setHeader('Content-Type', 'text/plain');
  response.writeHead(409);
  response.end('Could not log in.');
}

/*
* Function used for creating new users.
*/
function CreateNewUser(queryValue, response)
{
  var newCustomer = new Customer(queryValue['first'], queryValue['last'], queryValue['email'], queryValue['address'], queryValue['username'], queryValue['password']);
  for(var i = 0; i < customerArray.length; ++i)
  {
    if ((customerArray[i].getUserName() === newCustomer.getUserName()) || (customerArray[i].getEmail() === newCustomer.getEmail()))
    {
      response.setHeader('Content-Type', 'text/plain');
      response.writeHead(409);
      response.end('Created User Failed.');
      return;
    }
  }
  customerArray.push(newCustomer);
  fileSystem.writeFileSync('data/Users.json', JSON.stringify(customerArray));

//TODO: populate and add toppings to toppings json.

  // Return the response
 //response.setHeader('Content-Type', 'application/json');
 response.setHeader('Content-Type', 'text/plain');
 response.writeHead(200);
 response.end('New user created.');
}

// Function used for parsing server request.
function unifiedServerCode(request, response)
{
 // Parse the url
 var parsedUrl = url.parse(request.url, true);

 // Get the query string as an object.
 var queryStringObject = parsedUrl.query;

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

   // Get the payload
   var decoder = new StringDecoder('utf-8');
   var buffer = '';
   if (request.method == 'POST' && trimmedPath === 'newuser')
   {
      request.on('data', function (data) {
      buffer += decoder.write(data);
    });

    request.on('end', function () {
      buffer += decoder.end();
      CreateNewUser(queryStringObject, response);
    });
  }

  if (request.method == 'GET' && trimmedPath === 'login')
  {
    request.on('data', function (data) {
      buffer += decoder.write(data);
    });

    request.on('end', function () {
      buffer += decoder.end();
      Login(queryStringObject, response);
    });

  }
}

// Creating http server.
var httpServer = http.createServer(function(request, response)
{
  unifiedServerCode(request, response);
});

// Start the HTTP server
httpServer.listen(config.httpPort,function(){
  console.log('The HTTP server is running on port '+config.httpPort);
});

// Creating https server.
var httpsServerOption = {
  'key'  : fileSystem.readFileSync('./https/privateKey.pem'),
  'cert' : fileSystem.readFileSync('./https/cert.pem'),
  'passphrase' : 'passphrase'
};

var httpsServer = https.createServer(httpsServerOption, function(request, response)
{
  unifiedServerCode(request, response);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort,function(){
 console.log('The HTTPS server is running on port '+config.httpsPort);
});
