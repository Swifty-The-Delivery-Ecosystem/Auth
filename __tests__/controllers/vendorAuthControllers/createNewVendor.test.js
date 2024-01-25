const app = require('../../../index');
const request = require('supertest');
const randomUtils = require('../../../utils/random.util');
const Vendor = require('../../../models/vendor.model');
const VendorCredentials = require('../../../models/vendor.credentials');

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
      const vendor = await Vendor.findOne({email : vendorDetails.email});
      expect(vendor).not.toBeNull();
      expect(vendor).toBeDefined();

      expect(vendor.ownerName).toBeDefined();
      expect(vendor.ownerName).toBe(vendorDetails.ownerName);

      expect(vendor.email).toBeDefined();
      expect(vendor.email).toBe(vendorDetails.email);

      expect(vendor.restaurantName).toBe(vendorDetails.restaurantName);
      expect(vendor.location).toBe(vendorDetails.location);
      //expect(vendor.supported_location).toBe(vendorDetails.supported_location);
      //expect(vendor.phone).toBe(vendorDetails.phone);

      const vendorCreds = await VendorCredentials.findOne({email : vendorDetails.email})
      expect(vendorCreds).not.toBeNull();
      expect(vendorCreds).toBeDefined();
      
      expect(vendorCreds.password).toBe(vendorDetails.password);
      //expect(vendorCreds.vendor_id).toBe(vendor._id);
    }
    else if(res.statusCode == 400){
      expect(res.body).not.toBeNull();
    }
    else{
      expect(res.statusCode).toBe(200);
    }
  }, 20000)
})