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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/home" className="link">
            ホーム
          </Link>
          <Link to="/login" className="link">
            ログイン
          </Link>
          <Link to="/signup" className="link">
            新規登録
          </Link>
        </div>

      </div>
    </div>
  );
}