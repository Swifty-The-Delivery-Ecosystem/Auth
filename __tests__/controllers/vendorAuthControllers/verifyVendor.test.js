const app = require('../../../index');
const request = require('supertest');
const randomUtils = require('../../../utils/random.util');
const Vendor = require('../../../models/vendor.model');
const VendorCredentials = require('../../../models/vendor.credentials');

jest.mock('../../../controllers/vendorAuth.controller');

describe('POST /api/v1/auth/vendors/verify', ()=>{

  const vendorDetails = {
    email: randomUtils.randomEmail(),
    ownerName: randomUtils.randomName(),
    restaurantName: randomUtils.randomName(),
    location : randomUtils.randomLocation(),
    password: randomUtils.randomPassword(),
    phone: randomUtils.randomPhone(),
    supported_location: [randomUtils.randomLocation()]
  };
  let otp;

  test('Create a test vendor', async()=>{
    const res = await request(app)
    .post('/api/v1/auth/vendors/register')
    .set('Accept', 'application/json')
    .send(vendorDetails);

    expect(res.statusCode).toBe(200);
    expect(res.body.otp).not.toBeNull();
    expect(res.body.otp).toBeDefined();
    otp = res.body.otp;
  },20000)

  test('Verify OTP', async()=>{
    const res = await request(app)
    .post('/api/v1/auth/vendors/verify')
    .set('Accept', 'application/json')
    .send({
      email : vendorDetails.email,
      in_otp: otp
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body).not.toBeNull();
    expect(res.body.type).toBeDefined();
    expect(res.body.type).toBe('success');
    expect(res.body.message).toBe('OTP verified successfully.');
  }, 20000)
})