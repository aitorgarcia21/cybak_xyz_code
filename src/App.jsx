import './App.css'
import AppRoutes from "@/pages/Routes.jsx"
import { Toaster } from "@/components/ui/toaster"
import Dashboard from './pages/Dashboard'
import Audit from './pages/Audit'
import AuditResults from './pages/AuditResults'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import PaymentSuccess from './pages/PaymentSuccess'
import Admin from './pages/Admin'

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  )
}

export default App 