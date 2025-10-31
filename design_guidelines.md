# Digital Forensics Platform - Design Guidelines (Compacted)

## Design System: IBM Carbon

**Rationale:** Enterprise-grade, data-heavy applications requiring professional authority and consistency across 36 investigative modules.

**Principles:** Clarity over decoration | Workflow efficiency | Information density | Professional trust

---

## Typography

**Font Family:** IBM Plex Sans (UI), IBM Plex Mono (technical data)

**Hierarchy:**
- Page Titles: `text-3xl font-semibold` (36px)
- Section Headers: `text-2xl font-semibold` (24px)
- Card Titles: `text-lg font-medium` (18px)
- Body: `text-base leading-relaxed` (16px)
- Labels: `text-sm font-medium` (14px)
- Captions: `text-xs` (12px)
- Technical Data: `text-sm font-mono` (14px) - hashes, IPs, identifiers

---

## Layout & Spacing

**Spacing Scale:** `2, 4, 6, 8, 12, 16` (Tailwind units)
- Compact: `p-2 gap-2` - tables, toolbars
- Standard: `p-4 gap-4` - cards, forms
- Sections: `p-6 gap-6` - panels
- Large: `p-8 gap-8` - page margins
- XL: `p-12 gap-12` - dashboard columns
- XXL: `p-16 gap-16` - page-level rhythm

**Grids:**
- Dashboard: `grid-cols-12` (sidebar + content)
- Module Cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Split Views: 2-column comparison layouts
- Tables: Full-width with `overflow-x-auto`

**Containers:**
- Sidebar: `w-64` (collapses to `w-16` icon-only)
- Forms: `max-w-2xl`
- Tables: `max-w-full`

---

## Navigation

**Sidebar (Left, Fixed):**
- 8 collapsible categories organizing 36 modules:
  1. AI & Media (5): Deepfake, Image, Video, Audio, Steganography
  2. Network & Comm (6): Network, Email, CDR/IPDR, Dark Web, Traffic, Browser
  3. Device & Hardware (5): Mobile, Disk, Drone, Vehicle, GPS
  4. Financial (4): Banking Fraud, AML/CTF, Financial/Corporate Audit
  5. Social & OSINT (4): Social Media, OSINT, Face Recognition, Document Forgery
  6. Security (4): Malware, Sandbox, Password Recovery, Quantum Crypto
  7. Legal (4): Case Mgmt, E-Discovery, CSAM Controls, Audit Panel
  8. Data & Cloud (4): Big Data, Cloud Evidence, Blockchain, Full Disk
- Active module indicator | User profile at bottom | `h-16` header

**Top Bar (`h-16`):**
- Breadcrumbs | Global search (`min-w-96`) | Notifications | Active case | Quick actions | User avatar/role

**Quick Access (`h-12`):**
- Horizontal scrollable pinned favorites below top bar

---

## Core Components

### Dashboard KPI Cards
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div class="p-6 rounded-lg shadow">
    <div class="text-3xl font-bold">[Metric]</div>
    <div class="text-sm text-muted">[Label]</div>
    <div class="text-xs">[Trend: +12%]</div>
  </div>
</div>
```

### Case List Table
- Sticky header, sortable columns
- `h-14` rows, zebra striping
- Columns: ID | Title | Status Badge | Priority | Assigned | Date | Actions (⋮)
- Hover state on full row

### Evidence Timeline
- Vertical timeline with connection lines
- `p-4 rounded-lg` cards per entry
- Left: timestamp (`text-sm text-muted`) | Icon | Details | Chain-of-custody badge | Hash verification

### Forms
```html
<form class="space-y-4 max-w-2xl">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="text-sm font-medium mb-2">[Label]</label>
      <input class="h-10 border rounded-md w-full" />
      <p class="text-xs text-muted">[Helper text]</p>
    </div>
  </div>
