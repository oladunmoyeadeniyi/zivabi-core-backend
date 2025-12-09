# Expense Module (Backend) – Current Scope

This directory contains the backend implementation of the Expense Management
module for Ziva BI. At this stage, the module provides:

- Creation of draft expense requests.
- Addition of expense lines to a request.
- Submission of requests (starts a basic workflow instance).
- Upload & linking of receipt documents to individual lines.
- Basic AI stub integration for OCR confidence and duplicate hints.
- Audit logging for all key events (request created, line added, submitted, receipt attached).

This is still an early implementation; more advanced behaviours from the
full PRD (travel advance retirement logic, Finance review console, duplicate
detection, AI categorisation, etc.) will be layered on top of this
foundation in subsequent iterations.
