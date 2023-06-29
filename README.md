# Aurora Relayer Jmeter Tests & Jmeter Test Suite

## Prerequisites

- [Docker]
- [Docker Compose]
- [NPM] (it is required during Installation & Packaging)
- Certain test cases require following secrets to perform tests
    - 2 Private Keys for signing transactions (`<TEST_SUITE_HOME>/jmetersrv/conf/secrets.properties`)
    - A+ user API token (`<TEST_SUITE_HOME>/jmetersrv/conf/secrets.properties`)

[Docker]: https://docs.docker.com/engine/install/
[Docker Compose]: https://docs.docker.com/compose/install/
[NPM]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

## Install

To have the test suite ready to use locally, it should be installed first. Clone the repository and run the 'install' command.
```console
git clone git@github.com:aurora-is-near/aurora-relayer-jmeter-tests.git
cd <TEST_SUITE_HOME>
./test-ctl install
```

## Package

In case you prefer to have distributable package of test suite, run package command which creates the tarball `aurora-relayer-jmeter-tests.tgz`.
```console
git clone git@github.com:aurora-is-near/aurora-relayer-jmeter-tests.git
cd <TEST_SUITE_HOME>
./test-ctl package
```
You can now copy the tarball to target location/server, extract it, and it is ready to use

## Uninstall

```console
cd <TEST_SUITE_HOME>
./test-ctl uninstall
```

## How to Test

### Configure

- Set **network** in `<TEST_SUITE_HOME>/tests/test.conf` as mainnet, testnet or local
- Set **tests** in `<TEST_SUITE_HOME>/tests/test.conf`. This is a list of tests are run consecutively once test suite started, each line corresponds to a single test with following format
`Test File Name` : `Result File Name` : `list of Jmeter configuration parameters in the format of key1=value1 key2=value2`
- `Test File Name`: name of predefined Jmeter test files located in `<TEST_SUITE_HOME>/tests/`
- `Result File Name`: name of the file in which test results are output
- `Jmeter Configuration Parameters`: each Test File has defaults but users can overwrite these defaults using ths configuration

#### Example 1

Following test configuration can be read as; on testnet run the same test file `json_rpc_test1` on `testnet` with various number of threads `num_of_threads` (1, 50, 100, etc.) and run each the test 1000 times (i.e.: `num_of_loop_count`) and name the result file as `BasicLoadTest-<overwritten parameters>`
```console
network=testnet
tests=( \
"json_rpc_test1:BasicLoadTest:num_of_threads=1 num_of_loop_count=1000" \
"json_rpc_test1:BasicLoadTest:num_of_threads=50 num_of_loop_count=1000" \
"json_rpc_test1:BasicLoadTest:num_of_threads=100 num_of_loop_count=1000" \
"json_rpc_test1:BasicLoadTest:num_of_threads=250 num_of_loop_count=1000" \
"json_rpc_test1:BasicLoadTest:num_of_threads=500 num_of_loop_count=1000" \
"json_rpc_test1:BasicLoadTest:num_of_threads=1000 num_of_loop_count=1000" \
)
```

#### Example 2

Following test configuration can be read as; on mainnet run 3 different test files (`json_rpc_test2`, `json_rpc_test3`, `json_rpc_test5`) consecutively and name the results as `ResponseTimeTest`, `BatchRequestTest`, `RequestObjectTest` respectively. First and third tests to be run 10 times (i.e.: `num_of_loop_count`), second test to be run with defaults
```console
network=mainnet
tests=( \
"json_rpc_test2:ResponseTimeTest:num_of_loop_count=10 " \
"json_rpc_test3:BatchRequestTest:" \
"json_rpc_test5:RequestObjectTest:num_of_loop_count=10" \
)
```

### Run Tests

```console
cd <TEST_SUITE_HOME>
./test-ctl start
```

### Test Results
#### Offline Results: A detailed report published as tests are finished

For each test run, Test Suite produces;
 1. raw tests results
 2. user-friendly HTML formatted test results

Results are located in `<TEST_SUITE_HOME>/result/<DATE>/<HOUR_OF_DAY>/<TIMESTAMP>-<RESULT_FILE_NAME>`

Test suite also provides a web server functionality to browse test results, to check test results go to `http://<test server addr>:8080/test/results/`

#### Online Results: Summary of test metrics published while tests are running

During test runs, Jmeter produces following Prometheus metrics, see [Jmeter Plugin] for more details

| Name                                                 | Type          | Description                                                          |
|------------------------------------------------------|---------------|----------------------------------------------------------------------|
| <test_name>\_success\_total                          | counter       | success total per label                                              |
| <test_name>\_failure\_total                          | counter       | failure total per label                                              |
| <test_name>\_count\_total                            | counter       | success+failure total per label                                      |
| <test_name>\_success\_ratio\_<success\failure\total> | success ratio | total success, failure counts. For more details, see [Success-Ratio] |
| <test_name>\_response\_time                          | summary       | response time per label                                              |


