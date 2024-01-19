const app = require('../../../index');
const request = require('supertest');
const randomUtils = require('../../../utils/random.util');
const { createJwtToken } = require('../../../utils/token.util');

jest.mock('../../../controllers/userAuth.controller');

describe('POST /api/v1/auth/users/login', ()=>{

  let otp;
  const email = randomUtils.randomEmail();
  const password = randomUtils.randomPassword();

  test('Create a new customer', async()=>{
    const res = await request(app)
    .post('/api/v1/auth/users/register')
    .send({
      name : randomUtils.randomName(),
      phone : randomUtils.randomPhone(),
      email : email,
      password: password,
      primary_location : randomUtils.randomLocation(),
      is_veg : randomUtils.randomVeg()
    })
    .set('Accept', 'application/json');

      expect(res.statusCode).toBe(200);
      otp = res.body.otp;
  })

  test('Verify the customer', async()=>{
    const res = await request(app).post('/api/v1/auth/users/verify')
    .send({
      in_otp : otp,
      email : email
    })
    .set('Accept', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body.type).toBe('success');
  })

  test('Login User', async()=> {
    
    const res = await request(app).post('/api/v1/auth/users/login')
    .send({
      email : email,
      password : password
    })
    .set('Accept', 'application/json')
    
    expect(res.statusCode).toBe(201);
    expect(res.body.type).toBe('success');
  })


})