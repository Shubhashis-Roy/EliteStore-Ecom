import { axiosInstance } from "@/services/axios";
import { dispatch } from "../store";
import { OrderResponse } from "@/types/ordersTypes";
import { createSlice } from "@reduxjs/toolkit";
import { AxiosErrorResponse } from "@/types/errroHandleTypes";
import errorHandle from "@/services/errorHandle";

interface stateProps {
  isLoading: boolean;
  error: null | string;
  orders: OrderResponse[];
}

const initialState: stateProps = {
  isLoading: false,
  error: null,
  orders: [],
};

const slice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getOrdersSuccess(state, action) {
      state.isLoading = false;
      state.orders = action.payload.data;
    },
  },
});

// Reducer
export default slice.reducer;

// Get all orders
export const getAllOrders = () => async () => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axiosInstance().get("/orders");
    // console.log(response?.data?.orders, "getAllOrders res hlo ===========");

    dispatch(
      slice.actions.getOrdersSuccess({
        data: response?.data?.orders,
      })
    );
    return response?.data?.orders;
  } catch (error) {
    const axiosError = error as AxiosErrorResponse;
    errorHandle({ error: axiosError, label: "getAllOrders API Error:" });
    dispatch(
      slice.actions.hasError(axiosError.message || "Something went wrong")
    );
  }
};
