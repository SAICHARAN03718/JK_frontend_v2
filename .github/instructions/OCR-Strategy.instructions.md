# OCR & Information Extraction Strategy

## 1. Overview & Context

This document outlines the technical strategy for implementing automated data extraction from logistics documents (Invoices, LRs, PODs) using open-source tools. The system is designed to handle diverse document layouts from different clients and branches while maintaining high accuracy and reliability.

**Core Constraint**: Build using open-source tools without relying on major cloud APIs (Google Cloud Vision, Azure, AWS Textract).

**Primary Goal**: Create a robust and scalable extraction engine to feed into the automated billing workflow defined in the main system documentation.

---

## 2. Strategic Approach: Two-Part Architecture

The solution separates the complex problem into two distinct, manageable components:

### **Part 1: Text Recognition (OCR Engine)**

- **Purpose**: Convert document images into machine-readable text with layout information
- **Technology**: EasyOCR or PaddleOCR (Python-based, open-source)
- **Output**: Structured text with coordinates and confidence scores

### **Part 2: Information Extraction (Template-Based)**

- **Purpose**: Analyze raw OCR text to extract meaningful key-value pairs
- **Approach**: Template-based extraction using pre-defined field coordinates
- **Methods**: Hybrid combination of coordinate, anchor, and regex-based extraction

---

## 3. Implementation Strategy

### **Phase 1: Pilot Implementation (Single Client Focus)**

**Rationale**: Before scaling to multiple clients, validate the approach with one client's documents to:

- Prove technical viability
- Identify edge cases and challenges
- Refine extraction accuracy
- Establish quality benchmarks
- Validate the template creation workflow

**Pilot Client Selection Criteria**:

- High document volume for meaningful testing
- Consistent document formats
- Willingness to provide sample documents
- Representative of typical use cases

### **Phase 2: OCR Engine Development (2-3 weeks)**

```python
# Core OCR Service Structure
{
  "document_id": "doc_123",
  "page_number": 1,
  "text_blocks": [
    {
      "text": "Invoice Number",
      "bbox": [x1, y1, x2, y2],
      "confidence": 0.95,
      "block_type": "text|table|line",
      "font_size": 12,
      "is_bold": false
    }
  ],
  "tables": [
    {
      "bbox": [x1, y1, x2, y2],
      "cells": [...]
    }
  ]
}
```

**Key Features**:

- Document preprocessing (deskew, contrast enhancement, DPI normalization)
- Separate table detection for tabular data
- Multi-page document handling
- Confidence scoring for quality control

### **Phase 3: Template Annotation Tool (2-3 weeks)**

**Purpose**: Visual tool for administrators to create extraction templates

**Workflow**:

1. Admin uploads sample document
2. System runs OCR and displays detected text boxes
3. Admin clicks on text boxes and labels them (e.g., "invoice_number", "vehicle_number")
4. System generates JSON template with coordinates and metadata
5. Template stored in database for that client/branch

**Template Structure**:

```json
{
  "template_id": "client_123_invoice_v1",
  "client_id": 123,
  "branch_id": 456,
  "document_type": "invoice",
  "fields": [
    {
      "field_key": "invoice_number",
      "field_name": "Invoice Number",
      "extraction_methods": [
        {
          "type": "coordinate",
          "bbox": [100, 200, 300, 250],
          "priority": 1
        },
        {
          "type": "anchor",
          "anchor_text": "Invoice No:",
          "search_direction": "right",
          "max_distance": 200,
          "priority": 2
        },
        {
          "type": "regex",
          "pattern": "INV-\\d{6}",
          "priority": 3
        }
      ],
      "validation": {
        "required": true,
        "data_type": "string",
        "max_length": 50
      }
    }
  ]
}
```

### **Phase 4: Extraction Engine**

**Three Extraction Methods** (in priority order):

1. **Coordinate-Based Extraction** (Primary)

   - Use pre-defined coordinates from template
   - Most reliable for consistent document layouts
   - Works when documents maintain same format
2. **Anchor-Based Extraction** (Fallback)

   - Find anchor text (e.g., "Vehicle No:")
   - Search for value in relative position
   - Handles slight layout variations
3. **Regular Expression Matching** (Validation)

   - Pattern matching for consistent formats (GSTINs, dates, vehicle numbers)
   - Additional validation layer
   - Backup when coordinate/anchor methods fail

**Quality Control Features**:

```python
def calculate_field_confidence(extraction_result):
    scores = []
    scores.append(extraction_result.ocr_confidence)
  
    if matches_expected_format(extraction_result.value):
        scores.append(0.9)
    else:
        scores.append(0.3)
  
    if similar_to_previous_extractions(extraction_result.value):
        scores.append(0.8)
  
    return weighted_average(scores)
```

### **Phase 5: Integration & Quality Control (1-2 weeks)**

