import axios from "axios";
const apiClient = axios.create({
    baseURL: "http://http://localhost:5000"
})

export default apiClient