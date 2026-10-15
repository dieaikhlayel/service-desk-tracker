package com.servicedesk.tracker.repository;

import com.servicedesk.tracker.model.Priority;
import com.servicedesk.tracker.model.Status;
import com.servicedesk.tracker.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Any of the three parameters can be null, which means "don't filter on this"
    @Query("""
            SELECT t FROM Ticket t
            WHERE (:status IS NULL OR t.status = :status)
              AND (:priority IS NULL OR t.priority = :priority)
              AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY t.createdAt DESC
            """)
    List<Ticket> findWithFilters(@Param("status") Status status,
                                 @Param("priority") Priority priority,
                                 @Param("search") String search);

    // Spring builds this query from the method name alone
    long countByStatus(Status status);
}