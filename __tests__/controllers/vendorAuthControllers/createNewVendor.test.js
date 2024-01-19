const app = require('../../../index');
const request = require('supertest');
const randomUtils = require('../../../utils/random.util');


describe('POST /api/v1/auth/vendors/register', ()=>{

  const vendorDetails = {
    email: randomUtils.randomEmail(),
    ownerName: randomUtils.randomName(),
    restaurantName: randomUtils.randomName(),
    location : randomUtils.randomLocation(),
    password: randomUtils.randomPassword(),
    phone: randomUtils.randomPhone(),
    supported_location: [randomUtils.randomLocation()]
  };
  
  test('Create a new vendor', async()=>{
    const res = await request(app)
    .post("/api/v1/auth/vendors/register")
    .set('Accept', 'application/json')
    .send(vendorDetails)

    if(res.statusCode == 200){
      expect(res.body).toBe("OTP send successfully");
    }
    else if(res.statusCode == 400){
      expect(res.body).not.toBeNull();
    }
  })
})