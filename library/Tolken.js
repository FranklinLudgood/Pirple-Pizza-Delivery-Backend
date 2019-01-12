/***************************************************************
* Title: Tolken.js
* Author: Franklin Ludgood
* Project: Pizza Server Backend.
* Date Created: 11-17-2018
***************************************************************/
var crypto = require("crypto");

const idLength = 64;

module.exports = class Tolken
{
  constructor(timeToLive, customer)
  {
    this.id = crypto.randomBytes(idLength).toString('hex');
    this.timeToLive = timeToLive;
    this.previousTime = Date.now();
    this.customer = customer;
  }

  getCustomer() {return this.customer;}

  getID() {return this.id;}

  isAlive()
  {
    var currentTime = Date.now();
    var alive = ((currentTime - this.previousTime) > this.timeToLive);
    this.previousTime = currentTime;
    return alive;
  }

  resetTimer()
  {
    this.previousTime = Date.now();
    this.id = crypto.randomBytes(idLength).toString('hex');
  }
}
