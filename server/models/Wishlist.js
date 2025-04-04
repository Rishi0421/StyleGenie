const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StyleGenie-User", // Reference to the User model
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StyleGenie-Product", // Reference to your Product model
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model("StyleGenie-Wishlist", wishlistSchema);
module.exports = Wishlist;