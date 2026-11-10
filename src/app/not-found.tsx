import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container empty-state">
      <span className="eyebrow">404</span>
      <h1>This page has moved off the map.</h1>
      <p>Explore our services or return home to find your way.</p>
      <Link className="button" href="/">
        Back to home
      </Link>
    </main>
  );
}
