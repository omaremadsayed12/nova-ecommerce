import Review from "../../models/Reviews.js";
import { ValidationError } from "../errors.service.js";

const validate_add_review = async (productId, reviewData, user) => {
  const review = await Review.find({
    product: productId,
    user: user._id,
  });
  if (review) {
    const details = {
      review: "User already added review on this product",
    };
    throw new ValidationError(details);
  } else {
    const { rating, comment } = reviewData;
    if (!rating) {
      const details = {
        rating: "Rating is required",
      };
      throw new ValidationError(details);
    } else {
      if (comment.length > 225) {
        const details = {
          comment: "Comment shouldn't exceed 225 character",
        };
        throw new ValidationError(details);
      }
    }
  }
};

const validate_update_review = async (id, user, reviewData) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    const details = {
      review: `${id} is not a valid product id`,
    };
    throw new ValidationError(details);
  } else {
    const review = await Review.findById(id);
    if (!review) {
      const details = {
        review: "Review not found",
      };
      throw new NotFoundError(details);
    } else {
      const { comment } = reviewData;
      if (comment.length > 225) {
        const details = {
          comment: "Comment shouldn't exceed 225 character",
        };
        throw new ValidationError(details);
      } else {
        await auth_validator.is_owner(user, review);
        return review;
      }
    }
  }
};

export default { validate_add_review, validate_update_review };
