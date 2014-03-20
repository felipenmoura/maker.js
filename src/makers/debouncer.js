make.debounce= function(target, options){

	if(typeof target != 'object' && typeof target != 'function'){
		return console.error('throttle:throttle maker requires a function, or an object as target(the first argument). All the methods will be treated as throttles. The second argument(options) accepts "methods" as an array with the names of methods you want to become throttle.');
	}

	if(options === void 0){
		options= {};
	}

	options.distance= options.distance || 200; // mileseconds

	var methods= options.methods;

	if(typeof target == 'object'){
		if(methods){
			methods= methods.length && typeof methods == 'object'? methods: [methods];
		}
	}

	var list= methods || Object.keys(target),
		fn= null,
		i= 0,
		l= list.length,
		dist = options.distance,
		timeout= null;

	if(typeof target == 'object'){
		for(; i<l; i++){
			if(typeof target[list[i]] == 'function'){
				fn= list[i];
				target[fn]= makeDebounce(target[fn]);
			}
		}
	}else{
		return makeDebounce(target);
	}

	function makeDebounce(fn) {
		return function() {
			var args= arguments;
			var t= this == window? target: this;

			window.clearTimeout(timeout);
			timeout= setTimeout(function(){
				fn.apply(t, args);
			}, options.distance);
		};
	};

	return target;
};