**Integration Points**:

- Connect to existing `lorry_receipts` and `invoices` tables
- Populate `raw_ocr_data` JSONB field with extraction results
- Trigger human validation workflow for low-confidence extractions
- Update status workflow in existing system

**Quality Control Pipeline**:

- Automatic confidence scoring
- Template drift detection
- Human-in-the-loop validation for flagged documents
- Continuous accuracy monitoring

---

## 4. Database Schema Extensions

### **New Tables for OCR Strategy**

```sql
-- Document Templates Storage
CREATE TABLE public.document_templates (
    template_id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES public.clients(client_id),
    branch_id INTEGER REFERENCES public.client_branches(branch_id),
    document_type VARCHAR(50), -- 'invoice', 'pod', 'lr'
    template_name VARCHAR(255),
    template_data JSONB, -- Store the complete template structure
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    success_rate DECIMAL(5,2), -- Track template performance
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extraction Results Tracking
CREATE TABLE public.extraction_results (
    extraction_id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES public.invoices(invoice_id),
    template_id INTEGER REFERENCES public.document_templates(template_id),
    extracted_data JSONB, -- Raw extraction results
    confidence_scores JSONB, -- Field-level confidence scores
    needs_review BOOLEAN DEFAULT false,
    reviewed_by INTEGER, -- user_id when manually reviewed
    review_notes TEXT,
    processing_time_ms INTEGER, -- Performance tracking
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template Performance Monitoring
CREATE TABLE public.template_performance (
    performance_id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES public.document_templates(template_id),
    total_extractions INTEGER DEFAULT 0,
    successful_extractions INTEGER DEFAULT 0,
    avg_confidence_score DECIMAL(5,2),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

### **Indexes for Performance**

```sql
CREATE INDEX idx_document_templates_client_branch ON public.document_templates(client_id, branch_id, document_type);
CREATE INDEX idx_extraction_results_invoice ON public.extraction_results(invoice_id);
CREATE INDEX idx_extraction_results_needs_review ON public.extraction_results(needs_review);
CREATE INDEX idx_extraction_results_confidence ON public.extraction_results USING GIN (confidence_scores);
```

---

## 5. Risk Mitigation & Challenges

### **Technical Challenges**

1. **Document Quality Variations**

   - **Risk**: Scanned documents, different resolutions, rotated images
   - **Mitigation**: Robust preprocessing pipeline with deskewing and enhancement
2. **Template Maintenance**

   - **Risk**: Document formats change over time
   - **Mitigation**: Template versioning, drift detection, and easy template updates
3. **Multi-page Documents**

   - **Risk**: Complex document structures spanning multiple pages
   - **Mitigation**: Page-aware template design and multi-page extraction logic
4. **Performance at Scale**

   - **Risk**: OCR processing time for large volumes
   - **Mitigation**: Async processing, queue management, and processing optimization

### **Business Challenges**

1. **Accuracy Requirements**

   - **Target**: 95%+ accuracy for critical fields
   - **Mitigation**: Multiple extraction methods, validation rules, human review workflow
2. **Template Creation Overhead**

   - **Risk**: Time-consuming template setup for each client
   - **Mitigation**: User-friendly annotation tool, template reuse, and batch processing

---

## 6. Success Metrics & KPIs

### **Pilot Phase Metrics**

- **Extraction Accuracy**: Target 95%+ for critical fields
- **Processing Time**: < 30 seconds per document
- **Template Creation Time**: < 15 minutes per document type
- **Human Review Rate**: < 20% of documents

### **Production Metrics**

- **System Uptime**: 99.5%+
- **Processing Volume**: 1000+ documents/day capacity
- **Template Drift Detection**: Auto-alert when accuracy drops below 90%
- **End-to-end Processing Time**: Document upload to validated data < 5 minutes

---

## 7. Future Enhancements

### **Machine Learning Integration** (Phase 6+)

- Train custom models after collecting sufficient data
- Improve extraction accuracy through ML
- Automatic template generation suggestions

### **Advanced Features**

- Real-time processing with WebSocket updates
- Batch processing for large document uploads
- Mobile app integration for field document capture
- API integration with client systems

---

## 8. Integration with Existing System

This OCR strategy seamlessly integrates with the existing system architecture:

1. **Workflow Integration**: Fits into Step 3 (Extraction & Consolidation) of the existing workflow
2. **Database Integration**: Uses existing `raw_ocr_data` JSONB field in `invoices` table
3. **Status Management**: Leverages existing status-driven workflow
4. **UI Integration**: Validation interface builds on existing dashboard structure

The pilot approach ensures minimal disruption to existing operations while validating the technical approach before full-scale implementation.

---

*This document should be reviewed and updated as the pilot implementation progresses and learnings are incorporated.*
