const { performance } = require('perf_hooks');

// const performWithTiming = async(logLabel, fn) => {
//     const start = performance.now();
//     const result = await fn();
//     const duration = performance.now() - start;

//     console.log(`${logLabel}: ${duration}ms\n`);
//     return result;
// };

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
exports.performWithTiming = performWithTiming;