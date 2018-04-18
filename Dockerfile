# Stage 0, based on Node.js, to build and compile Angular
FROM node:8.6 as node

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY ./ /app/

ARG env=prod

RUN npm run build -- --prod



# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.13.11-alpine

LABEL authors="Alexander Rashed <alexander.rashed@tuwien.ac.at>, Stefan Märzinger <e01326652@student.tuwien.ac.at>, Stefan Zimmermann <e01328955@student.tuwien.ac.at>"

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built app to wwwroot
COPY --from=node /app/dist/ /usr/share/nginx/html

# Remove the default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Add our nginx config folder to the container
COPY config /etc/nginx/conf.d/
