export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  data: any;
}

interface TokenValidationResponse {
  valid: boolean;
}

export function Login(loginData: LoginData): Promise<AuthResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        resolve({ data });
      } else {
        reject({ message: data.message || "Failed to authenticate" });
      }
    } catch (err) {
      reject({ err: err, message: "Network error" });
    }
  });
}

export function Signup(signupData: SignupData): Promise<AuthResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/signup`,
        {
          method: "POST",
          body: JSON.stringify(signupData),
          headers: { "content-type": "application/json" },
        }
      );
      const data = await response.json();
      if (response.ok) {
        resolve({ data });
      } else {
        reject({ message: data.message || "Failed to authenticate" });
      }
    } catch (err) {
      reject({ err: err, message: "Network error" });
    }
  });
}

export function validateToken(token: string): Promise<TokenValidationResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/validate-token`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        resolve({
          valid: true,
        });
      } else {
        resolve({
          valid: false,
        });
      }
    } catch (err) {
      reject({ err: err, message: "Network error during token validation" });
    }
  });
}
