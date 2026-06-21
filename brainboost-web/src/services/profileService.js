import api from './api'

export const profileService = {
  // Lấy thông tin profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/profile')
      console.log('✅ Profile fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching profile:', error)
      throw error
    }
  },

  // Cập nhật profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/profile', profileData)
      console.log('✅ Profile updated:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error updating profile:', error)
      throw error
    }
  },

  // Thay đổi mật khẩu
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/api/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      })
      console.log('✅ Password changed:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error changing password:', error)
      throw error
    }
  }
}