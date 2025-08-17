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

type ActionResponse = {
  msg: string;
  error?: boolean;
}

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

export default function SignupPage() {
  const actionData = useActionData<ActionResponse>();

  return (
    <div className="page-container">
      <Header />
      <div className="content-container">
        <div className="content">
          <div className="container">
            <p className="subheading">新規登録</p>
            
            <Form method="post">
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px', 
                width: '300px', 
                margin: '0 auto' 
              }}>
                <div>
                  <label 
                    htmlFor="nickname"
                    style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
                  >
                    ニックネーム
                  </label>
                  <input 
                    type="text" 
                    id="nickname" 
                    name="nickname" 
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
                  <label 
                    htmlFor="email"
                    style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
                  >
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
                  <label 
                    htmlFor="password"
                    style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
                  >
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
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  登録する
                </button>
              </div>
            </Form>
                     
            {actionData && (
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
              <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                すでにアカウントをお持ちの方はこちら
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}