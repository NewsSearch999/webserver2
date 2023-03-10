# STEP 1
FROM node:alpine As builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --silent

COPY . .

RUN npm run build

# STEP 2
FROM node:alpine as production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

CMD ["node", "dist/apps/orders/main"]