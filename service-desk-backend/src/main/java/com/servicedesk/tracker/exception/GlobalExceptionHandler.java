package com.servicedesk.tracker.exception;

import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Ticket id does not exist -> 404
    @ExceptionHandler(TicketNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(TicketNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    // @Valid failed on the request body -> 400 with one message per field
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return build(HttpStatus.BAD_REQUEST, "Validation failed", errors);
    }

    // Malformed JSON, or an invalid enum value such as "priority": "URGENT" -> 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadableBody(HttpMessageNotReadableException ex) {
        return build(HttpStatus.BAD_REQUEST,
                "Request body is missing or invalid. Check the JSON format and that category, priority, and status use allowed values.",
                null);
    }

    // Bad URL value, such as ?status=FOO or /api/tickets/abc -> 400
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = "Invalid value '" + ex.getValue() + "' for parameter '" + ex.getName() + "'";
        return build(HttpStatus.BAD_REQUEST, message, null);
    }

    // Database is down or unreachable -> 503
    @ExceptionHandler({DataAccessResourceFailureException.class, CannotCreateTransactionException.class})
    public ResponseEntity<Map<String, Object>> handleDatabaseUnavailable(Exception ex) {
        return build(HttpStatus.SERVICE_UNAVAILABLE,
                "The database is currently unavailable. Please try again later.", null);
    }

    private ResponseEntity<Map<String, Object>> build(HttpStatus status, String message, Map<String, String> errors) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status.value());
        body.put("message", message);
        if (errors != null) {
            body.put("errors", errors);
        }
        return ResponseEntity.status(status).body(body);
    }
}