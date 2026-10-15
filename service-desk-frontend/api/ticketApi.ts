import type { Ticket, TicketFilters, TicketInput, TicketSummary } from '../types/ticket'

const BASE_URL = '/api/tickets'

// An error that carries the HTTP status and any per-field messages from the backend
export class ApiError extends Error {
    status: number
    fieldErrors: Record<string, string>

    constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
        super(message)
        this.status = status
        this.fieldErrors = fieldErrors
    }
}

// One place that sends every request and turns failures into ApiError
async function request<T>(url: string, options?: RequestInit): Promise<T> {
    let response: Response

    try {
        response = await fetch(url, options)
    } catch {
        throw new ApiError('Cannot reach the server. Check your connection and that the backend is running.', 0)
    }

    if (!response.ok) {
        let message =
            response.status >= 500
                ? 'The server is unavailable or had an error. Please try again later.'
                : `Request failed (status ${response.status}).`
        let fieldErrors: Record<string, string> = {}

        try {
            const body = await response.json()
            if (body.message) message = body.message
            if (body.errors) fieldErrors = body.errors
        } catch {
            // The error response was not JSON, so we keep the default message
        }

        throw new ApiError(message, response.status, fieldErrors)
    }

    // DELETE returns 204 with no body
    if (response.status === 204) {
        return undefined as T
    }

    return response.json() as Promise<T>
}

export function getTickets(filters: TicketFilters): Promise<Ticket[]> {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.priority) params.set('priority', filters.priority)
    if (filters.search.trim()) params.set('search', filters.search.trim())

    const query = params.toString()
    return request<Ticket[]>(query ? `${BASE_URL}?${query}` : BASE_URL)
}

export function getTicket(id: number): Promise<Ticket> {
    return request<Ticket>(`${BASE_URL}/${id}`)
}

export function getSummary(): Promise<TicketSummary> {
    return request<TicketSummary>(`${BASE_URL}/summary`)
}

export function createTicket(input: TicketInput): Promise<Ticket> {
    return request<Ticket>(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    })
}

export function updateTicket(id: number, input: TicketInput): Promise<Ticket> {
    return request<Ticket>(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    })
}

export function deleteTicket(id: number): Promise<void> {
    return request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' })
}