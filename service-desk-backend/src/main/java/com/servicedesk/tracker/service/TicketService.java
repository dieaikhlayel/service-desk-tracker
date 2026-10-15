package com.servicedesk.tracker.service;

import com.servicedesk.tracker.dto.TicketRequest;
import com.servicedesk.tracker.dto.TicketSummary;
import com.servicedesk.tracker.exception.TicketNotFoundException;
import com.servicedesk.tracker.model.Priority;
import com.servicedesk.tracker.model.Status;
import com.servicedesk.tracker.model.Ticket;
import com.servicedesk.tracker.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<Ticket> getTickets(Status status, Priority priority, String search) {
        // Treat blank search text the same as "no search"
        String cleanedSearch = (search == null || search.isBlank()) ? null : search.trim();
        return ticketRepository.findWithFilters(status, priority, cleanedSearch);
    }

    public Ticket getTicket(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    public Ticket createTicket(TicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.title().trim());
        ticket.setDescription(request.description().trim());
        ticket.setCategory(request.category());
        ticket.setPriority(request.priority());
        ticket.setStatus(request.status() != null ? request.status() : Status.OPEN);
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicket(Long id, TicketRequest request) {
        Ticket ticket = getTicket(id);
        ticket.setTitle(request.title().trim());
        ticket.setDescription(request.description().trim());
        ticket.setCategory(request.category());
        ticket.setPriority(request.priority());
        if (request.status() != null) {
            ticket.setStatus(request.status());
        }
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new TicketNotFoundException(id);
        }
        ticketRepository.deleteById(id);
    }

    public TicketSummary getSummary() {
        return new TicketSummary(
                ticketRepository.count(),
                ticketRepository.countByStatus(Status.OPEN),
                ticketRepository.countByStatus(Status.IN_PROGRESS),
                ticketRepository.countByStatus(Status.RESOLVED)
        );
    }
}