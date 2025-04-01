import axios from 'axios';

const API_URL = 'http://localhost:3000/auth/';

const authService = {
    async login(username: string, password: string) {
        const response = await axios.post(API_URL + 'login', {
            username,
            password
        });

        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('username', username);
        }

        return response.data;
    },

    async register(username: string, password: string) {
        const response = await axios.post(API_URL + 'register', {
            username,
            password
        });

        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('username', username);
        }

        return response.data;
    },

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
    },

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post(
                API_URL + 'refresh-token',
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`
                    }
                }
            );

            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
            }

            return response.data;
        } catch (error) {
            this.logout();
            throw error;
        }
    },

    setupAxiosInterceptors() {
        axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const data = await this.refreshToken();
                        axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                        return axios(originalRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }
};

export default authService;
