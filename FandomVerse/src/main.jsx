import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import ReactDOM from "react-dom/client";
import { CartProvider } from "./context/CartProvider";
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CartProvider>
        <App />
    </CartProvider>
  </BrowserRouter>
)
