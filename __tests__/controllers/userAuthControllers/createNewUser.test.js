const {createNewUser} = require('../../../controllers/userAuth.controller')
const app = require('../../../index');
const mongoose = require('mongoose');
require("dotenv").config();
const request = require('supertest');
const randomUtils = require('../../../utils/random.util');

describe('POST /register', function(){
  it('responds with OTP sent successfully message', function(done){
    request(app)
      .post('/api/v1/auth/users/register')
      .send({
        name : randomUtils.randomEmail(),
        phone : randomUtils.randomPhone(),
        email : randomUtils.randomEmail(),
        primary_location : randomUtils.randomLocation(),
        is_veg : randomUtils.randomVeg()
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
  })
})