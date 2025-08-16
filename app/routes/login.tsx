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
    // TODO: ここで受け取ったトークンをCookieなどに保存する処理を追加する
    console.log("Login successful, token:", data.token);
    // ログイン後のページ（例えばホームページ）にリダイレクト（強制的に移動）させる
    return redirect("/home");
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