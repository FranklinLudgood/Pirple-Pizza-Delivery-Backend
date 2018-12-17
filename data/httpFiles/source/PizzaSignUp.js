/******************************************************************************************
* Title: PizzaSignUp.js
* Author: Franklin Ludgood
* Project: Pizza Server Backend.
* Date Created: 12-15-2018
******************************************************************************************/

var xhttp = new XMLHttpRequest();
var firstName    = '';
var lastName     = '';
var emailAdress  = '';
var streetAdress = '';
var userName     ='';
var passWord     ='';

//////////////////////////////////
//function reset.
//////////////////////////////////
function reset()
{
  firstName    = '';
  lastName     = '';
  emailAdress  = '';
  streetAdress = '';
  userName     ='';
  passWord     ='';
}

///////////////////////////////
//Event function for signup
//////////////////////////////
function onClicked()
{
  firstName = document.getElementById("first").value;
  if (firstName.length <= 0)
  {
    reset();
    return;
  }

   lastName = document.getElementById("last").value;
  if (lastName.length <= 0)
  {
    reset();
    return;
  }

  emailAdress = document.getElementById("email").value
  if (emailAdress.length  <= 0)
  {
    reset();
    return;
  }

  streetAdress = document.getElementById("address").value
  if (streetAdress.length <= 0)
  {
    reset();
    return;
  }

  userName = document.getElementById("username").value
  if (userName.length <= 0)
  {
    reset();
    return;
  }

  passWord = document.getElementById("password").value;
  if (passWord.length <= 0)
  {
    reset();
    return;
  }

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

}

//////////////////////////////////
//Event function for signup
/////////////////////////////////
function onMouseOver(component)
{

}

////////////////////////////////
//Event function for signup
///////////////////////////////
function onMouseOut(component)
{

}
