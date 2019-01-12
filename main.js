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
var  commandLine = require("./library/cli");

// Global variables.
var tolkenMap = new Map();
var timeToLive = 900000;

// reading in html files.
var IntroHtml       = fileSystem.readFileSync('data/httpFiles/PizzaLanding.html');
var IntroCss        = fileSystem.readFileSync('data/httpFiles/source/PizzaLanding.css');
var IntroJavaScript = fileSystem.readFileSync('data/httpFiles/source/PizzaLanding.js');

// log on to
var LogOnHtml       = fileSystem.readFileSync('data/httpFiles/PizzaLogOn.html');
var LogOnCss        = fileSystem.readFileSync('data/httpFiles/source/PizzaLogOn.css');
var LogOnJavaScript = fileSystem.readFileSync('data/httpFiles/source/PizzaLogOn.js');

// Sign Up Pizza Delivery.
var SignUpHtml       = fileSystem.readFileSync('data/httpFiles/PizzaSignUp.html');
var SignUpCss        = fileSystem.readFileSync('data/httpFiles/source/PizzaSignUp.css');
var SignUpJavaScript = fileSystem.readFileSync('data/httpFiles/source/PizzaSignUp.js');

// Pizza Ordering.
var HeaderPizzaOrder      = fileSystem.readFileSync('data/httpFiles/header.html');
var FooterPizzaOrder      = fileSystem.readFileSync('data/httpFiles/footer.html');
var PizzaOrderCss         = fileSystem.readFileSync('data/httpFiles/source/PizzaOrder.css');
var PizzaSignUpJavaScript = fileSystem.readFileSync('data/httpFiles/source/PizzaOrder.js');

// Reading in customer json file.
var customerArray = new Array();
var rawdata = fileSystem.readFileSync('data/Users.json');
if (rawdata.length > 0)
{
  let objects = JSON.parse(rawdata);
  for(let i = 0; i < objects.length; ++i)
  {
    let user = objects[i];
    customerArray.push(new Customer(user['firstName'], user['lastName'], user['email'], user['address'], user['userName'], user['password']));
  }
}

