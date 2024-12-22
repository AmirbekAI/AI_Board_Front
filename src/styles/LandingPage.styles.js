import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0;
  padding: 0;
  left: 0;
  right: 0;
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #fff, #ffffffcc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${float} 3s ease-in-out infinite;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: center;
`;

export const NavLink = styled.a`
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background: linear-gradient(to right, #fff, transparent);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #ffffff;
    transform: translateY(-2px);
    &:after {
      width: 100%;
    }
  }
`;

export const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12rem 2rem 6rem 2rem;
  position: relative;
  animation: ${fadeIn} 1s ease-out;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
    z-index: -1;
  }
`;

export const Title = styled.h1`
  font-size: 4.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1.5rem;
  max-width: 800px;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  animation: ${fadeIn} 1s ease-out 0.2s both;
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  max-width: 600px;
  line-height: 1.8;
  animation: ${fadeIn} 1s ease-out 0.4s both;
`;

export const Button = styled.button`
  padding: 1rem 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 1s ease-out 0.6s both;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
`;
