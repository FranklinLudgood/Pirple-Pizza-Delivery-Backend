/******************************************************************************************
* Title: PizzaLogOn.css
* Author: Franklin Ludgood
* Project: Pizza Server Backend.
* Date Created: 12-12-2018
******************************************************************************************/

var xhttp = new XMLHttpRequest();
var userName = '';
var passPhrase = '';
var nextHtml = '';
var tolken = {};

// function used to load a new html document.
function loadNewHtmlFile()
{
  if (nextHtml != '')
  {
    document.open("text/html", "replace");
    document.write(nextHtml);
    document.close();
    nextHtml = '';
  }
}

function reset()
{
  userName = '';
  passPhrase = '';
}

function onClicked()
{
  passPhrase = document.getElementById("passphrase").value;
  if (passPhrase.length <= 0)
  {
    reset();
    return;
  }

  userName = document.getElementById("username").value;
  if (userName.length <= 0)
  {
    reset();
    return;
  }

  let queryString = "/login?" + "username=" + userName + "&" + "passphrase=" + passPhrase;

  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200)
   {
     nextHtml = this.responseText;
     reloadReady = true;
   }
  };

  xhttp.open("GET", queryString, true);
  xhttp.send();
  loadNewHtmlFile();
}

function onMouseOverLogOn(component)
{

}

function onMouseOutLogOn(component)
{

}
