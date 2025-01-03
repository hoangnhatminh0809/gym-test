import axios from "axios";

interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
}

interface TokenResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

// Axios instance
const api = axios.create({
    baseURL: "https://gym-system-taupe.vercel.app",
    headers: {
        "Content-Type": "application/json",
    },
});

const getAccessToken = (): string | null => localStorage.getItem("access_token");
const getRefreshToken = (): string | null => localStorage.getItem("refresh_token");

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = getRefreshToken();
                if (refreshToken) {
                    const response = await api.post("/user/api/refresh-token/", {
                        refresh_token: refreshToken
                    });
                    const { access_token } = response.data;
                    localStorage.setItem("access_token", access_token);
                    originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
                    return api(originalRequest);
                }
            } catch (error) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("token_expiry");
                window.location.href = "/login";
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export const register = (data: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}) => api.post("/user/api/register/", data);

// export const login = (data: { username: string; password: string }) =>
//     api.post("/user/api/login/", data);

export const login = (data: { username: string; password: string }) => {
    return api.post("/user/api/login/", data).then((response) => {
        const { access_token, refresh_token, user }: TokenResponse = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("user", JSON.stringify(user));
        return response;
    });
}

export const refreshToken = (refreshToken: string) => {
    return api.post("/user/api/refresh-token/", { refresh_token: refreshToken }).then((response) => {
        const { access_token, refresh_token }: TokenResponse = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        return response;
    });
}

export const logout = () => {
    return api.get("/user/api/logout/", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
    });
};


export const createCheckoutSession = (amount: number) =>
    api.post("/user/api/create-checkout-session/", { amount });

export default api;
