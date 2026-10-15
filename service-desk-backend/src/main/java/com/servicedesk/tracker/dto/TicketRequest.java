package com.servicedesk.tracker.dto;

import com.servicedesk.tracker.model.Category;
import com.servicedesk.tracker.model.Priority;
import com.servicedesk.tracker.model.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketRequest(

        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,

        @NotBlank(message = "Description is required")
        @Size(max = 2000, message = "Description must be at most 2000 characters")
        String description,

        @NotNull(message = "Category is required")
        Category category,

        @NotNull(message = "Priority is required")
        Priority priority,

        // Optional: if omitted, a new ticket defaults to OPEN
        Status status
) {
}