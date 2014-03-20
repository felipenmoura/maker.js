make.throttle= function(target, options){

    if(typeof target != 'object' && typeof target != 'function'){
        return console.error('throttle:throttle maker requires a function or an object as target(the first argument). All the methods will be treated as throttles. The second argument(options) accepts "methods" as an array with the names of methods you want to become throttle.');
    }

    if(options === void 0){
        options= {};
    }

    options.distance= options.distance || 100; // mileseconds

    var methods= options.methods;

    if(methods){
        methods= methods.length && typeof methods == 'object'? methods: [methods];
    }

    var list= methods || Object.keys(target),
        fn= null,
        i= 0,
        l= list.length,
        dist = options.distance,
        lastExecution = new Date((new Date()).getTime() - dist);

    if(typeof target == 'object'){
        for(; i<l; i++){
            if(typeof target[list[i]] == 'function'){
                fn= list[i];
                target[fn]= makeThrottle(target[fn]);
            }
        }
    }else{
        // is a function
        return makeThrottle(target);
    }

    function makeThrottle(fn) {
        return function() {
            var t= this == window? target: this;
            if ((lastExecution.getTime() + dist) <= (new Date()).getTime()) {
                lastExecution = new Date();
                return fn.apply(t, arguments);
            }
        };
    };

    return makeThrottle(target, options);
};