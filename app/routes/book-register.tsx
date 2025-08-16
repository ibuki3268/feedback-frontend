import { useState } from 'react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Header from '~/components/Header';
import Footer from '~/components/Footer';

export const links = () => {
    return [
        { rel: 'stylesheet', href: '/styles/normalize.css' },
        { rel: 'stylesheet', href: '/styles/home.css' },
        { rel: 'stylesheet', href: '/styles/header.css' },
        { rel: 'stylesheet', href: '/styles/footer.css' },
    ];
};

// タグの型定義
type Tag = {
  id: number;
  name: string;
};

// 既存のタグを取得するローダー（実際のAPIエンドポイントに合わせて修正してください）
export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: 実際のAPIからタグ一覧を取得
  const existingTags: Tag[] = [];
  
  return { existingTags };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const isbn = formData.get("isbn");
  const title = formData.get("title");
  const selectedTags = formData.getAll("selectedTags");
  const newTag = formData.get("newTag");

  console.log({ 
    isbn, 
    title, 
    selectedTags, 
    newTag: newTag || null 
  });

  // TODO: サーバーにデータを送信
  // 新しいタグがある場合は先に作成してから本を登録

  return null;
}

export default function BookRegisterPage() {
  const { existingTags } = useLoaderData<typeof loader>();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
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
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    border: '1px solid #ccc',
                    fontSize: '16px'
                  }}
                />
                <small style={{ color: '#666', fontSize: '12px' }}>
                  バーコード下の13桁の数字を入力してください
                </small>
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
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    border: '1px solid #ccc',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* 既存タグ選択 */}
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                  タグを選択
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                  gap: '10px',
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9'
                }}>
                  {existingTags.map((tag) => (
                    <label 
                      key={tag.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        padding: '5px',
                        borderRadius: '3px',
                        backgroundColor: selectedTags.includes(tag.id) ? '#e3f2fd' : 'transparent'
                      }}
                    >
                      <input
                        type="checkbox"
                        name="selectedTags"
                        value={tag.id}
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontSize: '14px' }}>{tag.name}</span>
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
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    border: '1px solid #ccc',
                    fontSize: '16px'
                  }}
                />
                <small style={{ color: '#666', fontSize: '12px' }}>
                  新しいタグを入力すると自動的にサーバーに保存されます
                </small>
              </div>

              {/* 選択されたタグの表示 */}
              {selectedTags.length > 0 && (
                <div>
                  <p style={{ margin: '10px 0 5px 0', fontWeight: 'bold', fontSize: '14px' }}>
                    選択中のタグ:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedTags.map(tagId => {
                      const tag = existingTags.find(t => t.id === tagId);
                      return (
                        <span 
                          key={tagId}
                          style={{
                            backgroundColor: '#2196F3',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}
                        >
                          {tag?.name}
                        </span>
                      );
                    })}
                    {newTag && (
                      <span 
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}
                      >
                        {newTag} (新規)
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="link"
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
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