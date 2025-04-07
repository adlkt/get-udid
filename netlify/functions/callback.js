const plist = require('plist');

exports.handler = async (event) => {
  try {
    // 检查请求方法
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: '方法不允许' }),
      };
    }

    // 解析请求体中的plist数据
    const data = event.body;
    if (!data) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: '请求体为空' }),
      };
    }

    // 解析plist数据
    const parsedData = plist.parse(data);
    
    // 提取设备信息
    const deviceInfo = {
      UDID: parsedData.UDID || '未知',
      IMEI: parsedData.IMEI || '未知',
      PRODUCT: parsedData.PRODUCT || '未知',
      VERSION: parsedData.VERSION || '未知',
      DEVICE_NAME: parsedData.DEVICE_NAME || '未知',
    };

    // 创建一个HTML页面显示设备信息
    const htmlResponse = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>您的设备信息</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            h1 {
                color: #333;
            }
            .info-card {
                background-color: #f5f5f5;
                border-radius: 8px;
                padding: 20px;
                margin-top: 20px;
                text-align: left;
            }
            .info-item {
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
            }
            .label {
                font-weight: bold;
                color: #555;
            }
            .value {
                font-family: monospace;
                background-color: #e9e9e9;
                padding: 2px 6px;
                border-radius: 4px;
                word-break: break-all;
            }
            .copy-btn {
                background-color: #0070f3;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin-left: 10px;
            }
        </style>
    </head>
    <body>
        <h1>您的设备信息</h1>
        <div class="info-card">
            <div class="info-item">
                <span class="label">UDID:</span>
                <div>
                    <span class="value" id="udid">${deviceInfo.UDID}</span>
                    <button class="copy-btn" onclick="copyToClipboard('udid')">复制</button>
                </div>
            </div>
            <div class="info-item">
                <span class="label">IMEI:</span>
                <span class="value">${deviceInfo.IMEI}</span>
            </div>
            <div class="info-item">
                <span class="label">设备型号:</span>
                <span class="value">${deviceInfo.PRODUCT}</span>
            </div>
            <div class="info-item">
                <span class="label">系统版本:</span>
                <span class="value">${deviceInfo.VERSION}</span>
            </div>
            <div class="info-item">
                <span class="label">设备名称:</span>
                <span class="value">${deviceInfo.DEVICE_NAME}</span>
            </div>
        </div>

        <script>
            function copyToClipboard(elementId) {
                const text = document.getElementById(elementId).textContent;
                navigator.clipboard.writeText(text).then(() => {
                    alert('已复制到剪贴板');
                }).catch(err => {
                    console.error('复制失败:', err);
                });
            }
        </script>
    </body>
    </html>
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
      body: htmlResponse,
    };
  } catch (error) {
    console.error('处理请求时出错:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '服务器内部错误', error: error.message }),
    };
  }
};