import './styles/reset.scss'
import './styles/common.scss'
import { Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import LoginPage from './pages/LoginPage/LoginPage'
import { UserLayout } from './layouts/UserLayout'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import VerifyPage from './pages/VerifyPage/VerifyPage'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { useEffect } from 'react'
import { fetchUserInfo } from './features/user/userSlice'
import EventsPage from './pages/EventsPage/EventsPage'
import EventPage from './pages/EventPage/EventPage'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './pages/ProfilePage/ProfilePage'

function App() {
  const token = useAppSelector(state => state.auth.token)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchUserInfo());
    }
  }, [token])

  return (
    <Routes>
      <Route element={<UserLayout />}>
      <Route element={<ProtectedRoute allowedRoles={['Читатель']} />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/event/:id" element={<EventPage />} />
      </Route>
      <Route element={<ProtectedRoute onlyGuest />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-code" element={<VerifyPage />} />
      </Route>
      </Route>
    </Routes>
  )
}

export default App
