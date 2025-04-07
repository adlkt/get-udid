// 确保文件内容正确，使用标准的 Vercel Serverless 函数格式
export default function handler(req, res) {
  // 处理 GET 请求
  if (req.method === 'GET') {
    res.status(200).send('UDID 获取服务正在运行');
    return;
  }
  
  // 处理 POST 请求
  if (req.method === 'POST') {
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
    return;
  }
  
  // 其他请求方法
  res.status(405).end('Method not allowed');
}
