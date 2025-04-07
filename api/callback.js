export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    const udidMatch = body.match(/<key>UDID<\/key>\s*<string>(.*?)<\/string>/);
    const udid = udidMatch ? udidMatch[1] : '未能识别 UDID';
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <html><body style="text-align:center;margin-top:50px;font-family:sans-serif;">
      <h1>您的 UDID 是：</h1>
      <p style="font-size:24px;color:blue">${udid}</p>
      <p>请复制并返回给开发者</p>
      </body></html>
    `);
  });
}
