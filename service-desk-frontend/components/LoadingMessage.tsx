interface LoadingMessageProps {
    message?: string
}

function LoadingMessage({ message = 'Loading...' }: LoadingMessageProps) {
    return (
        <p className="loading-message" role="status">
            {message}
        </p>
    )
}

export default LoadingMessage