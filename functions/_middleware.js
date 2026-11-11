const pages=new Set(['/','/index.html','/main','/main/','/connective','/connective/','/connective.html','/thank-you','/thank-you/','/thank-you.html','/connective-thank-you','/connective-thank-you/','/connective-thank-you.html']);
const assets=new Set(['/privacy.js','/contact.js','/contact.css','/tracker-bootstrap.js','/programs.json','/cookies.html','/cookies','/cookies/','/robots.txt','/sitemap.xml','/favicon.ico']);
export async function onRequest(context){
 const path=new URL(context.request.url).pathname;
 if(path==='/main'||path==='/main/')return Response.redirect(new URL('/',context.request.url),302);
 if(!pages.has(path)&&!assets.has(path))return new Response('Страница отключена',{status:410,headers:{'Content-Type':'text/plain; charset=utf-8','X-Robots-Tag':'noindex','Cache-Control':'no-store'}});
 return context.next();
}
