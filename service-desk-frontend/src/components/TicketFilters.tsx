import { useState, type FormEvent } from 'react'
import {
    EMPTY_FILTERS,
    PRIORITIES,
    PRIORITY_LABELS,
    STATUSES,
    STATUS_LABELS,
    type Priority,
    type Status,
    type TicketFilters as TicketFilterValues,
} from '../types/ticket'

interface TicketFiltersProps {
    filters: TicketFilterValues
    onChange: (filters: TicketFilterValues) => void
}

function TicketFilters({ filters, onChange }: TicketFiltersProps) {
    // The text box keeps its own copy, so typing does not send a request on every keystroke
    const [searchText, setSearchText] = useState(filters.search)

    function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onChange({ ...filters, search: searchText.trim() })
    }

    function handleStatusChange(value: string) {
        onChange({ ...filters, status: value as Status | '', search: searchText.trim() })
    }

    function handlePriorityChange(value: string) {
        onChange({ ...filters, priority: value as Priority | '', search: searchText.trim() })
    }

    function handleClear() {
        setSearchText('')
        onChange(EMPTY_FILTERS)
    }

    const hasActiveFilters =
        filters.status !== '' || filters.priority !== '' || filters.search !== '' || searchText !== ''

    return (
        <form className="filters" onSubmit={handleSearchSubmit}>
            <div className="filter-field filter-search">
                <label htmlFor="filter-search">Search by title</label>
                <input
                    id="filter-search"
                    type="search"
                    value={searchText}
                    placeholder="e.g. printer"
                    onChange={(event) => setSearchText(event.target.value)}
                />
            </div>

            <div className="filter-field">
                <label htmlFor="filter-status">Status</label>
                <select
                    id="filter-status"
                    value={filters.status}
                    onChange={(event) => handleStatusChange(event.target.value)}
                >
                    <option value="">All</option>
                    {STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-field">
                <label htmlFor="filter-priority">Priority</label>
                <select
                    id="filter-priority"
                    value={filters.priority}
                    onChange={(event) => handlePriorityChange(event.target.value)}
                >
                    <option value="">All</option>
                    {PRIORITIES.map((priority) => (
                        <option key={priority} value={priority}>
                            {PRIORITY_LABELS[priority]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-actions">
                <button type="submit" className="btn btn-primary">
                    Search
                </button>
                <button type="button" className="btn" onClick={handleClear} disabled={!hasActiveFilters}>
                    Clear
                </button>
            </div>
        </form>
    )
}

export default TicketFilters