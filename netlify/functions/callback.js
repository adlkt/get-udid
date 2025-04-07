import { parse } from 'plist';

export const handler = async function(event, context) {
  try {
    // 只处理 POST 请求
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: '方法不允许' })
      };
    }

    // 解析 Apple 发送的 plist 数据
    const data = parse(event.body);
    
    // 提取设备信息
    const deviceInfo = {
      UDID: data.UDID || '',
      IMEI: data.IMEI || '',
      PRODUCT: data.PRODUCT || '',
      VERSION: data.VERSION || '',
      DEVICE_NAME: data.DEVICE_NAME || ''
    };

    // 将设备信息编码为 URL 参数
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(deviceInfo)) {
      if (value) params.append(key, value);
    }

    // 重定向回主页，带上设备信息
    return {
      statusCode: 302,
      headers: {
        'Location': `/?${params.toString()}`
      },
      body: ''
    };
  } catch (error) {
    console.error('处理回调时出错:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '服务器内部错误' })
    };
  }
};