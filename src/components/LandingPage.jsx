import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Nav,
  Logo,
  NavLinks,
  NavLink,
  HeroSection,
  Title,
  Subtitle,
  Button
} from '../styles/LandingPage.styles';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Nav>
        <Logo>MindMap</Logo>
        <NavLinks>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink as="span" onClick={() => navigate('/login')}>Login</NavLink>
          <NavLink as="span" onClick={() => navigate('/signup')}>Sign Up</NavLink>
        </NavLinks>
      </Nav>

      <HeroSection>
        <Title>Transform Your Ideas Into Visual Maps</Title>
        <Subtitle>
          Create, organize, and share your thoughts with our intuitive mind
          mapping tool. Perfect for brainstorming, project planning, and
          knowledge organization.
        </Subtitle>
        <Button onClick={() => navigate('/signup')}>Get Started Free</Button>
      </HeroSection>
    </Container>
  );
};

export default LandingPage; 