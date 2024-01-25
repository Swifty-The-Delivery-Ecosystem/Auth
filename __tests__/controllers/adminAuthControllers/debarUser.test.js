const app = require('../../../index');
const request = require('supertest');
const Admin = require('../../../models/admin.model');
const User = require('../../../models/user.model');
const UserCredentials = require('../../../models/user.credentials');
const randomUtils = require('../../../utils/random.util');
const { createJwtToken } = require("../../../utils/token.util");


describe('PUT /api/v1/auth/admins/user' , ()=>{

  let userDetails = {
    name : randomUtils.randomName(),
    phone : randomUtils.randomPhone(),
    email : randomUtils.randomEmail(),
    primary_location : randomUtils.randomLocation(),
    is_veg: randomUtils.randomVeg(),
    password: randomUtils.randomPassword(),
  }

  test('Debar user', async()=>{
    const admins = await Admin.find({});
    const admin = admins[0];

    const createUser = new User({
      name: userDetails.name,
      phone: userDetails.phone,
      email:userDetails.email,
      primary_location: userDetails.primary_location,
      is_veg: userDetails.is_veg,
    });
    
    const user = await createUser.save();

    const createUserCredentials = new UserCredentials({
      user_id:user._id,
      email: userDetails.email,
      password: userDetails.password
    });

    await createUserCredentials.save();

    const token = createJwtToken({userId: admin._id});

    const res = await request(app)
    .put('/api/v1/auth/admins/user')
    .set('Authorization', "Bearer "+token)
    .set('Accept', 'application/json')
    .send({
      userId : user._id
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toBe("users debarred successfully");

  })
})