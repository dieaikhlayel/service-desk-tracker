interface ErrorMessageProps {
    message: string
    onRetry?: () => void
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <div className="error-message" role="alert">
            <p>{message}</p>
            {onRetry && (
                <button type="button" className="btn" onClick={onRetry}>
                    Try again
                </button>
            )}
        </div>
    )
}

export default ErrorMessage