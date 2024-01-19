const app = require('../../../index');
const request = require('supertest');
const randomUtils = require('../../../utils/random.util');
const {
  USER_NOT_FOUND_ERR,
  MAIL_ALREADY_EXISTS_ERR,
  INCORRECT_OTP_ERR,
  INCORRECT_CRED_ERR,
  ACCESS_DENIED_ERR,
  EMAIL_NOT_FOUND_ERR,
  OTP_EXPIRED_ERR
} = require("../../../errors");


describe('POST /register', function(){
  test('responds with OTP sent successfully message', async ()=>{
    const res = await request(app)
      .post('/api/v1/auth/users/register')
      .send({
        name : randomUtils.randomName(),
        phone : randomUtils.randomPhone(),
        email : randomUtils.randomEmail(),
        password: randomUtils.randomPassword(),
        primary_location : randomUtils.randomLocation(),
        is_veg : randomUtils.randomVeg()
      })
      .set('Accept', 'application/json');
    console.log(res.body);

    if(res.statusCode == 400) {
      expect(res.body).toBe( MAIL_ALREADY_EXISTS_ERR );
    
    }
    else if(res.statusCode  == 200) {
      expect(res.body).toBe( "OTP sent successfully to your email address.");

    }
    else{
      //TODO: Handle error
    }
  })
})