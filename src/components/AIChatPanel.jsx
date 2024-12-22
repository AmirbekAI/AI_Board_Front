import React, { useState } from 'react';
import styled from '@emotion/styled';
import { generateGraph } from '../services/openai';

const ChatPanel = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  z-index: 1000;
`;

const ChatHeader = styled.div`
  padding: 12px;
  background: #f5f5f5;
  border-radius: 12px 12px 0 0;
  font-weight: bold;
`;

const ChatMessages = styled.div`
  height: 300px;
  overflow-y: auto;
  padding: 12px;
`;

const Message = styled.div`
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 85%;
  
  ${props => props.isUser ? `
    background: #007AFF;
    color: white;
    margin-left: auto;
  ` : `
    background: #f0f0f0;
    margin-right: auto;
  `}
`;

const InputArea = styled.div`
  padding: 12px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  
  &:focus {
    border-color: #007AFF;
  }
`;

const SendButton = styled.button`
  padding: 8px 16px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: #0056b3;
  }
`;

const AIChatPanel = ({ onGraphDataReceived }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const graphData = await generateGraph(userMessage);
      
      setMessages(prev => [...prev, { 
        text: 'Graph generated successfully!', 
        isUser: false 
      }]);
      
      if (graphData) {
        onGraphDataReceived(graphData);
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
    <ChatPanel>
      <ChatHeader>AI Assistant</ChatHeader>
      <ChatMessages>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
        {isLoading && <Message>Thinking...</Message>}
      </ChatMessages>
      <InputArea>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <SendButton onClick={sendMessage} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </SendButton>
      </InputArea>
    </ChatPanel>
  );
};

export default AIChatPanel; 