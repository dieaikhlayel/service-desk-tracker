import type { TicketSummary } from '../types/ticket'

interface DashboardSummaryProps {
    summary: TicketSummary
}

function DashboardSummary({ summary }: DashboardSummaryProps) {
    const cards = [
        { label: 'Total', value: summary.total, className: 'summary-total' },
        { label: 'Open', value: summary.open, className: 'summary-open' },
        { label: 'In Progress', value: summary.inProgress, className: 'summary-in-progress' },
        { label: 'Resolved', value: summary.resolved, className: 'summary-resolved' },
    ]

    return (
        <section className="summary" aria-label="Ticket summary">
            {cards.map((card) => (
                <div key={card.label} className={`summary-card ${card.className}`}>
                    <span className="summary-value">{card.value}</span>
                    <span className="summary-label">{card.label}</span>
                </div>
            ))}
        </section>
    )
}

export default DashboardSummary