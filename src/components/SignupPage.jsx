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

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const registrationData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      };

      console.log('Attempting registration with:', {
        email: registrationData.email,
        fullName: registrationData.fullName
      });

      await authService.register(registrationData);
      console.log('Registration successful');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.message);
      setError(error.response?.data?.message || 'Failed to register');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Container>
      <LoginCard>
        <Title>Create Account</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </InputGroup>
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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <Button type="submit">Sign Up</Button>
        </Form>
        <Footer>
          Already have an account?
          <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Log in</a>
        </Footer>
      </LoginCard>
    </Container>
  );
};

export default SignupPage; 