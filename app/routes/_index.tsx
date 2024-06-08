import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Link to="/login">Login to access protected content</Link>
      <Link to="/home">Go to Home</Link>
    </div>
  );
}
