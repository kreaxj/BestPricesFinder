import axios from 'axios'

const BASE_URL = 'https://www.cheapshark.com/api/1.0'

const api = axios.create({
    baseURL: BASE_URL,
})

/**
 * Поиск скидок
 * @param {Object} params
 * @param {string} [params.title]
 * @param {string} [params.storeID]
 * @param {'Price'|'DealRating'|'Release'|'Metacritic'} [params.sortBy]
 * @param {boolean} [params.desc]
 * @param {number} [params.lowerPrice]
 * @param {number} [params.upperPrice]
 * @param {number} [params.pageNumber]
 * @param {number} [params.pageSize]
 * @param {boolean} [params.onSale]
 * @param {boolean} [params.AAA]
 */
export async function fetchDeals(params = {}) {
    const { data } = await api.get('/deals', { params })
    return data
}

export async function fetchGames(title, limit = 20, exact = false) {
  const { data } = await api.get('/games', {
    params: { title, limit, exact: exact ? 1 : 0 },
  })
  return data
}

export async function fetchStores() {
  const { data } = await api.get('/stores')
  return data
}

export async function fetchGameDetails(gameID) {
  const { data } = await api.get('/games', { params: { id: gameID } })
  return data
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 5
      console.warn(`Rate limit: повтор через ${retryAfter} сек.`)
    }
    return Promise.reject(error)
  },
)