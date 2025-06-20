FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

EXPOSE 5173

# Commande de débogage pour voir ce qui se passe
CMD ["sh", "-c", "echo 'Contenu de node_modules/.bin:' && ls -la node_modules/.bin/ && echo 'PATH:' && echo $PATH && echo 'Tentative de lancement avec npx:' && npx vite --host 0.0.0.0"]