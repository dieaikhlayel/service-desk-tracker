import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError, deleteTicket, getTicket } from '../api/ticketApi'
import ErrorMessage from '../components/ErrorMessage'
import LoadingMessage from '../components/LoadingMessage'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
import { CATEGORY_LABELS, type Ticket } from '../types/ticket'
import { formatDate } from '../utils/formatDate'

function TicketDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const ticketId = Number(id)
    const invalidId = !Number.isInteger(ticketId)

    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [loading, setLoading] = useState(!invalidId)
    const [error, setError] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [actionError, setActionError] = useState<string | null>(null)
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        if (invalidId) return

        let cancelled = false

        async function load() {
            try {
                const data = await getTicket(ticketId)
                if (cancelled) return
                setTicket(data)
                setError(null)
            } catch (err) {
                if (cancelled) return
                setError(err instanceof ApiError ? err.message : 'Could not load the ticket.')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()

        return () => {
            cancelled = true
        }
    }, [ticketId, invalidId, reloadKey])

    function handleRetry() {
        setError(null)
        setLoading(true)
        setReloadKey((key) => key + 1)
    }

    async function handleDelete() {
        if (!ticket) return
        const confirmed = window.confirm(`Delete "${ticket.title}"? This cannot be undone.`)
        if (!confirmed) return

        setDeleting(true)
        setActionError(null)
        try {
            await deleteTicket(ticket.id)
            navigate('/')
        } catch (err) {
            setActionError(err instanceof ApiError ? err.message : 'Could not delete the ticket.')
            setDeleting(false)
        }
    }

    if (invalidId) {
        return (
            <div>
                <ErrorMessage message="That is not a valid ticket id." />
                <Link to="/" className="btn">
                    Back to tickets
                </Link>
            </div>
        )
    }

    if (loading) {
        return <LoadingMessage message="Loading ticket..." />
    }

    if (error || !ticket) {
        return (
            <div>
                <ErrorMessage message={error ?? 'Ticket not found.'} onRetry={handleRetry} />
                <Link to="/" className="btn">
                    Back to tickets
                </Link>
            </div>
        )
    }

    return (
        <div>
            <div className="page-header">
                <h2>{ticket.title}</h2>
                <div className="badge-group">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                </div>
            </div>

            {actionError && <ErrorMessage message={actionError} />}

            <dl className="ticket-details">
                <div>
                    <dt>Category</dt>
                    <dd>{CATEGORY_LABELS[ticket.category]}</dd>
                </div>
                <div>
                    <dt>Created</dt>
                    <dd>{formatDate(ticket.createdAt)}</dd>
                </div>
                <div>
                    <dt>Ticket ID</dt>
                    <dd>#{ticket.id}</dd>
                </div>
            </dl>

            <h3>Description</h3>
            <p className="ticket-description">{ticket.description}</p>

            <div className="form-actions">
                <Link to="/" className="btn">
                    Back to tickets
                </Link>
                <Link to={`/tickets/${ticket.id}/edit`} className="btn btn-primary">
                    Edit
                </Link>
                <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    )
}

export default TicketDetailPage