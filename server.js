const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// 处理代码运行请求
app.post('/api/run', (req, res) => {
    const { code } = req.body;
    // 安全限制：禁止危险操作，这里仅做简单示例
    if (code.includes('os.') || code.includes('subprocess.') || code.includes('__import__')) {
        return res.json({ success: false, output: "禁止执行危险代码" });
    }
    // 把代码写入临时文件并运行
    const fs = require('fs');
    const path = require('path');
    const tempFile = path.join(__dirname, 'temp.py');
    fs.writeFileSync(tempFile, code);
    exec(`python ${tempFile}`, (error, stdout, stderr) => {
        fs.unlinkSync(tempFile);
        if (error) {
            return res.json({ success: false, output: stderr });
        }
        res.json({ success: true, output: stdout });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`后端服务已启动，地址：http://localhost:${PORT}`);
});