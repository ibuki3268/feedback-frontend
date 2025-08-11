import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  console.log({ email, password });

  return null;
}

export default function LoginPage() {
  return (
    <div className="page-container">
      <div className="container">
        <p className="subheading">ログイン</p>

        <Form method="post">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>メールアドレス</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>パスワード</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>

            <button type="submit" className="link">
              ログイン
            </button>
          </div>
        </Form>
        
        <div style={{ marginTop: '20px' }}>
            <Link to="/signup" style={{ color: '#007BFF' }}>
              新規登録はこちら
            </Link>
        </div>
      </div>
    </div>
  );
}