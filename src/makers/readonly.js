make.readonly= function(target, options){

    if(typeof target != 'object'){
        return console.error('throttle:throttle maker requires an object as target(the first argument). All the methods will be treated as throttles. The second argument(options) accepts "methods" as an array with the names of methods you want to become throttle.');
    }

    if(options === void 0){
        options= {};
    }

    for(prop in target){
        if(target.hasOwnProperty(prop)){
            Object.defineProperty(target, prop, {
                enumerable: true,
                configurable: false,
                writable: false,
                value: target[prop]
            });
        }
    }

    return target;
};