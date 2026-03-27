import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { GlobalStyles } from '@mui/material'
import theme from './styles/theme'

const globalStyles = (
  <GlobalStyles
    styles={{
      '@keyframes slideInDown': {
        from: {
          opacity: 0,
          transform: 'translateY(-20px)',
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
      '@keyframes slideInUp': {
        from: {
          opacity: 0,
          transform: 'translateY(20px)',
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
      '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      '@keyframes pulse': {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.7 },
      },
    }}
  />
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)