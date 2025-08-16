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

export const links = () => {
  return [
    { rel: 'stylesheet', href: '/styles/normalize.css' },
    { rel: 'stylesheet', href: '/styles/home.css' },
    { rel: 'stylesheet', href: '/styles/header.css' },
    { rel: 'stylesheet', href: '/styles/footer.css' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const isLoggedIn = true;
  if (!isLoggedIn) {
    return redirect("/login");
  }
  const userInfo = { nickname: "いぶき", iconUrl: "/assets/default-icon.svg" };
  return json({ userInfo });
}

export async function action({ request }: ActionFunctionArgs) {
  console.log("File upload action was called (currently disabled for deployment).");
  return json({ success: true, message: "File upload is temporarily disabled." });
}

export default function MyPage() {
  const { userInfo } = useLoaderData<typeof loader>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(userInfo.iconUrl);

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
          <p className="subheading">{userInfo.nickname}さんのマイページ</p>
          <Form method="post" encType="multipart/form-data" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3>アイコン設定</h3>
            {previewUrl && <img src={previewUrl} alt="Icon preview" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />}
            <div style={{ marginTop: '10px' }}>
              <label htmlFor="icon-upload" className="link" style={{ cursor: 'pointer' }}>
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
                    
            <div style={{ marginTop: '10px' }}>
              <button type="submit" className="link">
                この画像に決定
              </button>
            </div>
          </Form>
          
        </div>
      </div>
      <Footer />
    </div>
  );
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
