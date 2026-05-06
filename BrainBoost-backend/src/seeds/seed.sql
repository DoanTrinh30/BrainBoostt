-- Generated SQL Data (Updated: Added User 11, set author_id=1)
-- Timestamp format: 'YYYY-MM-DD HH:MI:SS'
-- Note: Passwords for users are plain text examples or hash placeholders, NOT securely hashed for production.

-- =============================================
-- Users Table (Mock Data)
-- =============================================
-- Columns: id, email, password, username, dob, avatar_url, created_at, updated_at
INSERT INTO users (id, email, password, username, dob, avatar_url, created_at, updated_at) VALUES
(1, 'admin.user@example.com', '$2b$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKL1234567890.', 'admin_user', '1990-01-01', NULL, '2024-09-15 09:00:00', '2024-09-15 09:00:00'); -- Placeholder hash for '@Admin123' (bcrypt, 12 rounds)

-- =============================================
-- Roles Table (Plausible Data)
-- =============================================
-- Columns: id, name, created_at, updated_at
INSERT INTO roles (id, name, created_at, updated_at) VALUES
(1, 'Admin', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 'Teacher', '2024-05-25 18:00:00', '2024-05-25 18:00:00'),
(3, 'Student', '2024-06-30 20:00:00', '2024-06-30 20:00:00');

-- =============================================
-- Decks Table (Plausible Data - Author ID updated to 1)
-- Note: UUIDs are generated placeholders. Use actual UUID generation in a real application if needed.
-- =============================================
-- Columns: id, name, description, visibility, created_at, updated_at, author_id
INSERT INTO decks (id, name, description, visibility, created_at, updated_at, author_id) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Spanish Basics', 'Fundamental Spanish vocabulary and phrases.', 'public', '2024-01-12 11:00:00', '2024-06-01 14:00:00', 1), -- Author ID updated
('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'World Capitals', 'Flashcards for capitals of countries.', 'public', '2024-02-05 09:30:00', '2024-02-05 09:30:00', 1), -- Author ID updated
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Physics Formulas', 'Key formulas for introductory physics.', 'private', '2024-02-20 16:00:00', '2024-07-15 10:00:00', 1), -- Author ID updated
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'JavaScript Fundamentals', 'Core concepts of JavaScript.', 'public', '2024-03-10 13:15:00', '2024-03-10 13:15:00', 1), -- Author ID updated
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Organic Chemistry Reactions', NULL, 'private', '2024-03-25 18:00:00', '2024-08-01 11:00:00', 1), -- Author ID updated
('f6a7b8c9-d0e1-2345-6789-0abcdef01234', 'Italian Phrases', 'Common phrases for traveling in Italy.', 'public', '2024-04-15 10:00:00', '2024-04-15 10:00:00', 1), -- Author ID updated
('a7b8c9d0-e1f2-3456-7890-bcdef0123456', 'Biology Cell Structures', 'Diagrams and functions of cell parts.', 'private', '2024-05-02 14:45:00', '2024-05-02 14:45:00', 1), -- Author ID updated
('b8c9d0e1-f2a3-4567-8901-cdef01234567', 'Historical Dates', 'Important dates in world history.', 'public', '2024-05-20 19:00:00', '2024-09-01 16:30:00', 1), -- Author ID updated
('c9d0e1f2-a3b4-5678-9012-def012345678', 'Python Syntax Quick Reference', NULL, 'private', '2024-06-10 08:00:00', '2024-06-10 08:00:00', 1), -- Author ID updated
('d0e1f2a3-b4c5-6789-0123-ef0123456789', 'French Vocabulary - Food', 'Common food items in French.', 'public', '2024-07-01 15:20:00', '2024-07-01 15:20:00', 1); -- Author ID updated

