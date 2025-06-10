import axios from '../utils/axios';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user?: {
        id: number;
        email: string;
        name: string;
        preferences: string[];
        // Add other user fields as needed
    };
    // Add other response fields as needed
}

export const login = async (
    data: { email: string; password: string }
): Promise<LoginResponse> => {
    try {
        const response = await axios.post('/auth/login', data);
        // Support both { token } and { token, user }
        if (response.data.token && response.data.user) {
            const { token, user } = response.data;
            return {
                token,
                user: {
                    ...user,
                    id: Number(user.id),
                    preferences: user.preferences || [],
                },
            };
        } else if (response.data.token) {
            // Only token returned
            return { token: response.data.token };
        } else {
            throw new Error('Invalid login response');
        }
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    age?: number; // Optional field
    preferences?: string[]; // Optional field for user preferences
    // Add other registration fields as needed
}

export interface RegisterResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        age?: number; // Optional field
        preferences: string[]; // Optional field for user preferences
        // Add other user fields as needed
    };
    // Add other response fields as needed
}

export const register = async (
    userData: {
        name: string;
        email: string;
        password: string;
        preferences: string[];
        age: number;
    }
): Promise<RegisterResponse> => {
    try {
        const response = await axios.post('/auth/register', userData);
        // Assume backend returns { token, user }
        const { token, user } = response.data;
        return {
            token,
            user: {
                ...user,
                id: Number(user.id),
                preferences: user.preferences || [],
            },
        };
    } catch (error: any) {
        throw error.response?.data || error;
    }
};