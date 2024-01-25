const app = require('../../../index');
const request = require('supertest');
const Admin = require('../../../models/admin.model');
const randomUtils = require('../../../utils/random.util');
const { createJwtToken } = require("../../../utils/token.util");


describe('GET /api/v1/auth/admins/users/view' , ()=>{

  test('View users', async()=>{
    const admins = await Admin.find({})
    .limit(1);
    const admin = admins[0];

    const token = createJwtToken({userId: admin._id});

    const res = await request(app)
    .get('/api/v1/auth/admins/users/view')
    .set('Authorization', "Bearer "+token)
    .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.users).toBeDefined();

  })
})