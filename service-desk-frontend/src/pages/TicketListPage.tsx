import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, deleteTicket, getSummary, getTickets } from '../api/ticketApi'
import DashboardSummary from '../components/DashboardSummary'
import ErrorMessage from '../components/ErrorMessage'
import LoadingMessage from '../components/LoadingMessage'
import TicketFilters from '../components/TicketFilters'
import {
    EMPTY_FILTERS,
    type Ticket,
    type TicketFilters as TicketFilterValues,
    type TicketSummary,
} from '../types/ticket'

function TicketTable({
    tickets,
    hasActiveFilters,
    onDelete,
}: {
    tickets: Ticket[]
    hasActiveFilters: boolean
    onDelete: (ticket: Ticket) => void
}) {
    if (tickets.length === 0) {
        return <p>{hasActiveFilters ? 'No tickets match your filters.' : 'No tickets yet.'}</p>
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                        <td>{ticket.title}</td>
                        <td>{ticket.status}</td>
                        <td>{ticket.priority}</td>
                        <td>
                            <button type="button" onClick={() => onDelete(ticket)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function getErrorMessage(error: unknown): string {
    return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.'
}

function TicketListPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [summary, setSummary] = useState<TicketSummary | null>(null)
    const [filters, setFilters] = useState<TicketFilterValues>(EMPTY_FILTERS)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)
    const [reloadKey, setReloadKey] = useState(0)

    // Loads tickets and summary whenever the filters change or reloadKey is bumped
    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                const [ticketList, summaryData] = await Promise.all([getTickets(filters), getSummary()])
                if (cancelled) return
                setTickets(ticketList)
                setSummary(summaryData)
                setError(null)
            } catch (err) {
                if (cancelled) return
                setError(getErrorMessage(err))
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()

        // If the filters change again before this request finishes, ignore its result
        return () => {
            cancelled = true
        }
    }, [filters, reloadKey])

    function handleFiltersChange(newFilters: TicketFilterValues) {
        setActionError(null)
        setLoading(true)
        // Copy the object so React always sees a change and reloads
        setFilters({ ...newFilters })
    }

    function handleRetry() {
        setActionError(null)
        setError(null)
        setLoading(true)
        setReloadKey((key) => key + 1)
    }

    async function handleDelete(ticket: Ticket) {
        const confirmed = window.confirm(`Delete "${ticket.title}"? This cannot be undone.`)
        if (!confirmed) return

        setActionError(null)
        try {
            await deleteTicket(ticket.id)
        } catch (err) {
            setActionError(getErrorMessage(err))
        }
        // Reload either way, so the list always matches the database
        setReloadKey((key) => key + 1)
    }

    const hasActiveFilters = filters.status !== '' || filters.priority !== '' || filters.search !== ''

    let content
    if (loading) {
        content = <LoadingMessage message="Loading tickets..." />
    } else if (error) {
        content = <ErrorMessage message={error} onRetry={handleRetry} />
    } else {
        content = (
            <TicketTable tickets={tickets} hasActiveFilters={hasActiveFilters} onDelete={handleDelete} />
        )
    }

    return (
        <div>
            <div className="page-header">
                <h2>Tickets</h2>
                <Link to="/tickets/new" className="btn btn-primary">
                    New ticket
                </Link>
            </div>

            {summary && <DashboardSummary summary={summary} />}

            <TicketFilters filters={filters} onChange={handleFiltersChange} />

            {actionError && <ErrorMessage message={actionError} />}

            {content}
        </div>
    )
}

export default TicketListPage