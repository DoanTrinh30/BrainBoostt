import React, { useState, useEffect } from 'react'
import { deckService } from '../../services/deckService'
import './DecksPage.css'

function DeckCard({ category, name, cards, retention, students, updated }) {
  return (
    <div className="deck-card">
      <div className="deck-badge">{category}</div>
      <h3 className="deck-name">{name}</h3>
      <div className="deck-stats">
        <span>🎴 {cards} thẻ</span>
        <span>📊 {retention}% giữ lại</span>
        <span>👥 {students} HS</span>
      </div>
      <p className="deck-updated">Cập nhật: {updated}</p>
    </div>
  )
}

export default function DecksPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [decks, setDecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Gọi API khi component mount
  useEffect(() => {
    fetchDecks()
  }, [])

  const fetchDecks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await deckService.getAllDecks()
      console.log('✅ Decks loaded:', data)
      setDecks(data || [])
    } catch (err) {
      console.error('❌ Error loading decks:', err)
      setError('Không thể tải bộ thẻ. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="decks-page"><p>⏳ Đang tải...</p></div>
  }

  if (error) {
    return <div className="decks-page"><p style={{color: 'red'}}>❌ {error}</p></div>
  }

  return (
    <div className="decks-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Bộ Thẻ</h1>
          <p className="page-subtitle">Quản lý các bộ thẻ học tập</p>
        </div>
        <button className="btn-primary">+ Tạo Bộ Thẻ Mới</button>
      </div>

      {/* Categories */}
      <div className="categories">
        <button 
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          Tất cả
        </button>
        {['Ngôn Ngữ', 'Toán Học', 'Khoa Học', 'Y Tế'].map(cat => (
          <button 
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Decks Grid */}
      <div className="decks-grid">
        {decks.length > 0 ? (
          decks.map((deck) => (
            <DeckCard key={deck.id} {...deck} />
          ))
        ) : (
          <p>📭 Không có bộ thẻ nào</p>
        )}
      </div>
    </div>
  )
}