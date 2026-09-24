import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import ReactDOM from "react-dom/client";
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
