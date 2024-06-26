import { Link } from '@remix-run/react';

export const links = () => {
  return [
    { rel: 'stylesheet', href: '/styles/normalize.css' },
    { rel: 'stylesheet', href: '/styles/index.css' }
  ];
};

export default function Index() {
  return (
    <div className="page-container">
      <div className="container">
        <p className="subheading">じょぎ</p>
        <Link to="/login" className="link">
          入室
        </Link>
      </div>
    </div>
  );
}
