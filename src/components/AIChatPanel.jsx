import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { generateGraph } from '../services/openai';
import { arrangeNodes } from '../utils/layoutUtils';

const ChatPanel = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: ${props => props.isMinimized ? '50px' : '380px'};
  height: ${props => props.isMinimized ? '50px' : 'auto'};
  background: #ffffff;
  border-radius: ${props => props.isMinimized ? '25px' : '16px'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  border: 1px solid rgba(22, 24, 35, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    transform: ${props => props.isMinimized ? 'scale(1.1)' : 'none'};
  }
`;

const ChatContent = styled.div`
  opacity: ${props => props.isMinimized ? 0 : 1};
  visibility: ${props => props.isMinimized ? 'hidden' : 'visible'};
  transition: opacity 0.2s ease;
  height: ${props => props.isMinimized ? '0' : 'auto'};
`;

const CircleButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  background: #007AFF;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: ${props => props.isMinimized ? 1 : 0};
  visibility: ${props => props.isMinimized ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ChatHeader = styled.div`
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid rgba(22, 24, 35, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background: #f1f3f5;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 24px;
    height: 24px;
    color: #007AFF;
  }
`;

const MinimizeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #adb5bd;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #868e96;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HeaderTitle = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 16px;
`;

const ChatMessages = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
`;

const Message = styled.div`
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 85%;
  line-height: 1.5;
  font-size: 14px;
  transition: all 0.2s ease;
  
  ${props => props.isUser ? `
    background: #007AFF;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 122, 255, 0.15);

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
    }
  ` : `
    background: #f1f3f5;
    color: #1a1a1a;
    margin-right: auto;
    border-bottom-left-radius: 4px;

    &:hover {
      background: #f8f9fa;
    }
  `}
`;

const InputArea = styled.div`
  padding: 16px 20px;
  border-top: 1px solid rgba(22, 24, 35, 0.05);
  background: #ffffff;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #007AFF;
    box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }

  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #adb5bd;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const LoadingDots = styled.span`
  &::after {
    content: '...';
    animation: dots 1.5s steps(4, end) infinite;
  }

  @keyframes dots {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
  }
`;

const AIChatPanel = ({ onGraphDataReceived }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const graphData = await generateGraph(userMessage);
      const arrangedGraphData = arrangeNodes(graphData);
      
      setMessages(prev => [...prev, { 
        text: 'Graph generated successfully! You can now see the concept map on the canvas.', 
        isUser: false 
      }]);
      
      if (arrangedGraphData) {
        onGraphDataReceived(arrangedGraphData);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: `Error: ${error.message || 'Unknown error occurred'}`, 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ChatPanel isMinimized={isMinimized}>
      <CircleButton 
        isMinimized={isMinimized}
        onClick={() => setIsMinimized(false)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
      </CircleButton>
      
      <ChatContent isMinimized={isMinimized}>
        <ChatHeader>
          <HeaderLeft>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <HeaderTitle>AI Graph Assistant</HeaderTitle>
          </HeaderLeft>
          <MinimizeButton onClick={() => setIsMinimized(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </MinimizeButton>
        </ChatHeader>
        <ChatMessages>
          {messages.map((message, index) => (
            <Message key={index} isUser={message.isUser}>
              {message.text}
            </Message>
          ))}
          {isLoading && (
            <Message>
              Generating graph<LoadingDots/>
            </Message>
          )}
          <div ref={messagesEndRef} />
        </ChatMessages>
        <InputArea>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe a concept to visualize..."
            disabled={isLoading}
          />
          <SendButton onClick={sendMessage} disabled={isLoading}>
            {isLoading ? (
              <>Processing<LoadingDots/></>
            ) : (
              <>
                Send
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </>
            )}
          </SendButton>
        </InputArea>
      </ChatContent>
    </ChatPanel>
  );
};

export default AIChatPanel; 