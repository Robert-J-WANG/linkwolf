"use client"; // 声明为客户端组件
import { useState, useEffect } from "react"; // React 的状态和副作用钩子
import axios from "axios"; // 用于发起 HTTP 请求

// 定义后端健康检查接口返回的数据类型
type HealthData = {
  status: string; // 服务状态
  message: string;
  timestamp: string; // 时间戳
};

export default function Home() {
  // healthData 用于保存后端健康检查数据，loading 表示加载状态
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = "http://localhost:3001";
    axios
      .get(`${API_URL}/health`)
      .then((response) => {
        setHealthData(response.data); // 保存后端返回数据
        setLoading(false); // 设置加载完成
      })
      .catch((error) => {
        console.error("Failed to connect to backend:", error); // 连接失败处理
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">LinkWolf</h1>
        <p className="text-gray-600 mb-8">个人链接分享平台</p>

        {/* 显示后端连接状态 */}
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">后端连接状态</h3>
          {loading ? (
            <p className="text-gray-500">连接中...</p> // 加载中
          ) : healthData ? (
            <div className="text-green-600">
              <p>✅ 后端连接成功</p>
              <p className="text-sm mt-2">状态: {healthData.status}</p>
              <p className="text-sm">信息: {healthData.message}</p>
              <p className="text-sm">
                时间: {new Date(healthData.timestamp).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-red-600">❌ 后端连接失败</p> // 连接失败
          )}
        </div>
      </div>
    </main>
  );
}
