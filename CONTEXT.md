# Portfolio Design Vocabulary

This glossary defines content and route-family terms used by the portfolio redesign specifications. It records domain language only; implementation details belong in later design and architecture work.

- **Collection index:** A complete route-level sequence of records, currently `/projects` or `/certificates`.
- **Evidence detail:** A route that expands one project or credential record, currently `/projects/[slug]` or `/certificates/[slug]`.
- **Career record:** One complete professional-experience entry within `/experience`; experience does not have separate detail routes.
- **Evidence unit:** A source-backed claim, artifact, technical decision, image, metadata item, or available external link.
- **Record continuation:** The orientation choices that return to a collection index or move to the previous or next record.
- **Utility state:** A loading, rendering-error, or not-found presentation that preserves the surrounding portfolio context.
- **Page family:** A shared orientation and reading contract across related routes. A page family does not require every route to use an identical visible template.


- **Motion family:** A recurring class of movement with one defined communication purpose, trigger, lifecycle, capability fallback, and reduced-motion equivalent.
- **Signature moment:** A deliberately scarce cinematic motion family reserved for major orientation or identity events, currently initial arrival, route handoff, the hero, and selected evidence relationships.
- **Structured reveal:** A one-time entrance applied to a meaningful editorial unit; internal staggering is used only when it clarifies the unit's reading sequence.
- **Route handoff:** The continuous cover, navigation, and destination-reveal event used for eligible internal route changes.
- **Scroll-linked effect:** Movement whose progress follows scroll position and enhances depth or orientation without changing evidence order, access, or normal document flow.
- **Capability tier:** The motion level selected from user preference, input mode, viewport constraints, and browser reliability; width alone does not determine motion eligibility.
