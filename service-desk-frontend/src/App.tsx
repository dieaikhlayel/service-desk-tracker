import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import TicketDetailPage from './pages/TicketDetailPage'
import TicketFormPage from './pages/TicketFormPage'
import TicketListPage from './pages/TicketListPage'

function NotFoundPage() {
  return (
    <div className="empty-state">
      <p>Page not found.</p>
      <Link to="/" className="btn btn-primary">
        Back to tickets
      </Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <div className="container">
          <Link to="/" className="app-title">
            IT Service Desk Tracker
          </Link>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<TicketListPage />} />
          <Route path="/tickets/new" element={<TicketFormPage key="new" />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/tickets/:id/edit" element={<TicketFormPage key="edit" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App