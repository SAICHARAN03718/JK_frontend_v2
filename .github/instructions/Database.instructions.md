# Database Documentation: Logistics & Billing System

## 1. Introduction & Purpose

This document provides a comprehensive overview of the PostgreSQL database schema for the Logistics & Billing application. It is intended for developers, database administrators, and technical agents responsible for the system's implementation and maintenance. The database is designed for deployment on Supabase, leveraging its PostgreSQL and Storage capabilities.

The primary purpose of this system is to ingest, digitize, and validate logistics documents (LRs, Invoices, PODs) and automate the creation of complex, client-specific bulk bills.

---

## 2. Core Design Principles

The architecture is built on three fundamental principles:

* **Hybrid Data Modeling:** The schema uses a relational core for structured data (like clients and trips) and flexible `JSONB` columns for semi-structured, client-specific data. This allows the system to adapt to new client requirements without needing database migrations.
* **Status-Driven Workflow:** The lifecycle of a shipment is managed by a `status` field within a permanent record (`lorry_receipts` table). This avoids the need for temporary staging tables and ensures that no work-in-progress is ever lost, providing a complete and auditable trail.
* **Template Inheritance:** To handle clients with multiple branches, the system uses a hierarchical template model. Common fields are defined at the parent client level, and specific branches can add or override these fields, minimizing data duplication and simplifying template management.

---

## 3. Entity-Relationship Diagram (ERD)

The following diagram illustrates the high-level relationships between the tables in the database.

**Code snippet**

```
erDiagram
    Clients ||--o{ ClientBranches : "has"
    Clients ||--o{ ClientFieldTemplates : "defines base template for"
    Clients ||--o{ BulkBills : "is billed"
    ClientBranches ||--o{ LorryReceipts : "is origin/destination for"
    ClientBranches ||--o{ ClientFieldTemplates : "defines specific template for"
    LorryReceipts ||--o{ Invoices : "contains"
    BulkBills ||--o{ LorryReceipts : "includes"
    BulkBills ||--o{ GeneratedBillFiles : "archives"
```

---

## 4. Detailed Table Schema

### 4.1. `clients`

Stores the master list of parent client companies.

| Column Name     | Data Type        | Constraints           | Description                                           |
| --------------- | ---------------- | --------------------- | ----------------------------------------------------- |
| `client_id`   | `SERIAL`       | **PRIMARY KEY** | Unique, auto-incrementing ID for the client.          |
| `client_name` | `VARCHAR(255)` | `NOT NULL`          | The name of the client company.                       |
| `address`     | `TEXT`         |                       | The client's primary headquarters or billing address. |
| `gstin`       | `VARCHAR(15)`  | `UNIQUE`, `CHECK (gstin ~ '^[0-9A-Z]{15}$')` | The client's main GST Identification Number.          |
| `created_at`  | `TIMESTAMPTZ`  | `DEFAULT NOW()`     | Timestamp of when the client was registered.          |

### 4.2. `client_branches`

Stores the details for each unique branch, plant, or location of a client.

| Column Name        | Data Type        | Constraints                                                | Description                                                     |
| ------------------ | ---------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| `branch_id`      | `SERIAL`       | **PRIMARY KEY**                                      | Unique, auto-incrementing ID for the branch.                    |
| `client_id`      | `INTEGER`      | `NOT NULL`,**FOREIGN KEY**->`clients(client_id)` | Links the branch to its parent company.                         |
| `branch_name`    | `VARCHAR(255)` | `NOT NULL`                                               | The user-friendly name of the branch (e.g., "Bangalore Plant"). |
| `branch_address` | `TEXT`         |                                                            | The specific address of the branch.                             |
| `branch_gstin`   | `VARCHAR(15)`  | `UNIQUE`                                                 | The branch's specific GSTIN, if applicable.                     |

### 4.3. `client_field_templates`

The "Rulebook" for the application. It defines the required data fields for each client using an inheritance model.

