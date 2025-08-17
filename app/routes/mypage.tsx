import {
  json,
  redirect,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
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

// --- 型定義 ---
interface Title {
  _id: string;
  name: string;
  description: string;
}

interface User {
  nickname: string;
  email: string;
  iconUrl?: string; // アイコンURLはオプショナル
  achievedTitles: Title[];
}

// --- サーバーサイドでのデータ取得 (loader関数) ---
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // デバッグ用ログ
  console.log("=== MYPAGE DEBUG INFO ===");
  console.log("API_URL from env:", process.env.API_URL);
  console.log("NODE_ENV:", process.env.NODE_ENV);

  const token = getTokenFromCookie(request);

  // ログインしていないユーザーをリダイレクトする処理
  if (!token) {
    console.log("No token found, redirecting to login");
    return redirect("/login"); 
  }

  // 環境変数の取得と検証
  let apiUrl = process.env.API_URL || "http://localhost:5000";
  
  console.log("Final apiUrl:", apiUrl);

  // 余分なスペースや引用符を除去
  apiUrl = apiUrl.trim().replace(/^["']|["']$/g, '');
  
  // URLの妥当性チェック
  try {
    new URL(apiUrl);
  } catch (error) {
    console.error("Invalid API URL:", apiUrl);
    throw new Response("サーバー設定エラーが発生しました", { status: 500 });
  }

  try {
    console.log("Fetching user data from:", `${apiUrl}/api/users/me`);
    console.log("Using token:", token.substring(0, 10) + "...");
    
    // バックエンドからユーザー情報を取得
    const response = await fetch(`${apiUrl}/api/users/me`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    console.log("User data response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch user data:", errorText);
      console.error("Response headers:", response.headers);
      
      // 認証エラーの場合はログインページへリダイレクト
      if (response.status === 401 || response.status === 403) {
        console.log("Authentication failed, redirecting to login");
        return redirect("/login");
      }
      
      // 404エラーの場合
      if (response.status === 404) {
        throw new Response("ユーザー情報のエンドポイントが見つかりません", { status: 404 });
      }
      
      throw new Response("マイページデータの取得に失敗しました", { status: response.status });
    }

    const user = await response.json() as User;
    console.log("User data fetched successfully:", user.nickname);
    return json({ user });
  } catch (error) {
    console.error("Network error:", error);
    
    // ネットワークエラーの詳細をログ出力
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error("Fetch failed - server might not be running on port 5000");
    }
    
    throw new Response("ネットワークエラーが発生しました。バックエンドサーバーが起動しているか確認してください。", { status: 500 });
  }
};

// --- フォーム送信時の処理 (action関数) ---
export async function action({ request }: ActionFunctionArgs) {
  const token = getTokenFromCookie(request);
  
  if (!token) {
    return redirect("/login");
  }

  try {
    // ファイルアップロード処理（現在は無効化）
    console.log("File upload action was called (currently disabled for deployment).");
    
    // 実際のファイルアップロード処理をここに実装する場合:
    /*
    const uploadHandler = unstable_createFileUploadHandler({
      maxPartSize: 5_000_000, // 5MB
      file: ({ filename }) => filename,
    });
    
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    );
    
    const iconFile = formData.get("icon") as File;
    
    if (iconFile && iconFile.size > 0) {
      // ファイルをバックエンドにアップロード
      const apiUrl = process.env.API_URL || "http://localhost:5000";
      // アップロード処理...
    }
    */
    
    return json({ success: true, message: "File upload is temporarily disabled." });
  } catch (error) {
    console.error("Action error:", error);
    return json({ success: false, message: "アップロードに失敗しました" });
  }
}

// --- UIコンポーネント ---
export default function MyPage() {
  const { user } = useLoaderData<typeof loader>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.iconUrl || "/assets/default-icon.svg"
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      // ファイルサイズチェック (5MB制限)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("ファイルサイズは5MB以下にしてください。");
        return;
      }
      
      // ファイル形式チェック
      if (!selectedFile.type.startsWith('image/')) {
        alert("画像ファイルを選択してください。");
        return;
      }
      
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="content-container">
        <div className="content">
          <p className="subheading">{user.nickname}さんのマイページ</p>
          
          {/* アイコン設定フォーム */}
          <Form 
            method="post" 
            encType="multipart/form-data" 
            style={{ 
              textAlign: 'center', 
              marginBottom: '40px', 
              padding: '20px', 
              border: '1px solid #eee', 
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3 style={{ marginTop: 0, color: '#333' }}>アイコン設定</h3>
            
            {/* アイコンプレビュー */}
            <div style={{ marginBottom: '15px' }}>
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Icon preview" 
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '3px solid #ddd',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} 
                />
              ) : (
                <div 
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    border: '2px dashed #ccc'
                  }}
                >
                  <span style={{ color: '#999' }}>画像なし</span>
                </div>
              )}
            </div>
            
            {/* ファイル選択 */}
            <div style={{ marginBottom: '15px' }}>
              <label 
                htmlFor="icon-upload" 
                className="link" 
                style={{ 
                  cursor: 'pointer',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
              >
                画像を選択
              </label>
              <input 
                type="file" 
                id="icon-upload" 
                name="icon" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
              />
            </div>
            
            {/* アップロードボタン */}
            <div>
              <button 
                type="submit" 
                className="link"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                この画像に決定
              </button>
            </div>
            
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', marginBottom: 0 }}>
              ※ 画像サイズは5MB以下、JPG・PNG形式のみ対応
            </p>
          </Form>

          {/* 獲得した称号一覧 */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>獲得した称号一覧 🏆</h2>
            
            {user.achievedTitles && user.achievedTitles.length > 0 ? (
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                maxWidth: '600px', 
                margin: '0 auto' 
              }}>
                {user.achievedTitles.map((title) => (
                  <li 
                    key={title._id} 
                    style={{ 
                      border: '1px solid #eee', 
                      padding: '20px', 
                      marginBottom: '15px', 
                      borderRadius: '8px', 
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      backgroundColor: '#fff',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <strong style={{ 
                      fontSize: '1.2em', 
                      color: '#007bff',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      {title.name}
                    </strong>
                    <p style={{ 
                      margin: 0, 
                      color: '#555', 
                      lineHeight: '1.5'
                    }}>
                      {title.description}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{
                padding: '40px 20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}>
                <p style={{ 
                  margin: 0, 
                  color: '#666',
                  fontSize: '16px'
                }}>
                  まだ獲得した称号はありません。
                </p>
                <p style={{ 
                  margin: '10px 0 0 0', 
                  color: '#999',
                  fontSize: '14px'
                }}>
                  アプリを使って称号を集めましょう！
                </p>
              </div>
            )}
          </div>

          {/* デバッグ情報（開発時のみ表示） */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{
              marginTop: '40px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#666'
            }}>
              <h4>デバッグ情報</h4>
              <p>ニックネーム: {user.nickname}</p>
              <p>メール: {user.email}</p>
              <p>称号数: {user.achievedTitles?.length || 0}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// --- ヘルパー関数 ---
function getTokenFromCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    console.log("No cookie header found");
    return null;
  }
  
  try {
    const cookies = new Map(
      cookieHeader.split(';').map(c => {
        const [key, ...v] = c.trim().split('=');
        return [key, v.join('=')];
      })
    );
    
    const token = cookies.get('token');
    console.log("Token found in cookie:", token ? "Yes" : "No");
    return token || null;
  } catch (error) {
    console.error("Error parsing cookies:", error);
    return null;
  }
}