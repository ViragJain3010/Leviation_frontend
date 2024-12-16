import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addProduct,
  getUserProducts,
  generateInvoice,
  Product,
} from "@/API/Product.API";
import { RootState } from "@/store/store";

export const AddProductAsync = createAsyncThunk<
  Product[],
  Product,
  { state: RootState }
>("products/add", async (data: Product, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found");
    }
    const response = await addProduct(data, token);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const GetUserProductsAsync = createAsyncThunk<
  { data: Product[]; showToast: boolean },
  { showToast?: boolean },
  { state: RootState }
>(
  "products/get",
  async ({ showToast = false }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const response = await getUserProducts(token);
      return {
        data: response.data,
        showToast,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GenerateInvoiceAsync = createAsyncThunk<
  boolean,
  void,
  { state: RootState }
>("products/generate-invoice", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found");
    }
    const blob = await generateInvoice(token);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

interface ProductState {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  operationType?: "add" | "fetch" | "invoice";
}

const initialState: ProductState = {
  products: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  operationType: undefined,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.operationType = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Product Cases
      .addCase(AddProductAsync.pending, (state) => {
        state.isLoading = true;
        state.operationType = "add";
      })
      .addCase(AddProductAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products.push(action.payload);
        state.operationType = "add";
      })
      .addCase(AddProductAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.operationType = "add";
      })

      // Get User Products Cases
      .addCase(GetUserProductsAsync.pending, (state) => {
        state.isLoading = true;
        state.operationType = "fetch";
      })
      .addCase(GetUserProductsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;

        // Only set success and show toast if explicitly requested
        if (action.payload.showToast) {
          state.isSuccess = true;
          state.operationType = "add";
        }
      })
      .addCase(GetUserProductsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.operationType = "fetch";
      })

      // Generate Invoice Cases
      .addCase(GenerateInvoiceAsync.pending, (state) => {
        state.isLoading = true;
        state.operationType = "invoice";
      })
      .addCase(GenerateInvoiceAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.operationType = "invoice";
      })
      .addCase(GenerateInvoiceAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.operationType = "invoice";
      });
  },
});

export const { reset } = productsSlice.actions;
export default productsSlice.reducer;
