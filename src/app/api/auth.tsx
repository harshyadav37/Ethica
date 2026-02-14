import axios from "axios";

const BASE_URL = "http://localhost:3000";

// =======================
// SIGNUP
// =======================
export async function signup(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Signup failed");
  }

  return data;
}

// =======================
// LOGIN
// =======================
export async function login(payload: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Login failed");
  }

  // ✅ Store token + user automatically
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

// =======================
// GET USER PROFILE
// =======================
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("Not authenticated");

  const response = await axios.get(
    `${BASE_URL}/user/getUserProfile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =======================
// UPDATE USER PROFILE
// =======================
// If backend uses JWT (recommended), no need to pass userId
export const updateUserProfile = async (
  userId: string,
  profileData: any
) => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No authentication token found");

  const response = await axios.put(
    `${BASE_URL}/user/updateUserProfile/${userId}`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

