FROM node:14.19.1 as compile-image
ARG BUILD_ENVIRONMENT=dev
ENV BUILD_ENVIRONMENT ${BUILD_ENVIRONMENT}

WORKDIR /opt/ng
COPY package.json ./
RUN npm install




ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
RUN ng build --base-href=/fidcare/ --configuration=${BUILD_ENVIRONMENT}

FROM nginx
COPY --from=compile-image /opt/ng/dist/fidcare /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d