import './App.css'
import Routes from './Routes/AppRouter.jsx';
import { CartProvider } from './context/CartProvider.jsx';

function App() {
  return (
    <CartProvider>
      <div className="app-shell">
        <Routes />
      </div>
    </CartProvider>
  )
}

export default App;
