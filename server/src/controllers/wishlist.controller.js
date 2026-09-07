import wishlist_service from "../services/wishlist.service.js";

const get_wishlist = (req, res) => {
  try {
    const user = req.user;
    const wishlist = wishlist_service.get_wishlist(user);
    res.status(200).json({
        success:true,
        message: "Wishlist fetched successfully",
        data: wishlist,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const add_to_wishlist = async (req, res) => {
  try {
    const user = req.user;
    const product_id = req.params.id;
    const wishlist = await wishlist_service.add_to_wishlist(user, product_id);
    res.status(200).json({
        success:true,
        message: "Product added to wishlist successfully",
        data: wishlist,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const remove_from_wishlist = async (req, res) => {
  try {
    const user = req.user;
    const product_id = req.params.id;
    const wishlist = await wishlist_service.remove_from_wishlist(user, product_id);
    res.status(200).json({
        success:true,
        message: "Product removed from wishlist successfully",
        data: wishlist,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default {get_wishlist, add_to_wishlist, remove_from_wishlist};