where `<test_name>` can be any of; BatchRequestTest, RequestObjectTest, RequestParameterTest1, RequestParameterTest2, BasicLoadTest, ResponseTimeTest, EdgeToRelayerDelayTest

- Prometheus can pull test metrics of the running test from `http://<test server addr>:9270/metrics`

- Users can also check out the test results from the TestSuite's built-in Grafana dashboard, following the link `http://<test server addr>:3000`

[Jmeter Pluging]: https://github.com/johrstrom/jmeter-prometheus-plugin
[Success-Ratio]: https://github.com/johrstrom/jmeter-prometheus-plugin#success-ratio

## Test Files

| Name           | Type               | Description                                                                                                                      |
|----------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------|
| json_rpc_test1 | Load test          | measuring response times of specific JSON RPCs under load                                                                        |
| json_rpc_test2 | Response time test | measuring response times of all JSON RPCs without load                                                                           |
| json_rpc_test3 | Functionality test | for input/output parameter validation of several batch request case                                                              |
| N/A            | N/A                | N/A                                                                                                                              |
| json_rpc_test5 | Functionality test | to validate the response under missing/invalid tags and values, only covers `jsonrpc`, `method` and `id` fields of all JSON RPCs |
| json_rpc_test6 | Functionality test | to validate the response under missing/invalid parameter tags and values, only covers `params` field                             |
| json_rpc_test7 | Functionality test | to validate the response under missing/invalid/correct parameter tags and values, only covers `params` field                     |
| N/A            | N/A                | N/A                                                                                                                              |
| log_test1      | Functionality test | to validate filters and logs                                                                                                     |
| log_test2      | Response time test | measuring response times of log filters and comparing 2 relayer installations                                                    |

## Jmeter Configuration Parameters

| Name                       | Default                                    | Used in                                              | Can be overwritten in            | Description                                                                                                  |
|----------------------------|--------------------------------------------|------------------------------------------------------|----------------------------------|--------------------------------------------------------------------------------------------------------------|
| num_of_threads             | 1                                          | All test files                                       | `test.conf`                      | specifies number of concurrent requests targeted. Meaningful to overwrite for load tests                     |
| ramp_up_period_s           | 1                                          | All test files                                       | `test.conf`                      | the number of seconds in which all threads to be started. Meaningful to overwrite for load tests             |
| num_of_loop_count          | 10                                         | All test files                                       | `test.conf`                      | specifies the number of time that the test to be run/repeated                                                |
| server_protocol            | https                                      | All test files                                       | Network specific properties file | http or https                                                                                                |
| server_addr                | testnet.aurora.dev                         | All test files                                       | Network specific properties file | IP or DNS to access Aurora JSON RPC server                                                                   |
| server_port                | 443                                        | All test files                                       | Network specific properties file | Aurora JSON RPC server port                                                                                  |
| user_token                 | -                                          | All test files                                       | `secrets.properties`             | A+ user token                                                                                                |
| chain_id                   | 1313161555                                 | `json_rpc_test2`, `json_rpc_test3`, `json_rpc_test5` | Network specific properties file | Aurora chain ID                                                                                              |
| private_key_from           | -                                          | `json_rpc_test2`, `json_rpc_test3`, `json_rpc_test5` | `secrets.oroperties`             | private key used for transactions                                                                            |
| private_key_to             | -                                          | `json_rpc_test2`, `json_rpc_test3`, `json_rpc_test5` | `secrets.oroperties`             | private key used for transactions                                                                            |
| contract_address           | 0xcc79355fc5de285e27cb0acc6bfaabd4af075968 | `json_rpc_test7`                                     | Network specific properties file | contract address                                                                                             |
| protocol_version           | 0x41                                       | All test files                                       | `common.properties`              | protocol version                                                                                             |
| json_rpc_version           | 2.0                                        | All test files                                       | `common.properties`              | JSON RPC version                                                                                             |
| lib_dir                    | /app/lib                                   | All test files                                       | `common.properties`              | directory path to external libraries used in tests, should not be changed if not working in development mode |
| tests_dir                  | /app/tests                                 | All test files                                       | `common.properties`              | directory path where test files resides, should not be changed if not working in development mode            |
| conf_dir                   | /app/conf                                  | All test files                                       | `common.properties`              | directory path where config files resides, should not be changed if not working in development mode          |
| prometheus_scrape_interval | 20000                                      | All test files                                       | `common.properties`              | prometheus polling interval                                                                                  |

## Development

- Install Java 8+
- Install Jmeter https://jmeter.apache.org/download_jmeter.cgi
- Set JMETER_HOME environment variable to Jmeter installation path
- [Install] Test Suite
- Start Test Suite in development mode with optional network parameter (default: testnet)
```
cd <TEST_SUITE_HOME>
./test-ctl develop [-n {testnet|mainnet|local}]
```

[Install]: https://github.com/aurora-is-near/aurora-relayer-jmeter-tests#install
