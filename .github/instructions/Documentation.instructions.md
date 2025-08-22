# System Documentation: Logistics & Billing Automation

## 1. Executive Summary & Core Purpose

This document outlines the complete architecture and workflow for a sophisticated Logistics Management System. The primary goal of this system is to **automate the tedious process of manual data entry from diverse client logistics documents** and generate accurate, consolidated bulk bills.

The core problem this system solves is the high variability and complexity of source documents (Invoices, Lorry Receipts, PODs) from different clients and their branches. The system is designed to be  **flexible, scalable, and resilient** **, moving from a manual process to a streamlined, "human-in-the-loop" validation workflow.**

**The final expected outcome** is a system where a user can upload a multi-page PDF containing various logistics documents and, after a quick validation step, generate a consolidated, client-specific Excel bill, with all source documents and final bills securely archived.

## 1.1. Implementation Strategy: Pilot-First Approach

**IMPORTANT**: The system will be implemented using a **pilot-first strategy** with a single client to validate the technical approach, refine extraction accuracy, and establish quality benchmarks before scaling to multiple clients. This approach ensures:

- Proven technical viability with real-world documents
- Identification and resolution of edge cases
- Refined OCR and extraction accuracy metrics
- Validated template creation workflow
- Established quality control processes

For detailed OCR and extraction strategy, see: `OCR-Strategy.instructions.md`

## 2. System Architecture & Design Philosophy

**The system is built on a robust PostgreSQL database (designed for Supabase) and a separate OCR engine. The architecture is guided by three key principles:**

* **Hybrid Data Modelling:** We use a relational core for structured data (clients, trips) and flexible `<span class="selected">JSONB</span>` columns for client-specific, semi-structured data. This allows the system to adapt to new document layouts without requiring disruptive database changes.
* **Status-Driven Workflow:** The lifecycle of a shipment is managed by a `<span class="selected">status</span>` field (`<span class="selected">Pending_Validation</span>`, `<span class="selected">Validated</span>`, `<span class="selected">Billed</span>`). This avoids fragile staging tables, ensures no work is ever lost, and provides a clear, auditable trail for every trip.
* **Template Inheritance:** To handle clients with multiple branches, the system uses a hierarchical template model. Common fields are defined at the parent client level, and specific branches can add or override these fields, minimising data duplication and simplifying management.

## 3. The End-to-End Application & Data Flow

**This section describes the complete journey of data through the system, from a raw PDF to a final, archived bill.**

### Step 1: Onboarding & Template Setup

**The process begins by configuring the system for a new client.**

1. **Client & Branch Registration:** An administrator registers the parent company in the `<span class="selected">clients</span>` table and each of its operational locations in the `<span class="selected">client_branches</span>` table.
2. **Template Creation (The "Rulebook"):** This is the most critical setup step. Using an internal  **Template Annotation Tool** **, the administrator defines the data extraction rules for the client.**
   * **They upload a sample document (e.g., a Varun Beverages invoice).**
   * **The tool runs OCR to identify all text and draws boxes around it.**
   * **The admin clicks on the required fields (e.g., the box around "TN41M0558") and labels them with a key (e.g., **`<span class="selected">vehicle_number</span>`).
   * **This process populates the **`<span class="selected">client_field_templates</span>` table, storing the field's name, key, and its exact **coordinates** on the document. This is done for the client's base template and any branch-specific fields.

### Step 2: Document Ingestion & OCR

**This is the start of the daily operational workflow.**

1. **PDF Upload:** A user uploads a single PDF containing all documents for a trip (e.g., one LR, multiple invoices, multiple PODs).
2. **Record Creation:** The system immediately creates a new record in the `<span class="selected">lorry_receipts</span>` table, linking it to the correct client and branch, and setting its `<span class="selected">status</span>` to `<span class="selected">'Pending_Validation'</span>`. The PDF is saved to a `<span class="selected">source_documents</span>` bucket in cloud storage.
3. **Extraction & Consolidation:**
   * **The system's OCR engine (using open-source tools like EasyOCR/PaddleOCR) reads the client's template from the **`<span class="selected">document_templates</span>` and `<span class="selected">client_field_templates</span>` tables.
   * **It processes the PDF using a hybrid extraction approach: coordinate-based (primary), anchor-based (fallback), and regex-based (validation).**
   * **For each Invoice-POD pair identified, it creates a new row in the **`<span class="selected">invoices</span>` table.
   * **All extracted raw data, confidence scores, and extraction method details are saved into the **`<span class="selected">raw_ocr_data</span>` JSONB column, carefully noting any **conflicts** (e.g., if the vehicle number on the invoice differs from the POD).
   * **Documents requiring human review (low confidence scores) are automatically flagged in the workflow.**

### Step 3: Human Validation

**This is the core "human-in-the-loop" task.**

1. **UI Presentation:** The user sees a queue of trips with the status `<span class="selected">'Pending_Validation'</span>`. They select one to work on.
2. **Conflict Resolution:** The validation screen displays the original document alongside the extracted data. Any fields with **conflicts** are clearly flagged, forcing the user to choose the correct value.
3. **Correction & Approval:** The user corrects any OCR errors and resolves all conflicts. When they save, the clean, verified data is saved into the `<span class="selected">custom_data</span>` JSONB column.
4. **Status Update:** Once all invoices for a trip are validated, the parent `<span class="selected">lorry_receipts</span>` record's `<span class="selected">status</span>` is automatically updated to `<span class="selected">'Validated'</span>`.

### Step 4: Bulk Billing & Archiving

**This is the final step that achieves the primary business goal.**

1. **Bill Creation:** A user selects a client, a date range, and chooses multiple `<span class="selected">'Validated'</span>` trips.
2. **Database Updates:** The system creates a new record in the `<span class="selected">bulk_bills</span>` table. It then updates all the included `<span class="selected">lorry_receipts</span>` records, changing their `<span class="selected">status</span>` to `<span class="selected">'Billed'</span>` and linking them to the new `<span class="selected">bulk_bill_id</span>`. This prevents double-billing.
3. **File Generation & Archiving:**
   * **The system uses the **`<span class="selected">client_field_templates</span>` again to dynamically build a client-specific Excel file.
   * **This **`<span class="selected">.xlsx</span>` file is uploaded to a `<span class="selected">generated_bills</span>` bucket in cloud storage.
   * **A final record is created in the **`<span class="selected">generated_bill_files</span>` table, storing the path to this archived file, creating a permanent, auditable record of the bill that was sent.

**This entire flow is designed to be robust, auditable, and highly automated, transforming a complex manual task into a simple validation process.**

---

## 4. Technical Implementation References

For detailed implementation strategies and technical specifications, refer to these companion documents:

- **`Database.instructions.md`**: Complete PostgreSQL schema with tables, relationships, constraints, and indexes
- **`OCR-Strategy.instructions.md`**: Comprehensive OCR and information extraction strategy using open-source tools, including pilot implementation approach, template annotation workflow, and quality control mechanisms

The pilot-first approach outlined in the OCR strategy ensures successful validation of the technical approach before scaling to multiple clients, minimizing risk and maximizing learning opportunities.
