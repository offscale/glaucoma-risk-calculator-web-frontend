# Glaucoma risk calculator web-frontend

For the files ready to deploy, see the [glaucoma-risk-calculator-web-frontend-dist](https://github.com/glaucoma-australia/glaucoma-risk-calculator-web-frontend-dist) repo.

## Technical details
Built in TypeScript with Angular 6, following latest official standards for scaffolding.

## Deploy

Requires a server with HTTPS—for Office 365 / Microsoft Graph auth—and the API: [glaucoma-risk-calculator-web-frontend-dist](https://github.com/glaucoma-australia/glaucoma-risk-calculator-web-frontend-dist); be colocated so relative paths work, like `.get('/api')`. With nginx and other servers you can fake this with `proxy_pass`. Alternatively many servers allow you to actually run both side-by-side, e.g.: IIS.

## Reuse directories with

    d=users; for f in "$d"/*; do mv "$f" "$d/$d.${f#*.}"; done

## Update version in app with

    sed -i "/this.serverStatus =/c\    this.serverStatus = {version: 'App $(jq -r .version package.json); '};" src/app/server-status/server-status.component.ts

## Release new version of dist repo
Assuming the -dist is in the directory above where this is cloned, in Bash just:

    rm -rf dist; ng build --prod && d=../glaucoma-risk-calculator-web-frontend-dist && rm -rf "$d/dist" && mv "$PWD/dist/${PWD##*/}/" "$d/dist" && cd "$d" && (git add .; git status) || ( >&2 echo BUILD FAILED )
    

Then fix the build output by replacing:

    201347067&e.flags){case 512:n=function(t,e,n){var i=n.length;switch(i){case 0:return new e;

With:

    201347067&e.flags){case 512:n=function(t,e,n){var i=n.length;switch(i){case 0:return e==null?e:new e;

E.g., using Node.js in Bash:

    export FNAME=$(printf main*); export FIND='l/201347067&e.flags){case 512:n=function(t,e,n){var i=n.length;switch(i){case 0:return new e;'; export REPLACE='l/201347067&e.flags){case 512:n=function(t,e,n){var i=n.length;switch(i){case 0:return e==null?e:new e;'; node -e 'fs=require("fs");console.info("FNAME:", process.env.FNAME, ";");fs.readFile(process.env.FNAME,"utf8",(err,data)=>{if(err!=null)throw err;fs.writeFile(process.env.FNAME,data.replace(process.env.FIND,process.env.REPLACE),"utf8",e=>{if(e!=null)throw e;});});'

## Development setup

Install latest:
  - Node.JS LTS (tested with 8.11.2);
  - npm (tested with 6.1.0); and
  - `ng` with `npm install -g @angular/cli`... (tested with 6.0.8). 

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.
