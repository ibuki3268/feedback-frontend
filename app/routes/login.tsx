import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

// --- スタイルシートの読み込み ---
export const links = () => {
  return [
    { rel: 'stylesheet', href: '/styles/normalize.css' },
    { rel: 'stylesheet', href: '/styles/home.css' },
    { rel: 'stylesheet', href: '/styles/header.css' },
    { rel: 'stylesheet', href: '/styles/footer.css' }
  ];
};

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

  // 入力値の検証
  if (!email || !password) {
    return json({ msg: "メールアドレスとパスワードを入力してください", error: true });
  }

  // 環境変数の取得と検証
  let apiUrl = process.env.API_URL || "http://localhost:5000";
  
  // 環境変数のデバッグログ
  console.log("=== LOGIN DEBUG ===");
  console.log("API_URL from env:", process.env.API_URL);
  console.log("Final apiUrl:", apiUrl);
  
  // 余分なスペースや引用符を除去
  apiUrl = apiUrl.trim().replace(/^["']|["']$/g, '');

  // URLの妥当性チェック
  try {
    new URL(apiUrl);
  } catch (error) {
    console.error("Invalid API URL:", apiUrl);
    return json({ msg: "サーバー設定エラーが発生しました", error: true });
  }

  try {
    console.log("Attempting login to:", `${apiUrl}/api/auth/login`);
    
    // バックエンドのAPIエンドポイント（/api/auth/login）にデータを送信
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Login response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Login failed:", errorText);
      
      // HTTPステータスに応じたエラーメッセージ
      if (response.status === 401) {
        return json({ msg: "メールアドレスまたはパスワードが間違っています", error: true });
      } else if (response.status === 404) {
        return json({ msg: "ログインエンドポイントが見つかりません", error: true });
      } else {
        return json({ msg: "ログインに失敗しました", error: true });
      }
    }

    const data = await response.json() as ActionResponse;

    // もしログインに成功してtokenが返ってきたら...
    if (data.token) {
      console.log("Login successful, setting cookie and redirecting");
      
      // Cookieに保存するためのヘッダーを作成
      const headers = new Headers();
      headers.append(
        "Set-Cookie",
        `token=${data.token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`
      );

      // Cookie設定ヘッダーを付けてマイページにリダイレクト
      return redirect("/mypage", { headers });
    }

    // ログインに失敗した場合は、エラーメッセージをページに返す
    return json({ msg: data.msg || "ログインに失敗しました", error: true });
  } catch (error) {
    console.error("Network error:", error);
    return json({ msg: "ネットワークエラーが発生しました。サーバーが起動しているか確認してください。", error: true });
  }
}

export default function LoginPage() {
  const actionData = useActionData<ActionResponse>();

  return (
    <div className="page-container">
      <Header />
      <div className="content-container">
        <div className="content">
          <div className="container">
            <p className="subheading">ログイン</p>

            <Form method="post">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px', margin: '0 auto' }}>
                <div>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    メールアドレス
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px' 
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    パスワード
                  </label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required 
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px' 
                    }}
                  />
                </div>
                <button 
                  type="submit" 
                  className="link"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ログイン
                </button>
              </div>
            </Form>
                    
            {/* APIからのエラーメッセージを表示する */}
            {actionData?.msg && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px',
                backgroundColor: actionData.error ? '#ffe6e6' : '#e6ffe6',
                color: actionData.error ? '#d00' : '#070',
                border: `1px solid ${actionData.error ? '#ffcccc' : '#ccffcc'}`,
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0 }}>{actionData.msg}</p>
              </div>
            )}
                    
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none' }}>
                新規登録はこちら
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}