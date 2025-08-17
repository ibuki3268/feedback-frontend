import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node"; // redirectを追加
import { Form, Link, useActionData } from "@remix-run/react";

// バックエンドからのレスポンスの型を定義
type ActionResponse = {
  token?: string; // 成功時はtokenが返ってくる
  msg?: string;   // 失敗時はmsgが返ってくる
  error?: boolean;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // バックエンドのAPIエンドポイント（/api/auth/login）にデータを送信
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json() as ActionResponse;

  // もしログインに成功してtokenが返ってきたら...
  if (data.token) {
    // --- ▼▼▼ ここからが修正部分 ▼▼▼ ---

    // 1. Cookieに保存するためのヘッダーを作成
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      // HttpOnly: セキュリティを高める設定
      // Path=/: サイト全体で有効なCookieにする
      // Max-Age=3600: Cookieの有効期限 (ここでは1時間)
      `token=${data.token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`
    );

    // 2. Cookie設定ヘッダーを付けてマイページにリダイレクト
    return redirect("/mypage", { headers });

    // --- ▲▲▲ ここまでが修正部分 ▲▲▲ ---
  }

  // ログインに失敗した場合は、エラーメッセージをページに返す
  return json(data);
}

export default function LoginPage() {
  const actionData = useActionData<ActionResponse>();

  return (
    <div className="page-container">
      <div className="container">
        <p className="subheading">ログイン</p>

        <Form method="post">
          {/* ... フォームの入力欄 (変更なし) ... */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
            <div>
              <label htmlFor="email">メールアドレス</label>
              <input type="email" id="email" name="email" required style={{ width: '100%', padding: '10px' }}/>
            </div>
            <div>
              <label htmlFor="password">パスワード</label>
              <input type="password" id="password" name="password" required style={{ width: '100%', padding: '10px' }}/>
            </div>
            <button type="submit" className="link">ログイン</button>
          </div>
        </Form>
        
        {/* APIからのエラーメッセージを表示する */}
        {actionData?.msg && (
          <div style={{ marginTop: '20px', color: 'red' }}>
            <p>{actionData.msg}</p>
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
            <Link to="/signup">新規登録はこちら</Link>
        </div>
      </div>
    </div>
  );
}