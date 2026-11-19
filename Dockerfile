FROM node:20-alpine
WORKDIR /app
COPY package.json server.js index.html app.js pages.config.js ./
COPY data ./data
COPY files ./files
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
