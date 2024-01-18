const randomstring = require('randomstring');
const random = require('random');

exports.randomEmail = ()=>{
  return randomString.generate(7)+ '@' + randomString.generate(5) + '.' + randomString.generate(3);
}

exports.randomName = () => {
  return randomString.generate(7);
}

exports.randomPhone = () => {
  return random.Int(6000000000, 9999999999);
}

exports.randomLocation = ()=>{
  return random.Int(1,8);
}

exports.randomVeg = ()=>{
  return random.choice([0,1]);
}

