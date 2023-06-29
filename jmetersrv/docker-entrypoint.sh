#! /bin/bash

date=$(date +%F)
hourofday=$(date +%H)
time=$(date +%X)
testdir="/opt/aurora/test-suite/tests"
resultdir="/opt/aurora/test-suite/results/$date/$hourofday"
mkdir -p $resultdir/

source /$testdir/test.conf

for i in "${tests[@]}"; do

    testfile=$(echo $i | cut -d ':' -f 1)
    resultfile=$time-$(echo $i | cut -d ':' -f 2)
    args=$(echo $i | cut -d ':' -f 3)
    if [ "x$args" != x ]; then
        resultfile=$resultfile-$(echo $args | sed 's/ /-/g')
        args="-J$(echo $args | sed 's/ / -J/g')"
    fi

    jmeter -n -t "$testdir/$testfile.jmx" \
    -q /opt/aurora/test-suite/conf/user.properties \
    -q /opt/aurora/test-suite/conf/system.properties \
    -q /opt/aurora/test-suite/conf/common.properties \
    -q /opt/aurora/test-suite/conf/secrets.properties \
    -q /opt/aurora/test-suite/conf/$network.properties \
    -l "$resultdir/raw/$resultfile.jtl" \
    -e -o "$resultdir/$resultfile" \
    $args

done
