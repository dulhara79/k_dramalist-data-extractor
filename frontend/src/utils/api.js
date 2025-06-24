import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

export const getDramas = async (page = 1, perPage = 20) => {
  const response = await api.get('/dramas', { params: { page, per_page: perPage } })
  return response.data
}

export const getDrama = async (title) => {
  const response = await api.get(`/dramas/${encodeURIComponent(title)}`)
  return response.data
}

export const searchDramas = async (params) => {
  const response = await api.get('/search', { params })
  return response.data
}

export const getGenres = async () => {
  const response = await api.get('/genres')
  return response.data
}

export const getStats = async () => {
  const response = await api.get('/stats')
  return response.data
}