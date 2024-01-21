const app = require('../../../index');
const request = require('supertest');
const Admin = require('../../../models/admin.model');


describe('POST /api/v1/auth/admins/login',  ()=>{
  let token;
  let userId;
  let admin;

  test('Login admin', async ()=>{
    const admins = await Admin.find({});
    admin = admins[0];
    // console.log(admin);
    const res = await request(app)
    .post('/api/v1/auth/admins/login')
    .set('Accept', 'application/json')
    .send({
      username : admin.username,
      password : admin.password
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.type).toBeDefined();
    expect(res.body.type).toBe('success');
    expect(res.body.data).not.toBeNull();
    expect(res.body.data).toBeDefined();
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.userId).toBeDefined();
  }, 20000)
})