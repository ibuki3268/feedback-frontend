export function getTemplate({
    redirectPath,
    withError,
}: {
    redirectPath: string;
    withError: boolean;
}): string {
    return `
    <!doctype html>
    <html lang="ja" data-theme="dark">
  
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>ユーザー認証</title>
        <meta name="description" content="This site is password protected.">
        <link rel="shortcut icon" href="https://picocss.com/favicon.ico">
  
        <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css">
  
        <style>
          body > main {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: calc(100vh - 7rem);
            padding: 1rem 0;
            max-width: 600px;
          }
  
          .error {
            background: white;
            border-radius: 10px;
            color: var(--del-color);
            padding: 0.5em 1em;
          }
  
          h2 { color: var(--color-h2); }
        </style>
      </head>
  
      <body>
        <main>
          <article>
            <hgroup>
              <h1>タイトル</h1>
              <h2>パスワードを入力してください</h2>
            </hgroup>
            ${withError ? `<p class="error">パスワードが間違っています</p>` : ""}
            <form method="post" action="/cfp_login">
              <input type="hidden" name="redirect" value="${redirectPath}" />
              <input type="password" name="password" placeholder="パスワード" aria-label="Password" autocomplete="current-password" required autofocus>
              <button type="submit" class="contrast">ログイン</button>
            </form>
          </article>
        </main>
      </body>
  
    </html>
    `;
}
