Lifecycle scripts included in angular2-quickstart:
  start
    concurrently "npm run tsc:w" "npm run lite" 
  postinstall
    typings install

available via `npm run-script`:
  lite
    lite-server
  tsc
    tsc
  tsc:w
    tsc -w
  typings
    typings
