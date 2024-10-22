const { performance } = require('perf_hooks');

const performWithTiming = (fn, className, methodName) => {
    return function(...args) {
        const start = performance.now();
        return fn.apply(this, args).then(result => {
            const end = performance.now();
            console.log(`\nPerformance for ${className}.${methodName}: ${end - start}ms\n`);
            return result;
        }).catch(error => {
            const end = performance.now();
            console.log(`\nError in ${className}.${methodName}: ${error}\nTime taken: ${end - start}ms\n`);
            throw error;
        });
    };
}

//module.exports = performWithTiming;
module.exports = performWithTiming;