-- =============================================
-- Folders Table (Plausible Data - Author ID updated to 1)
-- =============================================
-- Columns: id, name, visibility, created_at, updated_at, author_id
INSERT INTO folders (id, name, visibility, created_at, updated_at, author_id) VALUES
('f0e1d2c3-b4a5-6789-0123-456789abcdef', 'Language Learning', 'private', '2024-01-20 09:00:00', '2024-07-10 10:00:00', 1), -- Author ID updated
('e1d2c3b4-a5f6-7890-1234-56789abcdef0', 'Science Studies', 'private', '2024-02-15 11:00:00', '2024-02-15 11:00:00', 1), -- Author ID updated
('d2c3b4a5-f6e7-8901-2345-6789abcdef01', 'History Buff', 'public', '2024-03-01 14:30:00', '2024-08-20 12:00:00', 1), -- Author ID updated
('c3b4a5f6-e7d8-9012-3456-789abcdef012', 'Programming', 'private', '2024-03-12 10:00:00', '2024-03-12 10:00:00', 1), -- Author ID updated
('b4a5f6e7-d8c9-0123-4567-89abcdef0123', 'Travel Prep', 'public', '2024-04-10 16:00:00', '2024-04-10 16:00:00', 1), -- Author ID updated
('a5f6e7d8-c9b0-1234-5678-9abcdef01234', 'Personal Notes', 'private', '2024-05-05 13:00:00', '2024-09-05 09:00:00', 1), -- Author ID updated
('f6e7d8c9-b0a1-2345-6789-abcdef012345', 'Work Projects', 'private', '2024-06-01 17:00:00', '2024-06-01 17:00:00', 1), -- Author ID updated
('e7d8c9b0-a1f2-3456-7890-bcdef0123456', 'Exam Revision', 'private', '2024-06-20 10:45:00', '2024-06-20 10:45:00', 1), -- Author ID updated
('d8c9b0a1-f2e3-4567-8901-cdef01234567', 'Spanish Resources', 'public', '2024-07-15 12:10:00', '2024-07-15 12:10:00', 1), -- Author ID updated
('c9b0a1f2-e3d4-5678-9012-def012345678', 'Coding Snippets', 'private', '2024-08-01 19:30:00', '2024-08-01 19:30:00', 1); -- Author ID updated

