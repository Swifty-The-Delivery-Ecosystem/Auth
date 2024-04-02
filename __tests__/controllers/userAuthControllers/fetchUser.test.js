const app = require('../../../index');
const request = require('supertest');
const randomUtils = require('../../../utils/random.util');
const { createJwtToken } = require('../../../utils/token.util');

jest.mock('../../../controllers/userAuth.controller');


describe('GET /api/v1/auth/users/:user_id', ()=>{
  let otp;
  const email = randomUtils.randomEmail();
  const password = randomUtils.randomPassword();
  let token;
  let user_id;

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
    expect(res.body.data.token).not.toBeNull();
    expect(res.body.data.userId).not.toBeNull();
    //expect(res.statusCode).toBe(400);
    token = res.body.data.token;
    user_id = res.body.data.userId;
  })

  // test('Fetch User', async()=>{
  //   const res = await request(app)
  //   .get('/api/v1/auth/users/'+user_id)
  //   .set('Accept', 'application/json')
  //   .set('Authorization', 'Bearer '+token);

  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.user).not.toBeNull();

  // })
})