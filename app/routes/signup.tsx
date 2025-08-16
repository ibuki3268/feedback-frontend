import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

type ActionResponse = {
  msg: string;
  error?: boolean; 
}

// ---------------------------------------------------------
// ▼ サーバーサイドの処理部分
// ---------------------------------------------------------
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const nickname = formData.get("nickname");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname, email, password }),
    });

    // ステータスコードが成功（2xx）でない場合
    if (!response.ok) {
      let errorMessage;
      try {
        // 'as' を使って、受け取ったデータの型を保証する
        const errorData = await response.json() as { message: string };
        errorMessage = errorData.message || "登録に失敗しました";
      } catch (e) {
        errorMessage = await response.text();
        console.log("Backend returned non-JSON error:", errorMessage);
      }
      return json({ msg: errorMessage, error: true }, { status: response.status });
    }

    // 成功した場合
    const responseData = await response.json();
    console.log("✅ Response from backend:", responseData);
    return redirect("/login");

  } catch (error) {
    console.error("❌ Failed to fetch backend:", error);
    return json({ msg: "バックエンドサーバーとの通信に失敗しました", error: true }, { status: 500 });
  }
};

// ---------------------------------------------------------
// ▼ ブラウザで表示されるUI部分
// ---------------------------------------------------------
export default function SignupPage() {
  const actionData = useActionData<ActionResponse>();

  return (
    <div className="page-container">
      <div className="container">
        <p className="subheading">新規登録</p>
        <Form method="post">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
            <div>
              <label htmlFor="nickname">ニックネーム</label>
              <input type="text" id="nickname" name="nickname" required style={{ width: '100%', padding: '10px' }}/>
            </div>
            <div>
              <label htmlFor="email">メールアドレス</label>
              <input type="email" id="email" name="email" required style={{ width: '100%', padding: '10px' }}/>
            </div>
            <div>
              <label htmlFor="password">パスワード</label>
              <input type="password" id="password" name="password" required style={{ width: '100%', padding: '10px' }}/>
            </div>
            <button type="submit" className="link">登録する</button>
          </div>
        </Form>
        
        {actionData && (
          <div style={{ marginTop: '20px', color: actionData.error ? 'red' : 'green' }}>
            <p>{actionData.msg}</p>
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
            <Link to="/login">すでにアカウントをお持ちの方はこちら</Link>
        </div>
      </div>
    </div>
  );
}