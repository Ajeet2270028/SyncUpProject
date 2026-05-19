import "../styles/globals.css";
import Link from "next/link";


// Navbar shown on every page
function Navbar() {
  return (
    <nav className="navbar">
      <h1>⚡ SyncUp</h1>
      <div>
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
      </div>
    </nav>
  );
}


export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      {/* Component = the current page being visited */}
      <Component {...pageProps} />
    </>
  );
}