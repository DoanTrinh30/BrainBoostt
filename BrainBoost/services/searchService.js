import serverApi from '../helpers/axios'

export const searchAll = async (query) => {
    try {
        const response = await serverApi.get('/api/search', {
            params: { keyword: query },
        })
        return response.data.data
    } catch (error) {
        console.error('Error searching:', error)
        throw error
    }
}
