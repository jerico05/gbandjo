import { Navigate, Route, Routes } from 'react-router-dom'

import { ConsumerShell } from '../components/layout/ConsumerShell'
import { MerchantShell } from '../components/layout/MerchantShell'
import { PublicLayout } from '../components/layout/PublicLayout'
import { ConsumerMarketplacePage } from '../pages/consumer/ConsumerMarketplacePage'
import { ConnexionPage } from '../pages/ConnexionPage'
import { InscriptionPage } from '../pages/InscriptionPage'
import { LandingPage } from '../pages/LandingPage'
import { NotificationsPage } from '../pages/NotificationsPage'
import { OfferDetailPage } from '../pages/OfferDetailPage'
import { LegacyOfferRedirect } from './LegacyOfferRedirect'
import { ProfilPage } from '../pages/ProfilPage'
import { ConsumerReservationDetailPage } from '../pages/consumer/ConsumerReservationDetailPage'
import { ReservationsPage } from '../pages/ReservationsPage'
import { MerchantDashboardPage } from '../pages/merchant/MerchantDashboardPage'
import { MerchantOffersPage } from '../pages/merchant/MerchantOffersPage'
import { MerchantProductsPage } from '../pages/merchant/MerchantProductsPage'
import { MerchantReservationsPage } from '../pages/merchant/MerchantReservationsPage'
import { MerchantSettingsPage } from '../pages/merchant/MerchantSettingsPage'
import { RequireAuth } from './RequireAuth'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="offres" element={<Navigate to="/espace" replace />} />
        <Route path="offres/:id" element={<LegacyOfferRedirect />} />
        <Route path="connexion" element={<ConnexionPage />} />
        <Route path="inscription" element={<InscriptionPage />} />
      </Route>

      <Route path="espace" element={<ConsumerShell />}>
        <Route index element={<ConsumerMarketplacePage />} />
        <Route path="offres/:id" element={<OfferDetailPage />} />
        <Route
          path="reservations"
          element={
            <RequireAuth roles={['CONSOMMATEUR']}>
              <ReservationsPage />
            </RequireAuth>
          }
        />
        <Route
          path="reservations/:id"
          element={
            <RequireAuth roles={['CONSOMMATEUR']}>
              <ConsumerReservationDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="notifications"
          element={
            <RequireAuth roles={['CONSOMMATEUR']}>
              <NotificationsPage />
            </RequireAuth>
          }
        />
        <Route
          path="profil"
          element={
            <RequireAuth roles={['CONSOMMATEUR']}>
              <ProfilPage />
            </RequireAuth>
          }
        />
      </Route>

      <Route
        path="mon-commerce"
        element={
          <RequireAuth roles={['COMMERCANT']}>
            <MerchantShell />
          </RequireAuth>
        }
      >
        <Route index element={<MerchantDashboardPage />} />
        <Route path="produits" element={<MerchantProductsPage />} />
        <Route path="offres" element={<MerchantOffersPage />} />
        <Route path="reservations" element={<MerchantReservationsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="parametres" element={<MerchantSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}