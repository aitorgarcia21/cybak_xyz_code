import './App.css'
import AppRoutes from "@/pages/Routes.jsx"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  )
}

export default App 