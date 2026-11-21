import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AdminConnexionPage } from './pages/AdminConnexionPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminDashboardShell } from './pages/AdminDashboardShell'
import { AdminOfferDetailPage } from './pages/AdminOfferDetailPage'
import { AdminOffersPage } from './pages/AdminOffersPage'
import { AdminStoreDetailPage } from './pages/AdminStoreDetailPage'
import { AdminStoresPage } from './pages/AdminStoresPage'
import { AdminUserDetailPage } from './pages/AdminUserDetailPage'
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
          <Route path="/utilisateurs/:userId" element={<AdminUserDetailPage />} />
          <Route path="/commerces" element={<AdminStoresPage />} />
          <Route path="/commerces/:storeId" element={<AdminStoreDetailPage />} />
          <Route path="/offres" element={<AdminOffersPage />} />
          <Route path="/offres/:offerId" element={<AdminOfferDetailPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/connexion" replace />} />
        <Route path="*" element={<Navigate to="/connexion" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App