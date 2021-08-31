# wf-school-map-utility


### How to Use

Inject the following iframe (note the **version** number):

```
<iframe style="border: none; height: 100%; width: 100%;" srcdoc="
<!DOCTYPE html>
<html>
  <head>
    <title>Wildflower Schools: School Map Plugin</title>
    <style>
      body, html, #overlord, #root {width: 100%; height: 100%; margin: 0; padding: 0}
    </style>
    <meta name='theme-color' content='#000000' />
    <meta name='viewport' content='width=device-width, initial-scale=1'/>
    <meta charset='UTF-8' />
    <script src='https://unpkg.com/@wildflowerschools/wf-school-map-utility@0.0.8/dist/wf-school-map-utility.js'></script>
  </head>
  <body>
    <div id='overlord'>
        <div id='root'></div>
        <script>
          window.wfSchoolMap.render()
        </script>
    </div>
  </body>
</html>
"></iframe>

```

## Dev

### Run Server (docker)

    docker build . -t wf-school-map-utility
    docker run --env-file ./.env -p 80:80 wf-school-map-utility

### Run Server (locally)

    npm run server

### Run Client (locally)

    npm run client

## Production

### Server Publish

Push to Docker Hub

    just docker-push

### Client API Publish

Push to NPM

    just npm-push

Find clientJS at:

    https://unpkg.com/@wildflowerschools/wf-school-map-utility@<<VERSION>>/dist/wf-school-map-utility.js
