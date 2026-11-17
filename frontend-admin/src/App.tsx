import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AdminConnexionPage } from './pages/AdminConnexionPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminDashboardShell } from './pages/AdminDashboardShell'
import { AdminOffersPage } from './pages/AdminOffersPage'
import { AdminStoresPage } from './pages/AdminStoresPage'
import { AdminUsersPage } from './pages/AdminUsersPage'
import { RequireAdmin } from './routes/RequireAdmin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/connexion" element={<AdminConnexionPage />} />
        <Route
          element={
            <RequireAdmin>
              <AdminDashboardShell />
            </RequireAdmin>
          }
        >
          <Route path="/tableau-de-bord" element={<AdminDashboardPage />} />
          <Route path="/utilisateurs" element={<AdminUsersPage />} />
          <Route path="/commerces" element={<AdminStoresPage />} />
          <Route path="/offres" element={<AdminOffersPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/connexion" replace />} />
        <Route path="*" element={<Navigate to="/connexion" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App