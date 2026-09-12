import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import { ValidationError } from "../errors.service.js";
import auth_validator from "./auth.validator.js";

const validate_order_initiate = async (cart) => {
  const items = [];
  if (cart.items.length == 0) {
    const details = {
      cart: "Cart cannot be empty",
    };
    throw new ValidationError(details);
  } else {
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        const details = {
          products: `Product ${item.product} not found`,
        };
        throw new ValidationError(details);
      } else {
        if (item.quantity > product.stock) {
          const details = {
            products: `Not enough items in stock for ${product.name}`,
          };
          throw new ValidationError(details);
        } else {
          items.push({
            product: product._id,
            quantity: item.quantity,
            name: product.name,
            price: product.price,
            subtotal: product.price * item.quantity,
          });
        }
      }
    }
    return items;
  }
};

const validate_order = async (user, orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const details = {
      order: "Order doesn't exist",
    };
    throw new NotFoundError(details);
  } else {
    auth_validator.owner_or_admin(user, order);
    return order;
  }
};


export default {
  validate_order_initiate,
  validate_order
};
