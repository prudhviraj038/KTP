const types = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  EMPTY_CART: "EMPTY_CART",
};

export const actions = {
  addToCart: (dispatch, product) => {
    dispatch({
      type: types.ADD_TO_CART,
      product,
    });
  },
  removeFromCart: (dispatch, product) => {
    dispatch({
      type: types.REMOVE_FROM_CART,
      product,
    });
  },
  emptyCart: (dispatch, product) => {
    dispatch({
      type: types.EMPTY_CART,
      product,
    });
  },
};

const initialState = {
  cartItems: [],
  totalPrice: 0,
  weight: 0
};
export const reducer = (state = initialState, action) => {
  const compareCartItem = (cartItem, action) => {
    return cartItem.id === action.product.id;
  };
  const compareCartItemWithUnique = (cartItem, action) => {
    // console.log("cartItem", cartItem.id, action.product.id)
    return (
      cartItem.id === action.product.id &&
      cartItem.uniqueId === action.product.uniqueId
    );
  };
  const { type } = action;
  switch (type) {
    case types.ADD_TO_CART: {
      const isExisted = state.cartItems.some((cartItem) =>
        compareCartItem(cartItem, action)
      );
      const isExistedUnique = state.cartItems.some((cartItem) =>
        compareCartItemWithUnique(cartItem, action)
      );
      var newCartItems = state.cartItems;
      var subTotal = 0;
      var wgt = 0;
      if (isExisted && action.product.color) {
        state.cartItems.map((item, key) => {
          if (
            item.id === action.product.id &&
            item.size_value === action.product.size_value
          ) {
            if (item.uniqueId === action.product.uniqueId) {
              item.quantity = action.product.quantity;
            } else {
              item.quantity =
                parseInt(item.quantity) + parseInt(action.product.quantity);
            }

            // item.color = action.product.color;
            // item.size = action.product.size;
          }
          subTotal += parseFloat(item.totalCost) * parseInt(item.quantity);
          wgt += parseFloat(item.weight) * parseInt(item.quantity)
        });
        newCartItems = state.cartItems;
      } else if (
        isExistedUnique &&
        action.product.all_sizes &&
        action.product.all_sizes.length > 0
      ) {
        state.cartItems.map((item, key) => {
          if (item.id === action.product.id) {
            if (item.uniqueId === action.product.uniqueId) {
              item.quantity = action.product.quantity;
            } else {
              item.quantity =
                parseInt(item.quantity) + parseInt(action.product.quantity);
            }
          }
          subTotal += parseFloat(item.totalCost) * parseInt(item.quantity);
          wgt += parseFloat(item.weight) * parseInt(item.quantity)
        });
        newCartItems = state.cartItems;
      } else {
        newCartItems = [...state.cartItems, action.product];
        newCartItems.map((item, key) => {
          subTotal += parseFloat(item.totalCost) * parseInt(item.quantity);
          wgt += parseFloat(item.weight) * parseInt(item.quantity)
        });
      }

      return {
        cartItems: newCartItems,
        totalPrice: subTotal,
        weight: wgt
      };
    }
    case types.REMOVE_FROM_CART: {
      let newCart = state.cartItems.filter(
        (item) => item.uniqueId !== action.product.uniqueId
      );
      let total = 0;
      let wght = 0
      newCart.map((res, key) => {
        total += parseFloat(res.totalCost);
        wght += parseFloat(res.weight) * parseInt(res.quantity)
      });

      return {
        cartItems: newCart,
        totalPrice: total,
        weight: wght
      };
    }
    case types.EMPTY_CART: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
