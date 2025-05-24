import axios, { AxiosInstance } from "axios";

/* -------------------------------------------------------------------------- */
/* Axios instance                                                             */
/* -------------------------------------------------------------------------- */
export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

/* -------------------------------------------------------------------------- */
/* Type definitions                                                           */
/* -------------------------------------------------------------------------- */

export interface User {
  id: string;
  email: string;
  name?: string;
  dob?: string;
  bio?: string;
  medicalHistory?: string;
  background?: string;
  demographics?: Record<string, any>;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  id: string;
  name: string;
  age: number;
  sex: string;
  occupation: string;
  immunizations: string[];
  chronicIllnesses: string[];
  minorIllnesses: string[];
  familySocialHistory: string;
  chiefComplaint: string;
  currentSymptoms: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  user: User;
  case: Case;
  assignedAt: string;
}

export interface UserResponse {
  id: string;
  user: User;
  case: Case;
  isReal: boolean;
  respondedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Auth API                                                                   */
/* -------------------------------------------------------------------------- */
export const authApi = {
  signup: async (data: {
    email: string;
    password: string;
    name?: string;
    dob?: string;
    bio?: string;
    medicalHistory?: string;
    background?: string;
    demographics?: Record<string, any>;
  }): Promise<{ user: User }> => {
    const res = await api.post("/auth/signup", data);
    return res.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<{ user: User }> => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  verifyEmail: async (email: string): Promise<{ message: string }> => {
    const res = await api.post("/auth/verify-email", { email });
    return res.data;
  },

  resetPassword: async (
    email: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    const res = await api.post("/auth/reset-password", { email, newPassword });
    return res.data;
  },
};

/* -------------------------------------------------------------------------- */
/* User API                                                                   */
/* -------------------------------------------------------------------------- */
export const userApi = {
  getProfile: async (): Promise<{ user: User }> => {
    const res = await api.get("/users/me");
    return res.data;
  },

  updateProfile: async (data: {
    name?: string;
    dob?: string;
    bio?: string;
    medicalHistory?: string;
    background?: string;
    demographics?: Record<string, any>;
  }): Promise<{ user: User }> => {
    const res = await api.put("/users/me", data);
    return res.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const fd = new FormData();
    fd.append("avatar", file);
    const res = await api.post("/users/me/avatar", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteAvatar: async (): Promise<{ avatarUrl: null }> => {
    const res = await api.delete("/users/me/avatar");
    return res.data;
  },
};

/* -------------------------------------------------------------------------- */
/* Case API                                                                   */
/* -------------------------------------------------------------------------- */
export const casesApi = {
  uploadCases: async (file: File): Promise<{ imported: number }> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post("/cases/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  listCases: async (): Promise<Case[]> => {
    const res = await api.get<Case[]>("/cases");
    return res.data;
  },

  exportCases: async (): Promise<Blob> => {
    const res = await api.get("/cases/export", { responseType: "blob" });
    return res.data;
  },
};

/* -------------------------------------------------------------------------- */
/* Assignment API                                                             */
/* -------------------------------------------------------------------------- */
export const assignmentApi = {
  assignCases: async (
    userId: string,
    caseIds: string[],
  ): Promise<{ assigned: number }> => {
    const res = await api.post("/assignments", { userId, caseIds });
    return res.data;
  },

  listAssignments: async (): Promise<Assignment[]> => {
    const res = await api.get<Assignment[]>("/assignments");
    return res.data;
  },
};

/* -------------------------------------------------------------------------- */
/* Response API                                                               */
/* -------------------------------------------------------------------------- */
export const responseApi = {
  recordResponse: async (
    caseId: string,
    isReal: boolean,
  ): Promise<UserResponse> => {
    const res = await api.post<UserResponse>("/responses", { caseId, isReal });
    return res.data;
  },

  listMyResponses: async (): Promise<UserResponse[]> => {
    const res = await api.get<UserResponse[]>("/responses/me");
    return res.data;
  },
};

export default api;
