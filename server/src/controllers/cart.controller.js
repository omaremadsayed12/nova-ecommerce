import cart_service from "../services/cart.service.js";

const get_all_items = async (req, res) => {
  try {
    const user = req.user;
    const items = await cart_service.get_all_items(user);
    res.status(200).json({
        items
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const add_items = async (req,res)=> {
  try {
    const user = req.user;
    const items = req.body.items;
    const addedItems = await cart_service.add_items(user, items)
    if (!addedItems){
      res.status(404).json({
      success: false,
      message: "User or Products not found",
    });}
    else{
      res.status(200).json({
        success: true,
        message: "Items added to cart",
        data: addedItems
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

const update_item = async (req,res)=> {
  try {
    const user = req.user;
    const product_id = req.params.id;
    const quantity = req.body.quantity;
    const updatedProduct = await cart_service.update_item(user, product_id, quantity)
    if (!updatedProduct){
      res.status(404).json({
      success: false,
      message: "User or Product not found",
    });}
    else{
      res.status(200).json({
        success: true,
        message: "Items added to cart",
        data: updatedProduct
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

const remove_item = async (req,res)=> {
  try {
    const user = req.user;
    const product_id = req.params.id;
    const quantity = req.body.quantity;
    const deletedProduct = await cart_service.remove_item(user, product_id, quantity)
    if (!deletedProduct){
      res.status(404).json({
      success: false,
      message: "User or Product not found",
    });}
    else{
      res.status(200).json({
        success: true,
        message: "Items removed from cart",
        data: deletedProduct
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

export default {get_all_items, add_items, update_item, remove_item};