// Reading in toppings json file.
//var toppingArray = new Array();
rawdata = fileSystem.readFileSync('data/Toppings.json');
if (rawdata.length > 0)
{
  let objects = JSON.parse(rawdata);
  let small =  objects['Small'];
  let medium =  objects['Medium'];
  let large =  objects['Large'];
  var LargePrice = large['price'];
  var MediumPrice = medium['price'];
  var SmallPrice =  small['price'];

  var toppingArray = objects['Toppings'];
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
         let tolken = new Tolken(timeToLive, customerArray[i]);
         tolkenMap.set(tolken.getID().toString(), tolken);

         // Sending http file.
         let header = "<h1>Rashaan's Pizza Shack!!</h1>";
         let toppings = '';
         let sizeRadio  = "<input type=\"radio\" id=\"small\" name=\"size\" value=\"${SmallPrice}\"> Small";
         sizeRadio     += "<input type=\"radio\" id=\"medium\" name=\"size\" value=\"${MediumPrice}\"> Medium";
         sizeRadio     += "<input type=\"radio\" id=\"larger\" name=\"size\" value=\"${LargePrice}\"> Large";

          for (let j = 0; j < toppingArray.length; ++j)
          {
           let label = toppingArray[j]['type'];
           let value = toppingArray[j]['price'];
           toppings += "<input type=\"checkbox\" id=\"${toppingArray['type']}\" name=\"topping\" value=\"" +  value.toString() + "\">" + label.toString();
          }

          let buttons =  "<button type=\"button\" id=\"Checkout\" onclick=\"onClickedCheckout()\" onmouseover=\"onMouseOverCheckout(this)\" onmouseout=\"onMouseOutCheckout(this)\">Checkout</button>";
          buttons     += "<button type=\"button\" id=\"LogOut\" onclick=\"onClickedLogOut()\" onmouseover=\"onMouseOverLogOut(this)\" onmouseout=\"onMouseOutLogOut(this)\">Log Out</button>";
          let script = "<script type=\"text/javascript\" src=\"PizzaOrder.js\"></script>";


         let htmlFile  = HeaderPizzaOrder;
         htmlFile     += header;
         htmlFile     += sizeRadio;
         htmlFile     += toppings;
         htmlFile     += buttons;
         htmlFile     += script;
         htmlFile     += FooterPizzaOrder;
         response.setHeader('Content-Type', 'text/html');
         response.writeHead(200);
         response.end(htmlFile);
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

   if(request.method == "GET" && trimmedPath === "PizzaSignUp.html")
   {
     response.setHeader("Content-Type", "text/html");
     response.writeHead(200);
     response.end(SignUpHtml);
   }

   if ((request.method == 'GET' || request.method == 'POST') &&  trimmedPath === 'PizzaOrder.css')
   {
     response.setHeader("Content-Type", "text/css");
     response.writeHead(200);
     response.end(PizzaOrderCss);
   }

   if ((request.method == 'GET' || request.method == 'POST') &&  trimmedPath === 'PizzaOrder.js')
   {
     response.setHeader("Content-Type", "text/javascript");
     response.writeHead(200);
     response.end(PizzaSignUpJavaScript);
   }

   if ((request.method == 'GET' || request.method == 'POST') &&  trimmedPath === 'PizzaSignUp.css')
   {
     response.setHeader("Content-Type", "text/css");
     response.writeHead(200);
     response.end(SignUpCss);
   }

   if ((request.method == 'GET' || request.method == 'POST') &&  trimmedPath === 'PizzaSignUp.js')
   {
     response.setHeader("Content-Type", "text/javascript");
     response.writeHead(200);
     response.end(SignUpJavaScript);
   }

  if(request.method == "GET" && trimmedPath === "PizzaLogOn.html")
  {
    response.setHeader("Content-Type", "text/html");
    response.writeHead(200);
    response.end(LogOnHtml);
  }

  if ((request.method == 'GET' || request.method == 'POST') &&  trimmedPath === 'PizzaLogOn.css')
  {
    response.setHeader("Content-Type", "text/css");
    response.writeHead(200);
    response.end(LogOnCss);
  }

  if ((request.method == 'GET' || request.method == 'POST') &&  trimmedPath === 'PizzaLogOn.js')
  {
    response.setHeader("Content-Type", "text/javascript");
    response.writeHead(200);
    response.end(LogOnJavaScript);
  }

   if ((request.method == 'GET' || request.method == 'POST') &&  trimmedPath === 'PizzaLanding.css')
   {
     response.setHeader("Content-Type", "text/css");
     response.writeHead(200);
     response.end(IntroCss);
   }

   if ((request.method == 'GET' || request.method == 'POST') &&  trimmedPath === 'PizzaLanding.js')
   {
     response.setHeader("Content-Type", "text/javascript");
     response.writeHead(200);
     response.end(IntroJavaScript);
   }

   if (request.method == 'GET' && trimmedPath === '')
   {
     response.setHeader("Content-Type", "text/html");
     response.writeHead(200);
     response.end(IntroHtml);
   }

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

commandLine.callbacks.login = function(str)
{
  console.log("************************************************************");
  console.log("*               Customer's Login                           *");
  console.log("************************************************************");
  console.log("Number of people logged on: " +  tolkenMap.size);
  for(const entry of tolkenMap)
  {
    let object = Object.values(entry);
    let customer =  "Last Name: " + object[1].customer.lastName.toString() + " First Name: " +  object[1].customer.firstName + " email: " + object[1].customer.email.toString();
    console.log(customer);
  }
}

commandLine.callbacks.registered = function(str)
{
  console.log("************************************************************");
  console.log("*            Registered Customer                           *");
  console.log("************************************************************");
  for(let i = 0; i < customerArray.length; ++i)
  {
    let customer = "Last Name: " + customerArray[i].lastName.toString() + " First Name: " +  customerArray[i].firstName + " email: " + customerArray[i].email.toString();
    console.log(customer);
  }
}

commandLine.callbacks.toppings = function(str)
{
  console.log("************************************************************");
  console.log("*                PIZZA TOPPINGS                            *");
  console.log("************************************************************");
  for (let j = 0; j < toppingArray.length; ++j)
  {
   let label = toppingArray[j]['type'];
   let value = toppingArray[j]['price'];
   let toppings = label.toString() + ": " +  value.toString();
   console.log(toppings);
  }
}

// Starting the cli and timing
setTimeout(function(){
  commandLine.init();
}, 500);

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
