FROM node:20-alpine
WORKDIR /app
COPY package.json server.js index.html app.js pages.config.js ./
COPY data ./data
COPY files ./files
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
