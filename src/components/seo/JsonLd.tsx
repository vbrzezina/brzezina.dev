/**
 * Server-rendered JSON-LD. `<` is escaped so a string value can never close the script element.
 * A plain <script> (not next/script) keeps it in the initial HTML for crawlers.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
