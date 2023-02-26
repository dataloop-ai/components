FROM node:16-alpine

COPY storybook-static /components/storybook-static
COPY storybook.js /components/storybook.js

WORKDIR /components

RUN npm install express

EXPOSE 3000

CMD [ "node", "storybook.js"]