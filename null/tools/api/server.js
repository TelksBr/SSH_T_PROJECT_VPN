import express from 'express';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 2095;
const ONLINE_FILE_PATH = path.join(__dirname, 'online.txt');

// Token secreto para autenticação
const AUTH_TOKEN = 'b2c1f84a1d3e92f63e1d73c7e55b8a19a93d5b405c5d88f7f367e27c084df0a7';

// Middleware para autenticar o token na URL
const authenticateToken = (req, res, next) => {
    const token = req.query.token;
  
    if (token && token === AUTH_TOKEN) {
      next(); // Token é válido, continue para a próxima middleware ou rota
    } else {
      res.status(403).send('Acesso negado. Token inválido.');
    }
  };
  

// Middleware para habilitar o CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Função para obter o número de usuários SSH e salvar no arquivo
const updateOnlineFile = () => {
  exec("ps -x | grep sshd | grep -v root | grep priv | wc -l", (error, stdout, stderr) => {
    if (error || stderr) {
      console.error("Erro ao executar o comando para obter usuários SSH:", error || stderr);
      return;
    }
    const onlineUsers = stdout.trim();
    fs.writeFile(ONLINE_FILE_PATH, onlineUsers)
      .then(() => console.log("Número de usuários SSH atualizado no arquivo."))
      .catch(err => console.error("Erro ao escrever no arquivo:", err));
  });
};

// Atualiza o número de usuários SSH no arquivo a cada minuto
setInterval(updateOnlineFile, 60000); // 60000 ms = 1 minuto

// Função para obter o número de usuários online do arquivo
const getOnlineFromFile = async () => {
  try {
    const data = await fs.readFile(ONLINE_FILE_PATH, "utf8");
    return parseInt(data.trim());
  } catch (err) {
    console.error("Erro ao ler o número de usuários online do arquivo:", err);
    throw err;
  }
};

// Aplica o middleware de autenticação a todas as rotas
app.use(authenticateToken);

// Rota para obter o número de usuários online
app.get("/online", async (req, res) => {
  try {
    const onlineUsersFromFile = await getOnlineFromFile();
    return res.json({ onlineUsers: onlineUsersFromFile });
  } catch {
    return res.status(500).send("Erro ao obter o número de usuários online");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor API rodando na porta ${PORT}`);
});
