/******************************************************************************************
* Title: PizzaLanding.js
* Author: Franklin Ludgood
* Project: Pizza Server Backend.
* Date Created: 12-10-2018
******************************************************************************************/


var nextHtml = '';
var reloadReady = false;

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200)
 {
   nextHtml = this.responseText;
   reloadReady = true;
 }
};

// function used to load a new html document.
function loadNewHtmlFile()
{
  if (nextHtml != '' && reloadReady == true)
  {
    document.open("text/html", "replace");
    document.write(nextHtml);
    document.close();
    reloadReady = false;
    nextHtml = '';
  }
}

function onSignUpClick()
{
  xhttp.open("GET", "PizzaSignUp.html", true);
  xhttp.send();
  loadNewHtmlFile();
}

function onLogOnClick()
{
  xhttp.open("GET", "PizzaLogOn.html", true);
  xhttp.send();
  loadNewHtmlFile();
}

function onMouseOutSignUp()
{
  //let element = document.getElementById("SignUp");
}

function onMouseOutLogOn()
{
   //let element = document.getElementById("LogOn");
}

function onMouseOverSignUp()
{
  //let element = document.getElementById("SignUp");
}

function onMouseOverLogOn()
{
  //let element = document.getElementById("LogOn");
}
