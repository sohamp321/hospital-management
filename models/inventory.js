const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  ItemID: {
    type: Number,
    required: true,
    unique: true
  },
  Name: {
    type: String,
    required: true
  },
  Type: {
    type: String,
    required: true
  },
  Quantity: {
    type: Number,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  ExpireDate: {
    type: Date,
    required: true
  },
  Manufacturer: {
    type: String,
    required: true
  }
  // ,
  // slug: {
  //   type: String,
  //   lowercase: true,
  //   required: true,
  //   unique: true
  // }
});

// inventorySchema.pre('save', function (next) {
//   const inventory = this;

//   if (!inventory.slug) {
//     const slugifiedName = inventory.Name.toLowerCase().replace(/[^a-z0-9]/g, '-');
//     const slugifiedType = inventory.Type.toLowerCase().replace(/[^a-z0-9]/g, '-');
//     const slugifiedManufacturer = inventory.Manufacturer.toLowerCase().replace(/[^a-z0-9]/g, '-');

//     inventory.slug = slugifiedName + '-' + slugifiedType + '-' + slugifiedManufacturer;
//   }

//   next();
// });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
