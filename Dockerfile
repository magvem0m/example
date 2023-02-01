FROM node:18-alpine as builder

WORKDIR /home/app

COPY . .

RUN npm install --ignore-scripts

RUN npm run build

# ---

FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /home/app

COPY package*.json ./

RUN npm install --production --ignore-scripts

COPY --from=builder /home/app/dist/ ./dist/

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
