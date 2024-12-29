import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log('API Configuration:', {
  baseURL: API_BASE_URL,
  envVars: {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    mode: import.meta.env.MODE
  }
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Remove the CORS headers from frontend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add request interceptor to log all API calls
api.interceptors.request.use(config => {
  console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
  return config;
});

// Auth services
export const authService = {
  register: async (userData) => {
    try {
      console.log('Registration endpoint:', `${API_BASE_URL}/api/auth/register`);
      const response = await api.post('/api/auth/register', {
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName
      });
      return response.data;
    } catch (error) {
      console.error('Registration error details:', {
        endpoint: `${API_BASE_URL}/api/auth/register`,
        message: error.message,
        response: {
          data: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        }
      });
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  login: async (credentials) => {
    console.log('Login endpoint:', `${API_BASE_URL}/api/auth/login`);
    const response = await api.post('/api/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  logout: () => {
    console.log('Logging out - clearing token');
    localStorage.removeItem('token');
  }
};

// Board services
export const boardService = {
  getAllBoards: async () => {
    console.log('Get all boards endpoint:', `${API_BASE_URL}/boards`);
    const response = await api.get('/boards');
    return response.data;
  },

  createBoard: async (boardData) => {
    console.log('Create board endpoint:', `${API_BASE_URL}/boards`);
    const response = await api.post('/boards', boardData);
    return response.data;
  },

  updateBoard: async (boardId, boardData) => {
    const response = await api.put(`/boards/${boardId}`, boardData);
    return response.data;
  },

  deleteBoard: async (boardId) => {
    await api.delete(`/boards/${boardId}`);
  },

  getBoardNotes: async (boardId) => {
    const response = await api.get(`/boards/${boardId}/notes`);
    return response.data;
  },

  createNote: async (boardId, noteData) => {
    try {
      const response = await api.post(`/boards/${boardId}/notes`, {
        content: noteData.content,
        color: noteData.color || '#ffd700', // Default yellow color
        positionX: noteData.positionX,
        positionY: noteData.positionY
      });
      return response.data;
    } catch (error) {
      console.error('Note creation error:', error);
      throw error;
    }
  },

  updateNote: async (boardId, noteId, noteData) => {
    try {
      const response = await api.put(`/boards/${boardId}/notes/${noteId}`, {
        content: noteData.content,
        color: noteData.color,
        positionX: noteData.positionX,
        positionY: noteData.positionY
      });
      return response.data;
    } catch (error) {
      console.error('Note update error:', error);
      throw error;
    }
  },

  deleteNote: async (boardId, noteId) => {
    await api.delete(`/boards/${boardId}/notes/${noteId}`);
  },

  getBoardEdges: async (boardId) => {
    try {
      const response = await api.get(`/boards/${boardId}/edges`);
      return response.data.map(edge => ({
        id: edge.id,
        sourceNoteId: edge.sourceNote?.id || edge.sourceNoteId,
        targetNoteId: edge.targetNote?.id || edge.targetNoteId,
        type: edge.type || 'default',
        style: edge.style || JSON.stringify({
          stroke: '#333333',
          strokeWidth: 2
        })
      }));
    } catch (error) {
      console.error('Error loading edges:', error);
      throw error;
    }
  },

  createEdge: async (boardId, edgeData) => {
    try {
      // Create a simpler style object
      const styleString = JSON.stringify({
        stroke: '#333333',
        strokeWidth: 2
      });

      const response = await api.post(`/boards/${boardId}/edges`, {
        sourceNoteId: Number(edgeData.sourceNoteId),
        targetNoteId: Number(edgeData.targetNoteId),
        type: 'default',
        style: styleString
      });
      
      console.log('Edge creation payload:', {
        sourceNoteId: Number(edgeData.sourceNoteId),
        targetNoteId: Number(edgeData.targetNoteId),
        type: 'default',
        style: styleString
      });

      return response.data;
    } catch (error) {
      console.error('Full error details:', {
        data: error.response?.data,
        status: error.response?.status,
        payload: error.config?.data
      });
      throw error;
    }
  },

  deleteEdge: async (boardId, edgeId) => {
    await api.delete(`/boards/${boardId}/edges/${edgeId}`);
  },

  async getAIResponse(messages) {
    try {
      const response = await api.post('/ai/chat', { messages });
      return response.data;
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  }
}; 