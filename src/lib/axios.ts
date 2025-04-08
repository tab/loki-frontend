import axios from "axios"
import { v4 as uuid } from "uuid"

import { API_URL, BACKOFFICE_API_URL } from "@/config/env"

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers["X-Trace-ID"]) {
      config.headers["X-Trace-ID"] = uuid()
    }

    if (!config.headers["X-Request-ID"]) {
      config.headers["X-Request-ID"] = uuid()
    }

    const token = localStorage.getItem("access_token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export const axiosBackofficeInstance = axios.create({
  baseURL: BACKOFFICE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

axiosBackofficeInstance.interceptors.request.use(
  (config) => {
    if (!config.headers["X-Trace-ID"]) {
      config.headers["X-Trace-ID"] = uuid()
    }

    if (!config.headers["X-Request-ID"]) {
      config.headers["X-Request-ID"] = uuid()
    }

    const token = localStorage.getItem("access_token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosBackofficeInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)
