# App Clima

Aplicação web para consultar a previsão do tempo em tempo real utilizando a API do Open-Meteo. O projeto foi desenvolvido com Vite + TypeScript e está preparado para deploy no GitHub Pages.

## ✨ Funcionalidades

- Consulta de clima atual e previsão para uma cidade
- Exibição de temperatura, umidade, vento e descrição do clima
- Interface responsiva e simples
- Deploy automático via GitHub Actions

## 🛠️ Tecnologias

- Vite
- TypeScript
- HTML/CSS
- Open-Meteo API

## ▶️ Como executar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/Davy-Silva/fullstackia-projeto-app-clima.git
   cd projeto-app-clima
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra o navegador em:
   ```bash
   http://localhost:5173
   ```

## 🧪 Build para produção

```bash
npm run build
```

Os arquivos prontos para publicação ficam na pasta `dist`.

## 🚀 Deploy no GitHub Pages

O projeto já está configurado com um workflow do GitHub Actions que faz o deploy automaticamente quando houver push na branch `main`.

### Passos necessários no GitHub

1. Acesse as configurações do repositório.
2. Vá até "Pages".
3. Em "Build and deployment", selecione "GitHub Actions".

A aplicação ficará disponível em:

```text
https://davy-silva.github.io/fullstackia-projeto-app-clima/
```

## 📄 Licença

Este projeto é de uso livre para fins de estudo e demonstração.