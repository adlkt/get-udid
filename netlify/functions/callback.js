import plist from 'plist';

export const handler = async function(event, context) {
  try {
    console.log("收到回调请求:", event.httpMethod);
    
    // 只处理 POST 请求
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: '方法不允许' })
      };
    }

    console.log("请求体:", event.body);
    
    // 解析 Apple 发送的 plist 数据
    const data = plist.parse(event.body);
    console.log("解析后的数据:", data);
    
    // 提取设备信息
    const deviceInfo = {
      UDID: data.UDID || '',
      IMEI: data.IMEI || '',
      PRODUCT: data.PRODUCT || '',
      VERSION: data.VERSION || '',
      DEVICE_NAME: data.DEVICE_NAME || ''
    };

    console.log("设备信息:", deviceInfo);

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
      body: JSON.stringify({ error: '服务器内部错误', details: error.message })
    };
  }
};