/***************************************************************
* Title: Customer.js
* Author: Franklin Ludgood
* Project: Pizza Server Backend.
* Date Created: 11-13-2018
***************************************************************/
var crypto = require("crypto");

const SodaPrice = 2.0;
var SizeEnum  = Object.freeze({"small":0, "medium":1, "large":2, "extraLarge":3});
var SizePrice = Object.freeze({"small":3.75, "medium":4.75, "large":5.75, "extraLarge":6.75});

module.exports = class Customer
{
  constructor(firstName, lastName, email, address, userName, password) {
    this.firstName = firstName;
    this.lastName  = lastName;
    this.email     = email;
    this.address   = address;
    this.userName  = userName;
    this. password = password;
  }

  getFirstName() {return this.firstName;}
  setFirstName(firstName) {this.firstName = firstName;}

  getLastName() {return this.lastName;}
  setLastName(lastName) {this.lastName  = lastName;}

  getEmail() {return this.email;}
  setEmail(email) {this.email = email;}

  getAddress() {return this.address;}
  setAddress(address) {this.address = address;}

  getUserName() {return this.userName;}
  setUserName(userName) {this.userName = userName;}

  getPassWord() {return this.password;}
  setPassWord(password) {this.password = password;}
}

/*

class Topping
{
  constructor(type, price){
    this.type  = type;
    this.price = price;
  }

  getType()  {return this.type;}
  getPrice() {return this.price;}
}

class Pizza
{
  constructor(size)
  {
     this.size = size;
     this.toppings = new Array();
  }

  getSize() {return this.size;}

  getToppings() {return this.toppings;}
  addTopping(topping) {this.toppings.push(topping);}

  getPrice()
  {
    var totalPrice = 0.0;
    for(var i = 0; i < this.toppings.length; ++i)
    {
      totalPrice += this.toppings[i].price;
    }

    return totalPrice;
  }

}

class ShoppingKart
{
  constructor(){}
}
*/
