-- Sample tickets for development and screenshots.
-- Run once after the table exists. Running it again adds duplicates.
USE servicedesk_db;

INSERT INTO tickets (title, description, category, priority, status, created_at) VALUES
('Printer not working', 'Floor 2 printer shows offline.', 'HARDWARE', 'MEDIUM', 'OPEN', '2026-10-01 09:15:00'),
('Cannot log in to email', 'Password reset link is not arriving.', 'ACCOUNT_ACCESS', 'HIGH', 'IN_PROGRESS', '2026-10-02 10:30:00'),
('Wi-Fi drops in meeting room', 'Connection drops every 10 minutes in Room B.', 'NETWORK', 'HIGH', 'OPEN', '2026-10-03 14:00:00'),
('Install design software', 'New hire needs the design suite installed.', 'SOFTWARE', 'LOW', 'RESOLVED', '2026-10-04 08:45:00'),
('Monitor flickering', 'Second monitor flickers when the laptop wakes up.', 'HARDWARE', 'LOW', 'IN_PROGRESS', '2026-10-05 11:20:00'),
('VPN connection fails', 'VPN client shows timeout error from home.', 'NETWORK', 'MEDIUM', 'RESOLVED', '2026-10-06 16:10:00'),
('Request shared folder access', 'Need read access to the Finance shared folder.', 'ACCOUNT_ACCESS', 'MEDIUM', 'OPEN', '2026-10-07 09:00:00'),
('Spreadsheet app crashes', 'The app closes when opening large files.', 'SOFTWARE', 'HIGH', 'OPEN', '2026-10-08 13:35:00');