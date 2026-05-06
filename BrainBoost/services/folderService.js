import serverApi from '../helpers/axios';

export const getTotalFolders = async () => {
    try {
        const response = await serverApi.get('/api/total_folders');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all decks:', error);
        throw error;
    }
};