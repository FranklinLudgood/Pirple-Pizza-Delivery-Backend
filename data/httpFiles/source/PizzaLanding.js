/******************************************************************************************
* Title: PizzaLanding.js
* Author: Franklin Ludgood
* Project: Pizza Server Backend.
* Date Created: 12-10-2018
******************************************************************************************/

var xhttp = new XMLHttpRequest();

function onSignUpClick()
{
  alert('Sign Up');
  xhttp.open("POST", "PizzaSignUp.html", true);
  xhttp.send();
}

function onLogOnClick()
{
  alert('Log On');
  xhttp.open("POST", "PizzaLogOn.html", true);
  xhttp.send();
}

function onMouseOutSignUp(component)
{

}

function onMouseOutLogOn(component)
{

}

function onMouseOverSignUp(component)
{

}

function onMouseOverLogOn(component)
{

}
