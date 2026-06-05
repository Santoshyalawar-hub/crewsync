# # Stage 1: Build React (Vite) app
# FROM node:20-alpine AS build

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# # Pass API URL as build argument
# ARG VITE_API_BASE_URL
# ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# RUN npm run build

# # Stage 2: Serve built app
# FROM node:20-alpine

# WORKDIR /app

# RUN npm install -g serve

# COPY --from=build /app/dist ./dist

# EXPOSE 3000

# CMD ["serve", "-s", "dist", "-l", "3000"]


# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build


# Stage 2: Serve
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]