// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PaymentPage from './pages/PaymentPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import CancelPage from './pages/CancelPage.jsx'
import SuccessPage from './pages/SuccessPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaymentPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
