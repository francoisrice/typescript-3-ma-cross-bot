# typescript-3-ma-cross-bot

## Deployment Steps

- Make sure the `.env` file is outside both `src/` and `dist/` at the root of the project
- Build .js files with `npx tsc`
- rebuild docker images
  - `docker build -t 3-ma-cross -f ./docker/main/Dockerfile .`
  - `docker build -t bitcoin-fetcher -f ./docker/bitcoin-fetcher/Dockerfile .`
- Connect to Container Repo with `docker login registry.digitalocean.com`
  - Use DOCEAN_KEY for username and password if needed
- tag and push images to DOcean Container Registry
  - `docker tag 3-ma-cross registry.digitalocean.com/{containerRepository}/{repositoryName}:3-ma-cross-main`
  - `docker push registry.digitalocean.com/{containerRepository}/{repositoryName}:3-ma-cross-main`
  - `docker tag bitcoin-fetcher registry.digitalocean.com/{containerRepository}/{repositoryName}:bitcoin-fetcher`
  - `docker push registry.digitalocean.com/{containerRepository}/{repositoryName}:bitcoin-fetcher`
- Pull & run containers on prod server with
  - `docker run registry.digitalocean.com/{containerRepository}/{repositoryName}:3-ma-cross-main -d`
  - `docker run registry.digitalocean.com/{containerRepository}/{repositoryName}:bitcoin-fetcher -d`
- Pull the latest container images if needed
  - `docker pull registry.digitalocean.com/{containerRepository}/{repositoryName}:3-ma-cross-main`
  - `docker pull registry.digitalocean.com/{containerRepository}/{repositoryName}:bitcoin-fetcher`
