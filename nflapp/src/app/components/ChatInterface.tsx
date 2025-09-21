"use client";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  type?: 'improvement' | 'explanation' | 'comparison' | 'general' | 'error';
  timestamp: Date;
}

interface ChatInterfaceProps {
  predictionData?: any;
  explanationData?: any;
}

export default function ChatInterface({ predictionData, explanationData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your NFL MVP prediction assistant. I'll compare your stats to Josh Allen's 2024 MVP season. Make a prediction first, then ask me questions like 'How can I improve?' or 'Why is the prediction low?'",
      sender: 'bot',
      type: 'general',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/chat', {
        message: inputMessage,
        prediction_data: predictionData
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'bot',
        type: response.data.type,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        type: 'error',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
  };

  const quickActions = [
    "How can I improve?",
    "Why is my prediction low?",
    "Compare to Josh Allen",
    "What makes a good MVP?"
  ];

  return (
    <div
      style={{
        width: '400px',
        height: '600px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid #90caf9'
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          padding: '15px',
          borderTopLeftRadius: '13px',
          borderTopRightRadius: '13px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>MVP Assistant</h3>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: '10px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            <div
              style={{
                padding: '10px 15px',
                borderRadius: '15px',
                backgroundColor: message.sender === 'user' ? '#1e3c72' : '#f0f9ff',
                color: message.sender === 'user' ? 'white' : '#1e3c72',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                whiteSpace: 'pre-wrap'
              }}
            >
              {message.text}
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: '#666',
                marginTop: '2px',
                textAlign: message.sender === 'user' ? 'right' : 'left'
              }}
            >
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start' }}>
            <div
              style={{
                padding: '10px 15px',
                borderRadius: '15px',
                backgroundColor: '#f0f9ff',
                color: '#1e3c72'
              }}
            >
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {predictionData && (
        <div style={{ padding: '10px', borderTop: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>Quick questions:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                style={{
                  padding: '5px 10px',
                  fontSize: '0.75rem',
                  backgroundColor: '#e3f2fd',
                  border: '1px solid #90caf9',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  color: '#1e3c72'
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: '10px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          gap: '10px'
        }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me about MVP predictions..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #90caf9',
            borderRadius: '20px',
            outline: 'none',
            fontSize: '0.9rem'
          }}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim()}
          style={{
            padding: '10px 15px',
            backgroundColor: '#1e3c72',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading || !inputMessage.trim() ? 0.5 : 1
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}