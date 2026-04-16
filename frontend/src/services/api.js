import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "/_/backend/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handler
const handleError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.error || "An error occurred");
  } else if (error.request) {
    throw new Error("No response from server");
  } else {
    throw new Error("Request failed");
  }
};

// Students API
export const studentAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/students");
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  create: async (data) => {
    try {
      const response = await api.post("/students", data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/students/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// Subjects API
export const subjectAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/subjects");
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  create: async (data) => {
    try {
      const response = await api.post("/subjects", data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/subjects/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/subjects/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// Departments API
export const departmentAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/departments");
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// Teachers API
export const teacherAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/teachers");
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// Classes API
export const classAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/classes");
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  create: async (data) => {
    try {
      const response = await api.post("/classes", data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/classes/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/classes/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// Marks API
export const markAPI = {
  getAll: async (filters = {}) => {
    try {
      const response = await api.get("/marks", { params: filters });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  create: async (data) => {
    try {
      const response = await api.post("/marks", data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/marks/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/marks/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// Reports API
export const reportAPI = {
  getReports: async (filters = {}) => {
    try {
      const response = await api.get("/reports", { params: filters });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getStudentReport: async (studentId) => {
    try {
      const response = await api.get(`/reports/${studentId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default api;
