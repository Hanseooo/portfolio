/**
 * Skip-to-main-content link.
 * Visible only on keyboard focus. First element in tab order.
 * S6 §6.1, S6 §12
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      Skip to main content
    </a>
  );
}
