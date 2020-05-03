// https://wanago.io/2019/05/06/node-js-typescript-12-worker-threads/
import {Worker} from "worker_threads";

const workerPath = './dist/worker/worker.js'
// const worker = new Worker(workerPath)
const worker = new Worker(workerPath,{
    workerData:{
        path:workerPath,
        value:4
    }
})

worker.on("message",(r) => {
    console.log(r)
})
