
import axios from "axios";

const BASE_URL = "https://ethica-backend.onrender.com";

// =======================
// SIGNUP
// =======================
export async function signup(payload: {
  name: string;
  email: string;
  password: string;
}) {
  console.debug('Signup request payload:', payload);
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  console.debug('Signup response status:', res.status, 'body:', data);

  if (!res.ok) {
    const errorMessage = data?.message || data?.error || data?.raw || `Signup failed (${res.status})`;
    throw new Error(errorMessage);
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

  return data;
}

// =======================
// GET USER PROFILE
// =======================
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("Not authenticated");

  try {
    const response = await axios.get(
      `${BASE_URL}/api/user/getUserProfile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    // If profile not found, attempt to auto-create
    if (error?.response?.status === 404 || error?.response?.data?.message === "Profile not found") {
      try {
        const createResponse = await axios.post(
          `${BASE_URL}/api/user/createUserProfile`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return createResponse.data;
      } catch (createError) {
        // Return empty profile structure if creation fails
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return {
          _id: "",
          fullName: user.name || "User",
          profileImage: null,
          post: "",
          location: "",
          websiteUrl: "",
          aboutMe: "",
          dateOfBirth: "",
          university: "",
          degree: "",
          educationYear: new Date().getFullYear(),
          company: "",
          position: "",
          email: user.email || "",
          skills: [],
        };
      }
    }
    throw error;
  }
};

// =======================
// UPDATE USER PROFILE
// =======================
export const updateUserProfile = async (profileData: any) => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No authentication token found");

  const response = await axios.put(
    `${BASE_URL}/api/user/updateUserProfile`,
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


// ====================== Community APIs ======================

export const createCommunity = async (communityData: any) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");
  const response = await axios.post(
    `${BASE_URL}/api/user/createCommunity`,
    communityData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
  };



  // ======================join community ======================

  export const joinCommunity = async (communityId: string) => {   
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
    const response = await axios.post(
      `${BASE_URL}/api/user/joinCommunity/${communityId}`,
      { communityId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
