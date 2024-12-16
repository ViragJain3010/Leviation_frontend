import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  Login, 
  LoginData, 
  Signup, 
  SignupData, 
  validateToken, 
} from "@/API/Auth.API";

export const LoginAsync = createAsyncThunk(
  "auth/login",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await Login(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const SignupAsync = createAsyncThunk(
  "auth/signup",
  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response = await Signup(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const ValidateTokenAsync = createAsyncThunk(
  "auth/validateToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await validateToken(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface AuthState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  token: string | null;
  isAuthenticated: boolean;
  isLoggedOut: boolean; 
}

const initialState: AuthState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  token: null,
  isAuthenticated: false,
  isLoggedOut: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    Logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isLoggedOut = true; 
    },
    resetLogoutFlag: (state) => {
      state.isLoggedOut = false; 
    },
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(SignupAsync.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
      })
      .addCase(SignupAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(SignupAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string; 
        state.isAuthenticated = false;
      })
      
      // Login cases
      .addCase(LoginAsync.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
      })
      .addCase(LoginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(LoginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Token Validation cases
      .addCase(ValidateTokenAsync.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
      })
      .addCase(ValidateTokenAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.valid;
        
        if (!action.payload.valid) {
          state.token = null;
        }
      })
      .addCase(ValidateTokenAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.message = action.payload as string;
      });
  },
});

export const { reset, Logout, resetLogoutFlag } = authSlice.actions;
export default authSlice.reducer;
