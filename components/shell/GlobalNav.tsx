import GlobalNavClient from "./GlobalNavClient";

/**
 * Global persistent navigation — S3 Navigation model, S6 §6.1.
 *
 * Responsibilities:
 * - Site-level route movement (Home, Projects, Experience, Certificates, Contact)
 * - Wordmark/home link
 * - Theme control
 * - Menu control (responsive)
 *
 * Does NOT own: homepage chapter navigation, project local section nav.
 */
export default function GlobalNav() {
  return (
    <header
      className="fixed top-0 z-50 w-full"
      role="banner"
    >
      <GlobalNavClient />
    </header>
  );
}
