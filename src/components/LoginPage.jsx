import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import {
  Container,
  LoginCard,
  Title,
  Form,
  InputGroup,
  Label,
  Input,
  Button,
  Footer,
  ErrorMessage
} from '../styles/LoginPage.styles';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(formData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title>Welcome Back</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <Button type="submit">Log In</Button>
        </Form>
        <Footer>
          Don't have an account?
          <a onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>Sign up</a>
        </Footer>
      </LoginCard>
    </Container>
  );
};

export default LoginPage; 