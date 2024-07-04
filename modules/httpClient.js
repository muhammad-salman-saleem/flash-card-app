import axios from "axios"

// export const SERVICE_URL = "https://flash-cards-app-27923.botics.co"
export const SERVICE_URL = "https://3d4f-72-255-34-130.ngrok-free.app/"
const httpClient = axios.create({
    baseURL: SERVICE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    }
})

export const setAuthToken = (token) => {
    httpClient.defaults.headers.common["Authorization"] = `Token ${token}`;
}

export default httpClient;