| Column Name         | Data Type        | Constraints                                                | Description                                                                                                   |
| ------------------- | ---------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `field_id`        | `SERIAL`       | **PRIMARY KEY**                                      | Unique ID for the field definition.                                                                           |
| `client_id`       | `INTEGER`      | `NOT NULL`,**FOREIGN KEY**->`clients(client_id)` | Links the rule to a parent client.                                                                            |
| `branch_id`       | `INTEGER`      | **FOREIGN KEY**->`client_branches(branch_id)`      | If `NULL`, this field is a "base" rule for all branches. If set, it's a specific rule for that branch only. |
| `field_name`      | `VARCHAR(100)` | `NOT NULL`                                               | The user-friendly name for the field (e.g., "E-Way Bill").                                                    |
| `field_key`       | `VARCHAR(50)`  | `NOT NULL`                                               | The key used in the JSON data object (e.g., "e_way_bill_no").                                                 |
| `display_order`   | `INTEGER`      | `CHECK (display_order >= 0)`                               | The order to display fields on the UI and final bill.                                                         |
| `pod_requirement` | `VARCHAR(20)`  | `DEFAULT 'NOT_APPLICABLE'`, `CHECK (pod_requirement IN ('MANDATORY','NOT_APPLICABLE'))` | Rule for PODs. |

### 4.4. `lorry_receipts`

The central "Trip Header" table. Each row represents a single trip, acting as a container for its deliveries.

| Column Name        | Data Type        | Constraints                                                        | Description                                                      |
| ------------------ | ---------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `lr_id`          | `SERIAL`       | **PRIMARY KEY**                                              | Unique, internal ID for the trip.                                |
| `client_id`      | `INTEGER`      | `NOT NULL`,**FOREIGN KEY**->`clients(client_id)`         | The parent client for this trip.                                 |
| `branch_id`      | `INTEGER`      | **FOREIGN KEY** via composite `(client_id, branch_id)` -> `client_branches(client_id, branch_id)` | The specific client branch this trip is for.                     |
| `lr_number`      | `VARCHAR(100)` | `NOT NULL`                                                       | The LR number, usually from the document or filename.            |
| `trip_date`      | `DATE`         | `NOT NULL`                                                       | The primary date of the trip, used for billing filters.          |
| `vehicle_number` | `VARCHAR(20)`  |                                                                    | The truck's registration number.                                 |
| `status`         | `VARCHAR(20)`  | `NOT NULL`,`DEFAULT 'Pending_Validation'`, `CHECK (status IN ('Pending_Validation','Validated','Billed'))` | Workflow status. |
| `bulk_bill_id`   | `INTEGER`      | **FOREIGN KEY**->`bulk_bills(bulk_bill_id)`                | `NULL`until the trip is included in a bulk bill.               |
| `created_at`     | `TIMESTAMPTZ`  | `DEFAULT NOW()`                                                  |                                                                  |
| `updated_at`     | `TIMESTAMPTZ`  | `DEFAULT NOW()`                                                  |                                                                  |

### 4.5. `invoices`

The "Delivery Details" table. Each row represents a single Invoice-POD pair and holds the flexible, consolidated data.

| Column Name          | Data Type        | Constraints                                                   | Description                                                                                              |
| -------------------- | ---------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `invoice_id`       | `SERIAL`       | **PRIMARY KEY**                                         | Unique ID for the delivery record.                                                                       |
| `lr_id`            | `INTEGER`      | `NOT NULL`,**FOREIGN KEY**->`lorry_receipts(lr_id)` | Links this delivery record back to its parent trip.                                                      |
| `invoice_number`   | `VARCHAR(100)` | `NOT NULL`                                                  | The primary identifier for this delivery document.                                                       |
| `raw_ocr_data`     | `JSONB`        |                                                               | Stores raw OCR output from both invoice and POD, including confidence scores and any detected conflicts. |
| `custom_data`      | `JSONB`        |                                                               | Stores the final, user-validated clean data as a JSON object, based on the client's template.            |
| `invoice_page_ref` | `VARCHAR(255)` |                                                               | Reference/path to the specific invoice page/image in storage.                                            |
| `pod_page_ref`     | `VARCHAR(255)` |                                                               | Reference/path to the specific POD page/image in storage.                                                |
| `created_at`       | `TIMESTAMPTZ`  | `DEFAULT NOW()`                                                | Creation timestamp.                                                |
| `updated_at`       | `TIMESTAMPTZ`  | `DEFAULT NOW()`                                                | Auto-updated on row changes.                                       |

### 4.6. `bulk_bills`

Stores a record for each final, consolidated bill generated by the system.

