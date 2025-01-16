import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { CustomDialogs } from './custom/dialogs'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomDialogs>
      <App />
    </CustomDialogs>
  </StrictMode >
)
