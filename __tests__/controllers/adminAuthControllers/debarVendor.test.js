const app = require('../../../index');
const request = require('supertest');
const Admin = require('../../../models/admin.model');
const randomUtils = require('../../../utils/random.util');
const Vendor = require('../../../models/vendor.model');
const VendorCredentials = require('../../../models/vendor.credentials');
const { createJwtToken } = require('../../../utils/token.util');


describe('PUT /api/v1/auth/admins/vendor', ()=>{
  let admin ;
  let vendor ; 
  const vendorDetails = {
    email: randomUtils.randomEmail(),
    ownerName: randomUtils.randomName(),
    restaurantName: randomUtils.randomName(),
    location : randomUtils.randomLocation(),
    password: randomUtils.randomPassword(),
    phone: randomUtils.randomPhone(),
    supported_location: [randomUtils.randomLocation()]
  };

  test('Debarr Vendor', async()=>{
      const admins = await Admin.find({});
      admin = admins[0];
      const createVendor = new Vendor({
        ownerName: vendorDetails.ownerName,
        email: vendorDetails.email,
        restaurantName: vendorDetails.restaurantName,
        location: vendorDetails.location,
        supported_location:vendorDetails.supported_location ,
        phone: vendorDetails.phone
      });
      const vendor = await createVendor.save();
  
      const createVendorCredentials = new VendorCredentials({
        email: vendorDetails.email,
        password: vendorDetails.password,
        vendor_id:vendor._id
      });
      await createVendorCredentials.save();

      const token = createJwtToken({userId: admin._id});

      //TODO: make random status util
      const res = await request(app)
      .put('/api/v1/auth/admins/vendor')
      .set('Authorization','Bearer '+token)
      .set('Accept','application/json')
      .send({
        vendorId : vendor._id
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body).toBe("Vendor debarred successfully");
  })
})


