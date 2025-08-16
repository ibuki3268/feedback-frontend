import { useState } from 'react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Header from '~/components/Header';
import Footer from '~/components/Footer';

// このページで読み込むCSSファイルを定義します
export const links = () => {
    return [
        { rel: 'stylesheet', href: '/styles/normalize.css' },
        { rel: 'stylesheet', href: '/styles/home.css' },
        { rel: 'stylesheet', href: '/styles/header.css' },
        { rel: 'stylesheet', href: '/styles/footer.css' },
    ];
};

// ページが表示される前にサーバー側で実行され、データを取得します
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // API仕様書④のエンドポイントを呼び出して、タグの一覧を取得します
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tags`);
    if (!response.ok) {
      throw new Error("タグの取得に失敗しました。");
    }
    // 受け取ったデータが文字列の配列であることをTypeScriptに教えます
    const tags = await response.json() as string[];
    
    // 取得したタグの配列をページに渡します
    return json({ tags });

  } catch (error) {
    console.error(error);
    // エラーが発生した場合は、空の配列を渡します
    return json({ tags: [] });
  }
}

// フォームが送信されたときにサーバー側で実行されます
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const isbn = formData.get("isbn");
  const title = formData.get("title");
  const tags = formData.getAll("tags"); // 選択された既存タグ
  const newTag = formData.get("newTag"); // 新しく入力されたタグ

  // ターミナルに送信されたデータを表示します
  console.log("本登録フォーム送信データ:", { 
    isbn, 
    title, 
    tags, 
    newTag: newTag || null 
  });

  // TODO: サーバーにデータを送信する処理（API仕様書⑥）をここに記述します
  
  return null;
}

// ページの見た目を定義するコンポーネントです
export default function BookRegisterPage() {
  const { tags } = useLoaderData<typeof loader>();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(name => name !== tagName)
        : [...prev, tagName]
    );
  };

  return (
    <div className="page-container">
      <Header />
      <div className="content-container">
        <div className="container">
          <p className="subheading">本の登録</p>

          <Form method="post">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
              
              {/* ISBN入力 */}
              <div>
                <label htmlFor="isbn" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  ISBN（13桁）
                </label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  placeholder="9784123456789"
                  pattern="[0-9]{13}"
                  required
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>

              {/* 本のタイトル入力 */}
              <div>
                <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  本のタイトル
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="本のタイトルを入力"
                  required
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>

              {/* 既存タグ選択 */}
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                  タグを選択
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                  {tags.map((tag: string) => (
                    <label 
                      key={tag} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        backgroundColor: selectedTags.includes(tag) ? '#e3f2fd' : 'transparent'
                      }}
                    >
                      <input
                        type="checkbox"
                        name="tags"
                        value={tag}
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        style={{ marginRight: '8px' }}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 新しいタグ作成 */}
              <div>
                <label htmlFor="newTag" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  新しいタグを作成（任意）
                </label>
                <input
                  type="text"
                  id="newTag"
                  name="newTag"
                  placeholder="新しいタグ名を入力"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>

              {/* 選択されたタグの表示 */}
              {(selectedTags.length > 0 || newTag) && (
                <div>
                  <p style={{ fontWeight: 'bold' }}>選択中のタグ:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedTags.map(tagName => (
                      <span key={tagName} style={{ backgroundColor: '#2196F3', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                        {tagName}
                      </span>
                    ))}
                    {newTag && (
                      <span style={{ backgroundColor: '#4CAF50', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                        {newTag} (新規)
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button type="submit" className="link">
                本を登録
              </button>
            </div>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
}