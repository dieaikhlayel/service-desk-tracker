import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError, createTicket, getTicket, updateTicket } from '../api/ticketApi'
import ErrorMessage from '../components/ErrorMessage'
import LoadingMessage from '../components/LoadingMessage'
import TicketForm, { type TicketFormValues } from '../components/TicketForm'
import type { TicketInput } from '../types/ticket'

const EMPTY_VALUES: TicketFormValues = {
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
    status: 'OPEN',
}

function TicketFormPage() {
    // On /tickets/new there is no id. On /tickets/:id/edit there is.
    const { id } = useParams()
    const navigate = useNavigate()

    const ticketId = id === undefined ? null : Number(id)
    const invalidId = ticketId !== null && !Number.isInteger(ticketId)
    const needsLoad = ticketId !== null && !invalidId

    const [initialValues, setInitialValues] = useState<TicketFormValues>(EMPTY_VALUES)
    const [loading, setLoading] = useState(needsLoad)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    // When editing, load the existing ticket so the form starts with its values
    useEffect(() => {
        if (ticketId === null || !needsLoad) return

        let cancelled = false

        async function load(currentId: number) {
            try {
                const ticket = await getTicket(currentId)
                if (cancelled) return
                setInitialValues({
                    title: ticket.title,
                    description: ticket.description,
                    category: ticket.category,
                    priority: ticket.priority,
                    status: ticket.status,
                })
            } catch (err) {
                if (cancelled) return
                setLoadError(err instanceof ApiError ? err.message : 'Could not load the ticket.')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load(ticketId)

        return () => {
            cancelled = true
        }
    }, [ticketId, needsLoad])

    async function handleSubmit(input: TicketInput) {
        setSubmitting(true)
        setFormError(null)
        setFieldErrors({})

        try {
            const saved = ticketId !== null ? await updateTicket(ticketId, input) : await createTicket(input)
            navigate(`/tickets/${saved.id}`)
        } catch (err) {
            if (err instanceof ApiError) {
                setFieldErrors(err.fieldErrors)
                setFormError(
                    Object.keys(err.fieldErrors).length > 0 ? 'Please fix the highlighted fields.' : err.message,
                )
            } else {
                setFormError('Something went wrong. Please try again.')
            }
            setSubmitting(false)
        }
    }

    if (invalidId) {
        return <ErrorMessage message="That is not a valid ticket id." />
    }

    if (loading) {
        return <LoadingMessage message="Loading ticket..." />
    }

    if (loadError) {
        return (
            <div>
                <ErrorMessage message={loadError} />
                <Link to="/" className="btn">
                    Back to tickets
                </Link>
            </div>
        )
    }

    return (
        <div>
            <div className="page-header">
                <h2>{ticketId !== null ? 'Edit ticket' : 'New ticket'}</h2>
            </div>

            <TicketForm
                initialValues={initialValues}
                submitLabel={ticketId !== null ? 'Save changes' : 'Create ticket'}
                submitting={submitting}
                serverErrors={fieldErrors}
                formError={formError}
                cancelTo={ticketId !== null ? `/tickets/${ticketId}` : '/'}
                onSubmit={handleSubmit}
            />
        </div>
    )
}

export default TicketFormPage