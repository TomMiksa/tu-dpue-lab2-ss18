FROM nginx

LABEL authors="Alexander Rashed <alexander.rashed@tuwien.ac.at>, Georg Hagmann <e01226641@student.tuwien.ac.at>"

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built app to wwwroot
COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
