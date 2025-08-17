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
  const token = getTokenFromCookie(request);

  if (!token) {
    // ログインしていなければログインページへ
    return redirect("/login"); 
  }

  const apiUrl = process.env.VITE_API_URL;
  // バックエンドからユーザー情報を取得
  const response = await fetch(`${apiUrl}/api/users/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    console.error("Failed to fetch user data:", await response.text());
    throw new Response("マイページデータの取得に失敗しました", { status: response.status });
  }

  const user = await response.json() as User;
  return json({ user });
};

// --- フォーム送信時の処理 (action関数) ---
// アイコン画像のアップロード処理
export async function action({ request }: ActionFunctionArgs) {
  // ここに実際のファイルアップロード処理とDB更新処理を記述します
  // 例: Cloudflare R2やAWS S3に画像を保存し、そのURLをユーザー情報に保存するなど
  console.log("File upload action was called (currently disabled for deployment).");
  return json({ success: true, message: "File upload is temporarily disabled." });
}

// --- UIコンポーネント ---
export default function MyPage() {
  const { user } = useLoaderData<typeof loader>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.iconUrl || "/assets/default-icon.svg");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
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
          <Form method="post" encType="multipart/form-data" style={{ textAlign: 'center', marginBottom: '40px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
            <h3>アイコン設定</h3>
            {previewUrl && <img src={previewUrl} alt="Icon preview" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />}
            <div style={{ marginTop: '10px' }}>
              <label htmlFor="icon-upload" className="link" style={{ cursor: 'pointer' }}>画像を選択</label>
              <input type="file" id="icon-upload" name="icon" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }}/>
            </div>
            <div style={{ marginTop: '10px' }}>
              <button type="submit" className="link">この画像に決定</button>
            </div>
          </Form>

          {/* 獲得した称号一覧 */}
          <div style={{ textAlign: 'center' }}>
            <h2>獲得した称号一覧 🏆</h2>
            {user.achievedTitles.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, maxWidth: '600px', margin: '0 auto' }}>
                {user.achievedTitles.map((title) => (
                  <li key={title._id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <strong style={{ fontSize: '1.1em' }}>{title.name}</strong>
                    <p style={{ margin: '5px 0 0 0', color: '#555' }}>{title.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>まだ獲得した称号はありません。</p>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

// --- ヘルパー関数 (要調整) ---
function getTokenFromCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const cookies = new Map(cookieHeader.split(';').map(c => {
    const [key, ...v] = c.trim().split('=');
    return [key, v.join('=')];
  }));
  return cookies.get('token') || null;
}

/*
  const uploadHandler = unstable_createFileUploadHandler({
    file: ({ filename }) => filename,
  });

  // 送信されたフォームのデータを解析
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const iconFile = formData.get("icon");

  if (!iconFile || typeof iconFile === "string") {
    return json({ error: "ファイルがありません" }, { status: 400 });
  }

  // サーバーのコンソールに、受け取ったファイル情報を表示
  console.log("Received file:", iconFile.name, "Type:", iconFile.type);


  export async function action({ request }: ActionFunctionArgs) {
  // ファイルを受け取るための準備のとこにいれる
  */

  // 本来は、ここでファイルをストレージに保存する処理を書きます
