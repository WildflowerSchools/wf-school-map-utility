version := "v1"

system-info:
    @echo "system info: {{ os() }} ({{ os_family() }}) on {{arch()}}".

build-docker:
    @docker build -t wildflowerschools/wf-school-map-utility:{{version}} -f Dockerfile .

docker-push: build-docker
    @docker push wildflowerschools/wf-school-map-utility:{{version}}

npm-push:
    npm run build
    npm publish --access public