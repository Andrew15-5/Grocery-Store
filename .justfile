set dotenv-load

default:
  git submodule update --init --recursive
  cp .env ref-app/
  docker compose up

clean:
  rm -rf node_modules dist ref-app
  docker compose down -v

docker-rmi:
  docker rmi ${IMAGE_HOST}postgressql_for_grocery_store ${IMAGE_HOST}grocery_store ${IMAGE_HOST}ref-app
