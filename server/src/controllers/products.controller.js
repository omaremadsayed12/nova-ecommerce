import product_service from '../services/products.service.js';

const get_all_products = async (req, res) => {
  try {
    const products = await product_service.get_all_products();
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const add_product = async (req, res) => {
  try {
    const product_data = req.body;
    const {error, isValid} = await product_service.validate_product_input(product_data);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid product data",
        error: error
      });
    }
    const newProduct = await product_service.add_product(product_data);
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const update_product = async (req, res) => {
  try {
    const product_id = req.params.id;
    const product_exist = await product_service.check_product(product_id)
    if (!product_exist){
      return res.status(404).json(
        {
          success: false,
          message: "Product not found"
        }
      )
    }
    const product_data = req.body;
    const {error, isValid} = await product_service.validate_product_update_input(product_data);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid product data",
        error: error
      });
    }
    const updatedProduct = await product_service.update_product(product_id, product_data);
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not updated"
      });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }}

const delete_product = async (req, res) => {
  try {
    const product_id = req.params.id;
    const deletedProduct = await product_service.delete_product(product_id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default { get_all_products, add_product, update_product, delete_product };