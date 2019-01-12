/******************************************************************************************
* Title: PizzaOrder.js
* Author: Franklin Ludgood
* Project: Pizza Server Backend.
* Date Created: 12-20-2018
******************************************************************************************/
var xhttp = new XMLHttpRequest();

let queryString = "/newuser?" + "first=" + firstName + "&" + "last=" + lastName + "&" + "email=" + "&" + "address=" + streetAdress + "&" + "username=" + userName + "password=" + passWord;

xhttp.onreadystatechange = function() {
if (this.readyState == 4)
 {
   //TODO: Finish this.
   let answer = this.responseText + this.status;
   console.log(answer);
 }
};

xhttp.open("POST", queryString, true);
xhttp.send();

//TODO: add and send tokens.
//var token =



function onClickedCheckout()
{

}

function onClickedLogOut()
{

}

function onMouseOverCheckout(component)
{

}

function onMouseOverLogOut(component)
{

}

function onMouseOutCheckout(component)
{

}

function onMouseOutLogOut(component)
{

}
