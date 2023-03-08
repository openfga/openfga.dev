FROM node:18-alpine as base

WORKDIR /home/node/app

ARG COOKIE_PRO_DATA_DOMAIN_ID
ARG HEAP_ID
ARG GOOGLE_TAG_MANAGER_ID
ARG API_DOCS_USE_ORIGIN=true
ARG SHOW_CUSTOMERS_PAGE

COPY package.json package-lock.json ./

RUN npm clean-install

COPY . .

## Development #################################################################
# Define a development target that installs devDeps and runs in dev mode
FROM base as development
WORKDIR /home/node/app
# Switch to the node user vs. root
USER node
# Expose port 3000
EXPOSE 3000
# Start the app in debug mode so we can attach the debugger
CMD ["npm", "start"]

## Production ##################################################################
# Also define a production target which doesn't use devDeps
FROM base as production
WORKDIR /home/node/app
# Build the Docusaurus app
RUN npm run build

COPY --chown=node:node . /home/node/app/


FROM nginx:mainline-alpine as deploy
# Remove un-needed packages
RUN apk del freetype curl
COPY --chown=node:node --from=production  /home/node/app/build /usr/share/nginx/html/
