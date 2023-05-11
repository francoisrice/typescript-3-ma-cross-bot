# typescript-3-ma-cross-bot

## Deployment Steps

- Build .js files with `npx tsc`
- rebuild docker images
  - `docker build -t 3-ma-cross -f ./docker/main/Dockerfile .`
  - `docker build -t bitcoin-fetcher -f ./docker/bitcoin-fetcher/Dockerfile .`
- Connect to Container Repo with `docker login registry.digitalocean.com`
  - Use DOCEAN_KEY for username and password if needed
- tag and push images to DOcean Container Registry
  - `docker tag 3-ma-cross registry.digitalocean.com/bitshark-container-repo/test-annual-return:3-ma-cross-main`
  - `docker push registry.digitalocean.com/bitshark-container-repo/test-annual-return:3-ma-cross-main`
  - `docker tag bitcoin-fetcher registry.digitalocean.com/bitshark-container-repo/test-annual-return:bitcoin-fetcher`
  - `docker push registry.digitalocean.com/bitshark-container-repo/test-annual-return:bitcoin-fetcher`
- Pull & run containers on prod server with
  - `docker pull registry.digitalocean.com/bitshark-container-repo/test-annual-return:3-ma-cross-main`
  - `docker pull registry.digitalocean.com/bitshark-container-repo/test-annual-return:bitcoin-fetcher`
- Pull the latest container images if needed
  - `docker pull registry.digitalocean.com/bitshark-container-repo/test-annual-return:3-ma-cross-main`
  - `docker pull registry.digitalocean.com/bitshark-container-repo/test-annual-return:bitcoin-fetcher`
