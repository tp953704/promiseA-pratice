class PromiseB{
    constructor(executor){
        const self = this;
        self.state = "pending" 
        self.success = undefined
        self.error = undefined
        self.currentData = undefined;
        self.onSuccessCallback = [] //保存成功回條
        self.onErrorCallback = [] //保持失敗回條
        function resolve(success){
            if(self.state === "pending"){                
                self.state = 'resolved';
                self.success = success;
                self.onSuccessCallback.forEach((element) => {
                    element();
                })
            }
        }
        function rejected(error){
            if(self.state === "pending"){
                self.error = error;
                self.state = 'rejected';
                self.onErrorCallback.forEach((element)=>{
                    element()
                })
            }
        }
        try {
            executor(resolve, rejected);
        } catch (err) {
            rejected(err);
        }
    }
    then(onResolve,onRejected){
        const self = this;
        console.log(self)
        const newPromiseB = new PromiseB((resolve , reject)=>{
            if(self.state === 'pending'){
                self.onSuccessCallback.push(()=>{
                    let successFn = onResolve(self.success)
                    resolvePromiseB(newPromiseB,successFn,resolve,reject)
                })
                self.onErrorCallback.push(()=>{
                    let errorFn = onRejected(self.error)
                    resolvePromiseB(newPromiseB,errorFn,resolve,reject )
                })
            }
            if(self.state === "resolved"){
                let successFn = onResolve(self.success)
                resolvePromiseB(newPromiseB,successFn,resolve,reject)
            }
            if(self.state === 'rejectd'){
                let errorFn = onRejected(self.error)
                resolvePromiseB(newPromiseB,errorFn,resolve,reject )
            }
        })
        return newPromiseB
    }
}

function resolvePromiseB(newPromiseB, finallyFn ,resolve, reject){
    if(newPromiseB === finallyFn){
        return reject(new TypeError("循環調用"))
    }
    if(finallyFn !== null && (typeof finallyFn === 'object' || typeof finallyFn === 'function')){
        let called
        try{
            let then = finallyFn.then;
            if(typeof then === "function"){
                then.call(finallyFn,(y)=>{
                    if (called) return;
                    called = true;
                    resolvePromiseB(newPromiseB,y,resolve,reject)
                },(e)=>{
                    if (called) return;
                    called = true;
                    reject(e)
                })
            }else{
                if (called) return;
                called = true;
                resolve(finallyFn)
            }
        }catch(error){
            if (called) return;
                called = true;
            reject(error)
        }
    }else{
        resolve(finallyFn)
    }
}



PromiseB.deferred = function() {
    let defer = {};
    defer.promise = new PromiseB((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}
module.exports = PromiseB;

