import express from "express";
import cors from "cors";
const app = express();

// 基础中间件
app.use(express.json());
app.use(cors());

// 健康检查接口
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
