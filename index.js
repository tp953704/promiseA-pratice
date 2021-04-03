function PromiseZ(){
    this.state = ""
}
PromiseZ.deferred = function() {
    let defer = {};
    defer.promise = new PromiseZ((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}
module.exports = PromiseZ;