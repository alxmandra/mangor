FROM node:21-alpine
WORKDIR /src
COPY . /src
ENV SHARED_STORE=localhost:3003
ENV REACT_APP_AUTH_SERVER=localhost:3002
ENV AUTHENTICATION=localhost:3001

COPY package.json package-lock.json ./

RUN npm ic  --omit=dev

EXPOSE 3005

CMD npm start