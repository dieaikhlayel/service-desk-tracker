package com.servicedesk.tracker.dto;

public record TicketSummary(long total, long open, long inProgress, long resolved) {
}