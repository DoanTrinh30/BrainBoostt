import React, { useState } from 'react'
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

  const decks = [
    { category: 'Ngôn Ngữ', name: 'Từ Vựng Tiếng Anh', cards: 150, retention: 85, students: 120, updated: '2 ngày trước' },
    { category: 'Toán Học', name: 'Công Thức Hóa Học', cards: 80, retention: 92, students: 95, updated: 'Hôm nay' },
    { category: 'Khoa Học', name: 'Sinh Học Cơ Bản', cards: 200, retention: 78, students: 110, updated: '1 tuần trước' },
    { category: 'Y Tế', name: 'Giải Phẫu Người', cards: 250, retention: 88, students: 50, updated: '3 ngày trước' },
  ]

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
        {decks.map((deck, idx) => (
          <DeckCard key={idx} {...deck} />
        ))}
      </div>
    </div>
  )
}