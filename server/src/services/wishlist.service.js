const get_wishlist = (user)=>{
    return user.wishlist;
}

const add_to_wishlist = async(user,product_id)=>{
    if (user.wishlist.includes(product_id)){
        throw new Error("Product already exists in wishlist");
    }
    user.wishlist.push(product_id);
    user.updatedBy = user._id;
    return await user.save();
}

const remove_from_wishlist = async(user, product_id)=>{
    if (!user.wishlist.includes(product_id)){
        throw new Error("Product is not in wishlist");
    }
    user.wishlist.pop(product_id);
    user.updatedBy = user._id;
    return await user.save();
}

export default {get_wishlist, add_to_wishlist, remove_from_wishlist};