import { Link } from 'react-router-dom'
import { CATEGORY_LABELS, type Ticket } from '../types/ticket'
import { formatDate } from '../utils/formatDate'
import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'

interface TicketTableProps {
    tickets: Ticket[]
    hasActiveFilters: boolean
    onDelete: (ticket: Ticket) => void
}

function TicketTable({ tickets, hasActiveFilters, onDelete }: TicketTableProps) {
    if (tickets.length === 0) {
        return (
            <div className="empty-state">
                {hasActiveFilters ? (
                    <p>No tickets match your search or filters.</p>
                ) : (
                    <>
                        <p>No tickets yet.</p>
                        <Link to="/tickets/new" className="btn btn-primary">
                            Create your first ticket
                        </Link>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="table-wrapper">
            <table className="ticket-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                            <td data-label="Title">
                                <Link to={`/tickets/${ticket.id}`}>{ticket.title}</Link>
                            </td>
                            <td data-label="Category">{CATEGORY_LABELS[ticket.category]}</td>
                            <td data-label="Priority">
                                <PriorityBadge priority={ticket.priority} />
                            </td>
                            <td data-label="Status">
                                <StatusBadge status={ticket.status} />
                            </td>
                            <td data-label="Created">{formatDate(ticket.createdAt)}</td>
                            <td data-label="Actions" className="row-actions">
                                <Link to={`/tickets/${ticket.id}`} className="btn btn-small">
                                    View
                                </Link>
                                <Link to={`/tickets/${ticket.id}/edit`} className="btn btn-small">
                                    Edit
                                </Link>
                                <button type="button" className="btn btn-small btn-danger" onClick={() => onDelete(ticket)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TicketTable