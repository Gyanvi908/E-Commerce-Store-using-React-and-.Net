import { PayloadAction, createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { Basket, BasketItem } from "../../app/models/basket"
import agent from "../../app/api/agent";
import { getCookie } from "../../app/util/Util";

interface BasketState{
    basket: Basket | null
    status: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

export const fetchBasketAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketAsync',
    async (_, thunkAPI) => {
        try {
             return await agent.Basket.get();
        }catch (error) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            if(!getCookie('buyerId')) return false;
        }
    }
)

export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>(
    'basket/addBasketItemAsync',
    async({productId, quantity = 1}, thunkAPI) =>{
        try{
            return await agent.Basket.addItem(productId, quantity);
        }catch(error){
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)
export const  removeBasketItemAsync = createAsyncThunk<void,
 {productId: number, quantity: number, name?: string}>(
    'basket/removeBasketItemAsync',
    async({productId, quantity}, thunkAPI) => {
        try{
          await agent.Basket.removeItem(productId, quantity);
        }catch(error){
          return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const basketSlice = createSlice({
 name: 'basket',
 initialState,
 reducers: {
    setBasket: (state, action: PayloadAction<Basket | null>) => {
        state.basket = action.payload
    },
   clearBasket: (state) => {
    state.basket = null;
   }
 },
 extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      state.status = 'pendingAddItem' + action.meta.arg.productId;
    });
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const { productId, quantity } = action.meta.arg;
      if (!state.basket) return;
      const itemIndex = state.basket.items.findIndex((i: BasketItem) => i.productId === productId);
      if (itemIndex === -1) return;
      const item = state.basket.items[itemIndex];
      item.quantity -= quantity;
      if (item.quantity <= 0) {
        state.basket.items.splice(itemIndex, 1);
      }
      state.status = 'idle';
    });
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      state.status = 'idle';
      console.log(action.payload);
    });
    builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled), (state, action) => {
      state.basket = action.payload;
      state.status = 'idle';
    });
    builder.addMatcher(isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected), (state, action) => {
      state.status = 'idle';
      console.log(action.payload);
    });
  }
});

export const { setBasket, clearBasket } = basketSlice.actions;

