import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardService, authService } from '../services/api';
import styled from 'styled-components';
import {
  Container,
  Header,
  UserSection,
  MainContent,
  BoardsGrid,
  BoardCard,
  CreateBoardCard,
  Title,
  BoardTitle,
  EmptyMessage,
  LogoutButton,
  ErrorMessage,
  Modal,
  ModalContent,
  ModalTitle,
  Input,
  ButtonGroup,
  ModalButton
} from '../styles/ProfilePage.styles';

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;

  &:hover {
    background: #cc0000;
  }
`;

const StyledBoardCard = styled(BoardCard)`
  position: relative;

  &:hover ${DeleteButton} {
    opacity: 1;
  }
`;

const ProfilePage = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await boardService.getAllBoards();
      setBoards(data);
    } catch (err) {
      setError('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) {
      setError('Board title cannot be empty');
      return;
    }

    try {
      const newBoard = await boardService.createBoard({
        title: newBoardTitle.trim()
      });
      setShowModal(false);
      setNewBoardTitle('');
      navigate(`/board/${newBoard.id}`);
    } catch (err) {
      setError('Failed to create board');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleDeleteBoard = async (e, boardId) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this board?')) {
      return;
    }
    
    try {
      console.log('Deleting board with ID:', boardId);
      const id = typeof boardId === 'string' ? parseInt(boardId, 10) : boardId;
      console.log('Parsed ID:', id);
      await boardService.deleteBoard(id);
      console.log('Board deleted successfully');
      setBoards(boards.filter(board => board.id !== boardId));
    } catch (err) {
      console.error('Error deleting board:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        boardId: boardId,
        parsedId: typeof boardId === 'string' ? parseInt(boardId, 10) : boardId
      });
      setError(`Failed to delete board: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Header>
        <UserSection>
          <Title>My Boards</Title>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserSection>
      </Header>

      <MainContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <BoardsGrid>
          <CreateBoardCard onClick={() => setShowModal(true)}>
            <span>+</span>
            <p>Create New Board</p>
          </CreateBoardCard>
          
          {boards.map((board) => (
            <StyledBoardCard 
              key={board.id} 
              onClick={() => navigate(`/board/${board.id}`)}
            >
              <BoardTitle>{board.title}</BoardTitle>
              <span>Last edited: {new Date(board.lastEdited).toLocaleDateString()}</span>
              <DeleteButton 
                onClick={(e) => handleDeleteBoard(e, board.id)}
                aria-label="Delete board"
              >
                Delete
              </DeleteButton>
            </StyledBoardCard>
          ))}
        </BoardsGrid>
      </MainContent>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Create New Board</ModalTitle>
            <Input
              type="text"
              placeholder="Enter board title"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              autoFocus
            />
            <ButtonGroup>
              <ModalButton onClick={() => setShowModal(false)} secondary>
                Cancel
              </ModalButton>
              <ModalButton onClick={handleCreateBoard}>
                Create
              </ModalButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ProfilePage; 