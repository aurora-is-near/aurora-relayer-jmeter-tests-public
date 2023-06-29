#! /bin/bash

freeMem=`awk '/MemFree/ { print int($2/1024) }' /proc/meminfo`
s=$(($freeMem/10*8))
x=$(($freeMem/10*8))
n=$(($freeMem/10*2))

GC_ALGO="-XX:+UseConcMarkSweepGC"
HEAP="-Xmn${n}m -Xms${s}m -Xmx${x}m"
RUN_IN_DOCKER="-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap"
