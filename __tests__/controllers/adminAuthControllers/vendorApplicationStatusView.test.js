const app = require('../../../index');
const request = require('supertest');
const randomUtils = require('../../../utils/random.util');
const Admin = require('../../../models/admin.model');
const tokenUtils = require('../../../utils/token.util');

describe('/api/v1/auth/admins/new_vendors', ()=>{
  let admin;
  let token;
  test('Vendor application status view', async() => {
    const admins = await Admin.find({});
    admin = admins[0];
    token = tokenUtils.createJwtToken({ userId: admin._id });
    
    const res = await request(app)
    .get('/api/v1/auth/admins/new_vendors')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer '+token);

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.type).toBe('success');
    expect(res.body.data).toBeDefined();
  })
})