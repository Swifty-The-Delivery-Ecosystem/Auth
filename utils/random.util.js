const randomString = require('randomstring');
const crypto = require('crypto');

exports.randomEmail = ()=>{
  return randomString.generate(7)+ '@' + randomString.generate(5) + '.' + randomString.generate(3);
}

exports.randomName = () => {
  return randomString.generate(7);
}

exports.randomPhone = () => {
  return crypto.randomInt(6000000000, 9999999999+1);
}

exports.randomLocation = ()=>{
  return crypto.randomInt(1,8);
}

exports.randomVeg = ()=>{
  return [0,1][crypto.randomInt(0,2)];
}

exports.randomPassword = ()=>{
  return randomString.generate(10);

}