| Column Name              | Data Type          | Constraints                                                | Description                             |
| ------------------------ | ------------------ | ---------------------------------------------------------- | --------------------------------------- |
| `bulk_bill_id`         | `SERIAL`         | **PRIMARY KEY**                                      | Unique ID for the generated bill.       |
| `bill_number`          | `VARCHAR(50)`    | `UNIQUE`,`NOT NULL`                                    | The official, user-facing bill number.  |
| `bill_date`            | `DATE`           | `NOT NULL`                                               | The date the bill was generated.        |
| `client_id`            | `INTEGER`        | `NOT NULL`,**FOREIGN KEY**->`clients(client_id)` | Links the bill to the client.           |
| `total_freight_amount` | `DECIMAL(12, 2)` |                                                            | The subtotal of all trips on this bill. |
| `igst_amount`          | `DECIMAL(12, 2)` |                                                            | The calculated tax amount.              |
| `final_bill_amount`    | `DECIMAL(12, 2)` |                                                            | The grand total amount to be paid.      |
| `created_at`           | `TIMESTAMPTZ`    | `DEFAULT NOW()`                                          |                                         |
| `updated_at`           | `TIMESTAMPTZ`    | `DEFAULT NOW()`                                          | Auto-updated on row changes.            |

### 4.7. `generated_bill_files`

An archive of every Excel bill file generated by the system.

| Column Name      | Data Type       | Constraints                                                      | Description                                                 |
| ---------------- | --------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `file_id`      | `SERIAL`      | **PRIMARY KEY**                                            | Unique ID for the archived file record.                     |
| `bulk_bill_id` | `INTEGER`     | `NOT NULL`,**FOREIGN KEY**->`bulk_bills(bulk_bill_id)` | Links this file directly to the bill data it represents.    |
| `file_path`    | `TEXT`        | `NOT NULL`                                                     | The unique path or URL to the file in Supabase Storage.     |
| `file_size_kb` | `INTEGER`     |                                                                  | The size of the generated file in kilobytes.                |
| `generated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()`                                                | The exact timestamp when the file was created and archived. |

---

## 5. Workflow & Data Flow

1. **Onboarding:** An admin populates `clients`, `client_branches`, and `client_field_templates`. These tables are now the definitive "Rulebook" for all future operations for that client.
2. **Upload:** A user uploads a raw PDF. The file is saved to the `source_documents` storage bucket. A new row is created in `lorry_receipts` with a specific `branch_id` and `status = 'Pending_Validation'`.
3. **Extraction:** The system's back-end reads the template for that `branch_id` (by combining base and specific rules). It processes the PDF, creates linked rows in the `invoices` table, and populates the `raw_ocr_data` for each, noting any conflicts.
4. **Validation:** The front-end reads the `lorry_receipts` and its child `invoices` records. It uses the `raw_ocr_data` to pre-fill a form and highlight conflicts. The user corrects and saves the data, which populates the `custom_data` field. Once all invoices for a trip are done, the `lorry_receipts.status` is updated to `'Validated'`.
5. **Billing:** The billing module fetches all `lorry_receipts` where `status = 'Validated'`. When a bill is created, a row is inserted into `bulk_bills`, and the `status` and `bulk_bill_id` are updated on all included `lorry_receipts` records.
6. **Archiving:** The final Excel bill is generated, uploaded to the `generated_bills` storage bucket, and a corresponding record is created in `generated_bill_files`.

---

## 6. Supabase Environment

* **Database:** Use the provided SQL script in the Supabase SQL Editor to set up the schema.
* **Storage:** Two private buckets must be created:

  1. `source_documents`: For the initial, raw PDF uploads.
  2. `generated_bills`: For the final, archived Excel files.

  ---

  ## 7. Indexes, Uniques, and Triggers (Implementation Notes)

  - `lorry_receipts`:
    - Indexes: `(client_id)`, `(branch_id)`, `(status)`, `(status, client_id, trip_date)`, `(lr_number)`
    - Unique: `(client_id, lr_number)` to prevent duplicate LR per client
    - Status check constraint ensures only `Pending_Validation`, `Validated`, `Billed`
    - Composite FK `(client_id, branch_id)` → `client_branches(client_id, branch_id)`
  - `invoices`:
    - Indexes: `(lr_id)`, `(invoice_number)`, GIN on `raw_ocr_data`, GIN on `custom_data`
    - Unique: `(lr_id, invoice_number)`
    - Timestamps: `created_at`, `updated_at`
  - `bulk_bills`:
    - Timestamps: `created_at`, `updated_at`
  - `generated_bill_files`:
    - Unique: `file_path`
  - Triggers:
    - `set_updated_at()` keeps `updated_at` fresh on `lorry_receipts`, `invoices`, and `bulk_bills`.
