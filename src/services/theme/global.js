import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    :root {
        --backgroud: ${({ theme }) => theme.background};
        --primary: ${({ theme }) => theme.primary};
        --secondary: ${({ theme }) => theme.secondary};
        --accent: ${({ theme }) => theme.accent};
        --text: ${({ theme }) => theme.text};
        --text-received: ${({ theme }) => theme.textReceived};
        --chat-sent: ${({ theme }) => theme.chatSent};
        --chat-received: ${({ theme }) => theme.chatReceived};
    }
    body {
        background-color: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.text};
    }
    main {
        background-color: ${({ theme }) => theme.backgroundSecondary};
        color: ${({ theme }) => theme.text};
    }
    header {
        background-color: ${({ theme }) => theme.backgroundAccent};
    }
    input {
        background-color: ${({ theme }) => theme.backgroundPrimary};
        color: ${({ theme }) => theme.text};
    }
    .selected {
        background-color: ${({ theme }) => theme.backgroundPrimary};
    }
    .input-container {
        background-color: ${({ theme }) => theme.backgroundAccent};
    }
    .login-form {
        background-color: ${({ theme }) => theme.backgroundAccent};
        color: ${({ theme }) => theme.text};
    }
    .screen-overlay {
        background-color: ${({ theme }) => theme.background};
    }
    svg {
        fill: ${({ theme }) => theme.text};
    }
    ::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.backgroundSecondary};
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.backgroundPrimary};
        border-radius: 10px;
    }
`;
