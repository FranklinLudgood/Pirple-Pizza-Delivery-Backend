/******************************************************************************************
* Title: main.js
* Author: Franklin Ludgood
* Project: Pizza Server Backend.
* Date Created: 10-17-2018
******************************************************************************************/

// Includes for project
const https = require("https");
const http = require("http");
const StringDecoder = require('string_decoder').StringDecoder;
const queryString = require('querystring');

const url = require("url");
const config = require("./library/config");
const fileSystem = require('fs');
const Customer = require("./library/Customer");
const Tolken = require("./library/Tolken");

// Global variables.
var tolkenMap = new Map();
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
* Function used for logout
*/
function Logout(queryValue, response)
{
  let tolken = tolkenMap.get(queryValue['tolken'].toString());
  if (tolken != undefined)
  {
    if (tolken.customer.userName === queryValue['username'])
    {
      if (tolkenMap.delete(queryValue['tolken'].toString()))
      {
        response.setHeader('Content-Type', 'text/plain');
        response.writeHead(200);
        response.end('Successfully logged off.');
        return;
      }
    }
  }

  response.setHeader('Content-Type', 'text/plain');
  response.writeHead(409);
  response.end('Error could not logout.');
}

/*
* Function used for login.
*/
function Login(queryValue, response)
{
  // checkout make sure that it is not logged in.
  for(const entry of tolkenMap)
  {
    let object = Object.values(entry);
    if (object[1].customer.userName === queryValue['username'])
    {
      response.setHeader('Content-Type', 'text/plain');
      response.writeHead(409);
      response.end('Already logged in.');
      return;
    }
  }

  for(let i = 0; i < customerArray.length; ++i)
  {
    if (customerArray[i].getUserName() === queryValue['username'])
    {
       if (customerArray[i].getPassWord() ===  queryValue['passphrase'])
       {
         var tolken = new Tolken(timeToLive, customerArray[i]);
         tolkenMap.set(tolken.getID().toString(), tolken);
         response.setHeader('Content-Type', 'text/plain');
         response.writeHead(200);
         response.end(tolken.getID().toString());
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

  if (request.method == 'POST' && trimmedPath === 'logout')
  {
    request.on('data', function (data) {
      buffer += decoder.write(data);
    });

    request.on('end', function () {
      buffer += decoder.end();
      Logout(queryStringObject, response);
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
