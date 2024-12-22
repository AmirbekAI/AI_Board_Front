import { Global, css, keyframes } from '@emotion/react';

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const GlobalStyles = () => (
  <Global
    styles={css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html, 
      body,
      #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                     'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
                     'Droid Sans', 'Helvetica Neue', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: ${gradientMove} 15s ease infinite;
      }

      #root {
        display: flex;
        flex-direction: column;
      }

      button {
        font-family: inherit;
      }

      input {
        font-family: inherit;
      }
    `}
  />
);
