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

CMD [ "node", "dist/main.js" ]

# CMD ["pm2-runtime","--error","main-error.log","--output","main.log", "main.js"]


# -----
# COPY dist/ .

# COPY *.ts ./
# COPY bitshark/ bitshark/
# COPY standard_reset.sh reset.sh


# RUN npx tsc --init
# RUN npx tsc

# RUN source reset.sh


# CMD [ "node", "evaluateAlgorithm.js" ] 


# RUN npm install pm2 -g
# ENV PM2_PUBLIC_KEY wyv4bleue888qfv
# ENV PM2_SECRET_KEY rxxwfwi0o4cmgmn

# CMD ["/bin/sh"]

# CMD ["node", "main.js"]
# CMD ["pm2-runtime", "main.js,"--time","--log","main.log"]
# CMD ["pm2-runtime","--error","main-error.log","--output","main.log", "main.js"]