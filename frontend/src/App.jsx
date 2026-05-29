import {
  Routes,
  Route
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Especies from './pages/Especies';
import Ventas from './pages/Ventas';
import Plagas from './pages/Plagas';
import Reportes from './pages/Reportes';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {

  return (

    

      <Routes>

          <Route path="/" element={<Login />} />

          <Route
              path="/dashboard"
              element={
                  <ProtectedRoute>
                      <Dashboard />
                  </ProtectedRoute>
              }
          />

          <Route
              path="/especies"
              element={
                  <ProtectedRoute>
                      <Especies />
                  </ProtectedRoute>
              }
          />

          <Route
              path="/ventas"
              element={
                  <ProtectedRoute>
                      <Ventas />
                  </ProtectedRoute>
              }
          />

          <Route
              path="/plagas"
              element={
                  <ProtectedRoute>
                      <Plagas />
                  </ProtectedRoute>
              }
          />

          <Route
              path="/reportes"
              element={
                  <ProtectedRoute>
                      <Reportes />
                  </ProtectedRoute>
              }
          />

      </Routes>

    

  )
}

export default App