-- =============================================
-- Classes Table (Plausible Data - Author ID updated to 1)
-- =============================================
-- Columns: id, name, student_quantity, created_at, updated_at, author_id
INSERT INTO classes (id, name, student_quantity, created_at, updated_at, author_id) VALUES
('c1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'Spanish 101', 25, '2024-01-25 10:00:00', '2024-09-01 10:00:00', 1), -- Author ID updated
('d2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'Physics for Beginners', 30, '2024-02-18 14:00:00', '2024-02-18 14:00:00', 1), -- Author ID updated
('e3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'Modern World History', 45, '2024-03-05 09:15:00', '2024-08-25 11:00:00', 1), -- Author ID updated
('f4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9', 'Web Development Bootcamp', 15, '2024-04-02 13:30:00', '2024-04-02 13:30:00', 1), -- Author ID updated
('a5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 'Introduction to Biology', 50, '2024-04-28 11:00:00', '2024-04-28 11:00:00', 1), -- Author ID updated
('b6f7a8b9-c0d1-e2f3-a4b5-c6d7e8f9a0b1', 'Italian Conversation Practice', 10, '2024-05-15 18:00:00', '2024-09-10 18:30:00', 1), -- Author ID updated
('c7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 'Advanced Organic Chemistry', 20, '2024-06-10 15:00:00', '2024-06-10 15:00:00', 1), -- Author ID updated
('d8b9c0d1-e2f3-a4b5-c6d7-e8f9a0b1c2d3', 'Data Structures in Python', 35, '2024-07-01 09:45:00', '2024-07-01 09:45:00', 1), -- Author ID updated
('e9c0d1e2-f3a4-b5c6-d7e8-f9a0b1c2d3e4', 'English Literature Survey', 40, '2024-07-20 16:20:00', '2024-07-20 16:20:00', 1), -- Author ID updated
('f0d1e2f3-a4b5-c6d7-e8f9-a0b1c2d3e4f5', 'Study Group - History Exam', 5, '2024-08-05 19:00:00', '2024-08-05 19:00:00', 1); -- Author ID updated

-- =============================================
-- Flashcards Table (Plausible Data)
-- =============================================
-- Columns: id, front_text, back_text, image_url, audio_url, description, created_at, updated_at, deck_id
-- Reference Deck IDs used below:
-- 'a1b2c3d4-e5f6-7890-1234-567890abcdef' (Spanish Basics)
-- 'b2c3d4e5-f6a7-8901-2345-67890abcdef0' (World Capitals)
-- 'c3d4e5f6-a7b8-9012-3456-7890abcdef01' (Physics Formulas)
-- 'd4e5f6a7-b8c9-0123-4567-890abcdef012' (JavaScript Fundamentals)
-- 'f6a7b8c9-d0e1-2345-6789-0abcdef01234' (Italian Phrases)
-- 'a7b8c9d0-e1f2-3456-7890-bcdef0123456' (Biology Cell Structures)
-- 'd0e1f2a3-b4c5-6789-0123-ef0123456789' (French Vocabulary - Food)

INSERT INTO flashcards (id, front_text, back_text, image_url, audio_url, description, created_at, updated_at, deck_id) VALUES
('fc1d2e3f-a4b5-c6d7-e8f9-a0b1c2d3e4f5', 'Hello', 'Hola', NULL, NULL, 'Basic Spanish greeting', '2024-01-13 10:00:00', '2024-01-13 10:00:00', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
('fc2d3e4f-b5c6-d7e8-f9a0-b1c2d3e4f5a6', 'Thank you', 'Gracias', NULL, 'https://example.com/audio/gracias.mp3', NULL, '2024-01-13 10:05:00', '2024-01-13 10:05:00', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
('fc3e4f5a-c6d7-e8f9-a0b1-c2d3e4f5a6b7', 'Japan', 'Tokyo', 'https://example.com/img/tokyo.jpg', NULL, 'Capital city', '2024-02-06 11:00:00', '2024-02-06 11:00:00', 'b2c3d4e5-f6a7-8901-2345-67890abcdef0'),
('fc4f5a6b-d7e8-f9a0-b1c2-d3e4f5a6b7c8', 'France', 'Paris', NULL, NULL, NULL, '2024-02-06 11:05:00', '2024-02-06 11:05:00', 'b2c3d4e5-f6a7-8901-2345-67890abcdef0'),
('fc5a6b7c-e8f9-a0b1-c2d3-e4f5a6b7c8d9', 'Force', 'F = ma', NULL, NULL, 'Newtons Second Law', '2024-02-21 09:00:00', '2024-02-21 09:00:00', 'c3d4e5f6-a7b8-9012-3456-7890abcdef01'),
('fc6b7c8d-f9a0-b1c2-d3e4-f5a6b7c8d9e0', 'Energy-Mass Equivalence', 'E = mc^2', NULL, NULL, 'Einsteins famous equation', '2024-02-21 09:05:00', '2024-02-21 09:05:00', 'c3d4e5f6-a7b8-9012-3456-7890abcdef01'),
('fc7c8d9e-a0b1-c2d3-e4f5-a6b7c8d9e0f1', 'Declare a variable (modern JS)', 'let variableName;', NULL, NULL, 'Use let or const', '2024-03-11 15:00:00', '2024-03-11 15:00:00', 'd4e5f6a7-b8c9-0123-4567-890abcdef012'),
('fc8d9e0f-b1c2-d3e4-f5a6-b7c8d9e0f1a2', 'Where is the bathroom?', 'Dovè il bagno?', NULL, 'https://example.com/audio/bagno.mp3', NULL, '2024-04-16 12:00:00', '2024-04-16 12:00:00', 'f6a7b8c9-d0e1-2345-6789-0abcdef01234'),
('fc9e0f1a-c2d3-e4f5-a6b7-c8d9e0f1a2b3', 'Powerhouse of the cell', 'Mitochondria', 'https://example.com/img/mito.png', NULL, NULL, '2024-05-03 10:30:00', '2024-05-03 10:30:00', 'a7b8c9d0-e1f2-3456-7890-bcdef0123456'),
('fc0f1a2b-d3e4-f5a6-b7c8-d9e0f1a2b3c4', 'Bread', 'Le pain', NULL, NULL, 'Common French food', '2024-07-02 16:00:00', '2024-07-02 16:00:00', 'd0e1f2a3-b4c5-6789-0123-ef0123456789');

-- =============================================
-- End of Script
-- =============================================
