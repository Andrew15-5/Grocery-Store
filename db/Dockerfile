FROM postgres:14.4-alpine3.16@sha256:4ea11d3110e47a360ace22bbca73b2ebaa6dd2eec289e0b6949e4d96e2d4ba4c
RUN apk add -u --no-cache zlib
USER postgres
ADD add_database.sql /docker-entrypoint-initdb.d
