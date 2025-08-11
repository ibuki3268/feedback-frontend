import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const nickname = formData.get("nickname");
  const email = formData.get("email");
  const password = formData.get("password");

  // ターミナルに入力内容を表示して、データが送られてきたことを確認します
  console.log("新規登録:", { nickname, email, password });

  return null;
}

export default function SignupPage() {
  return (
    <div className="page-container">
      <div className="container">
        <p className="subheading">新規登録</p>

        <Form method="post">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
            
            <div>
              <label htmlFor="nickname" style={{ display: 'block', marginBottom: '5px' }}>ニックネーム</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                required
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>

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
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1-pc solid #ccc' }}
              />
            </div>

            <button type="submit" className="link">
              登録する
            </button>
          </div>
        </Form>
        
        <div style={{ marginTop: '20px' }}>
            <Link to="/login" style={{ color: '#007BFF' }}>
              アカウントをお持ちの方はこちら
            </Link>
        </div>
      </div>
    </div>
  );
}