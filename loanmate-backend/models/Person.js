const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
  type: require("mongoose").Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

    address: {
      type: String,
      default: ""
    }
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Person", personSchema);
