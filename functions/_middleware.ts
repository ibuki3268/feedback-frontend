import { CFP_ALLOWED_PATHS } from './constants';
import { getCookieKeyValue } from './utils';
import { getTemplate } from './template';

export async function onRequest(context: {
    request: Request;
    next: () => Promise<Response>;
    env: { CFP_PASSWORD?: string };
}): Promise<Response> {
    const { request, next, env } = context;
    const { pathname, searchParams } = new URL(request.url);
    const { error } = Object.fromEntries(searchParams);
    const cookie = request.headers.get('cookie') || '';
    const cookieKeyValue = await getCookieKeyValue(env.CFP_PASSWORD);

    if (
        cookie.includes(cookieKeyValue) ||
        CFP_ALLOWED_PATHS.includes(pathname) ||
        !env.CFP_PASSWORD
    ) {
        // 正しいクッキーがある場合、許可されたパスにある場合、またはパスワードが設定されていない場合は続行
        return await next();
    } else {
        // クッキーがないか、不正なクッキーがある場合。ログインページにリダイレクト
        return new Response(getTemplate({ redirectPath: pathname, withError: error === '1' }), {
            headers: {
                'content-type': 'text/html'
            }
        });
    }
}
