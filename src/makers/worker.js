make.worker= function(target, options){

	if(typeof target != 'object' && typeof target != 'function'){
		return console.error('worker:Worker maker requires a function or an object as target(the first argument). All the methods will be treated as workers, but you can pass in the second argument(options), the property "methods" with an array with the names of methods you want, only they will become workers.');
	}

	options= options || {};
	var methods= options.methods;

	if(methods){
		methods= methods.length && typeof methods == 'object'? methods: [methods];
	}

	var list= methods || Object.keys(target),
		oTarget= target,
		fn= null,
		i= 0,
		l= list.length;

	if(typeof target == 'object'){
		for(; i<l; i++){
			if(typeof target[list[i]] == 'function'){
				fn= list[i];
				target[fn]= makeWorker(target[fn]);
			}
		}
	}else{
		return makeWorker(target);
	}

	function makeWorker(func){

		var fn= func.toString();

		fn= " self.onmessage = function(e) { \n self.postMessage((" + fn;
		fn+= ").apply(self, e.data))};\n ";

		if(fn.match(/document|window|body/)){
			// still...the function may try to access dom in other ways :/
			console.warn('worker:Function passed to make.worker tries to access DOM elements. The function will work, but will not be a worker');
			return fn;
		}

	    function createWorker(fn){
			var blob = new Blob([fn], {type: 'application/javascript'});

			var worker = new Worker(window.URL.createObjectURL(blob));
		    worker.onmessage = function(e) {
		      func.workerFinished(e.data);
		      window.URL.revokeObjectURL(blob);
		    }
		    return worker;
	    };

		return function(){
			var args= Array.prototype.slice.call(arguments, 0);

			if(typeof args[args.length-1] == 'function'){
				func.workerFinished= args.pop();
			}

			var worker= createWorker(fn);

			worker.postMessage(args);
		};
	};
	return target;
};