</form>
```

**File Upload:** `min-h-48 border-2 border-dashed` | Centered icon (`size-12`) | Instruction text | File restrictions

### Data Tables
- Sticky header with sort indicators
- Fixed-width for IDs/dates
- Expandable rows, inline edit
- Bulk select checkboxes
- Pagination bottom-right (10/25/50/100)

### Modals
**Evidence Detail:** `max-w-4xl max-h-screen overflow-y-auto` | Header with close | Tabbed interface | Right-aligned footer actions

**Confirmation:** `max-w-md` centered | Icon | Clear primary action | Cancel button | Backdrop dismiss

**Toasts:** Top-right | Auto-dismiss 5s | Progress bar | Icon + message + close | `max-w-sm`

---

## Specialized Forensics Components

**Hash Verification:**
```html
<div class="font-mono text-sm">
  <div>Expected: [hash]</div>
  <div>Actual: [hash]</div>
  <span class="text-green-600">✓ Match</span>
  <button>Copy</button>
</div>
```

**Chain-of-Custody Log:** Vertical timeline | Entry: timestamp, user, action, IP | Digital signature badge | Tamper-proof indicator

**Image Comparison:** Before/After slider with draggable divider | Zoom controls | EXIF metadata panel | Tampering heatmap toggle

**Audit Trail:** Filterable table | Expandable rows | Geolocation flags | Status indicators | CSV export

---

## Charts & Visualizations

**Container Standard:**
```html
<div class="p-6 rounded-lg">
  <h3 class="text-lg font-semibold mb-4">[Title]</h3>
  <div class="h-64">[Chart Canvas]</div>
  <div>[Legend]</div>
  <button class="absolute top-6 right-6">Export</button>
</div>
```

**Types:** Line (trends) | Bar (comparisons) | Pie/Donut (distribution) | Network graphs | Heatmaps | Sankey (flows)

---

## Security Visual Language

**Trust Indicators:**
- ✓ Verified badges (validated data)
- 🔒 Lock icons (encrypted)
- 🛡️ Shield (security-scanned)
- ⚠️ Warning triangles (flagged)

**Access Control:**
- Disabled state for unauthorized actions
- Role badges next to usernames
- Permission tooltips
- Visible audit log icon

**Data Integrity:**
- Green checkmark: hash verified
- Red alert: tamper detected
- Chain-of-custody intact badge
- Digital signature verification

---

## Icons

**Library:** Lucide React
**Sizes:**
- Navigation: `size-5` (20px) + `mr-2`
- Dashboard cards: `size-8` (32px, semi-transparent)
- Buttons: `size-4` (16px) + `mr-1`
- Status: `size-3` (12px)
- File types: `size-6` (24px)

**Custom:** Use `<!-- CUSTOM ICON: [Name] -->` placeholders

---

## Responsive Design

**Breakpoints:**
- **Mobile (<768px):** Single column | Hamburger menu | Stacked cards | Bottom tab nav | Sticky action buttons
- **Tablet (768-1024px):** Icon-only sidebar | 2-column grids | Collapsible filters
- **Desktop (>1024px):** Full sidebar | 3-4 column grids | Split views

---

## Role-Based UI

**Admin:** Full access + system settings  
**Analyst:** Standard modules, no config  
**Supervisor:** Read-only + approval workflows  
**Auditor:** Audit trails + reports only

**Personalization:** Draggable widgets | Pinned favorites | Recent cases | Custom metrics

---

## Interaction Patterns

**Batch Operations:** Multi-select checkboxes → bulk action toolbar → confirmation → progress indicator

**Progressive Disclosure:** Summary cards with "View Details" | Collapsible advanced options | Tabbed multi-faceted data

**Status Feedback:** Loading spinners | Success/error toasts | Inline validation | Progress bars for long operations

---

**All components maintain:** Professional authority | High information density | Consistent spacing | Clear hierarchy | Accessibility compliance | Workflow optimization for investigators