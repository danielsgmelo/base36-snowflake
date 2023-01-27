
# base36-snowflake

This demo app generates unique IDs encoded in base36. 

In its default settings, it'll generate unique 36-bit IDs encoded in a 7-character base36 string (such as `A48HK2P`). The first 6 bits identify the instance responsible for that number. The remainer bits consists of a simple sequential number, unique to a given instance.

The service is highly configurable. See the default config file [here](./config/default.js) for reference. It's possible to fine-tune the maximum length of the ID, the maximum number of instances, among others settings, according to the requirements of a particular use case.

### The control file & crash recovery

Each instance keeps its own control file, which contains the last sequential number used. In order to reduce disk access & increase performance, the service can touch this control file only once every *N* sequential numbers. However, if *N* > 1 and an instance crashes, some sequential numbers of that instance may be skipped when it restarts. This is a configurable setting.

The control file MUST be created and intialized by the system administrator before the first deployment. An instance will refuse to run otherwise. Care should be taken to make regular backup copies of all instances' control file. 

See instructions below for more details on creating the control file.

### Available endpoints

To get a new ID:

```bash
curl -X POST http://localhost:5678/
{"id":"00004B2"}
```

To get 5 new IDs at once:
```bash
curl -X POST http://localhost:5678/?n=5
[{"id":"00004B3"},{"id":"00004B4"},{"id":"00004B5"},{"id":"00004B6"},{"id":"00004B7"}]
```

To get the service's health:
```bash
curl http://localhost:5678/health
UP
```
## Local development quick start
```bash
# initialize the control file
echo -n -1 > data/control.txt 
# start a single instance in development mode
npm start
```
## Quick start with multiple instances, docker-compose & prod settings

The sample `docker-compose.yaml` provided creates 3 instances along with an nginx acting as load balancer, for demo purposes. It exposes the service on port 4000 by default.

```bash
# initialize the control file for all instances
for i in {1..3}; do echo -n -1 > data/control_prod_$i.txt; done
# start the service in prod mode, with 3 instances
docker-compose up
```

After the service is up, get some IDs:

```bash
curl -X POST http://localhost:4000/
{"id":"0HRA0HS"}
```

## Test suite

### ID generation tests

A full suite of unit tests is available, with over 96% of lines of code covered.

```bash
# run all unit tests
npm run test
```

### Performance test

A performance test with k6 is included. See [performance-test.js](./performance-test.js) for details.

```bash
# spin up a grafana/k6 docker image and stress test the service
npm run performance-test
```
### Crash recovery test

This test suite ensures that the service won't generate duplicate values if an instance crashes or is killed:

```bash
# run the crash recovery test only
npm run crash-recovery-test
```