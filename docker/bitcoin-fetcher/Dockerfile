from node:18-alpine

RUN apk update
# RUN apk add vim

# RUN mkdir -p /home/app/localstorage
# RUN mkdir -p /home/app/data

WORKDIR /home/app

COPY src/ src/
COPY .env-prod .env
RUN mkdir dist/
COPY tsconfig.json .
COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npx tsc

CMD [ "node", "dist/bitcoin-fetcher.js" ]

# CMD ["pm2-runtime","--error","main-error.log","--output","main.log", "main.js"]