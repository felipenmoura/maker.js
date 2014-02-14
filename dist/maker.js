
make= {};
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

			window.clearTimeout(timeout);
			timeout= setTimeout(function(){
				fn.apply(target, args);
			}, options.distance);
		};
	};

	return target;
};

/**
 * This method offers the feature of making objects indexable.
 * By being indexable, such objects will have extra methods, like find, search,
 * locate, getAt and locateLike.
 * 
 * ```javascript
 *      makes given objects indexables with Indexable methods
 *      var o= {
 *        a: {
 *          b: { d: [11, 22, 33]},
 *          c: { e: 'algo' }
 *        },
 *        f: { g: { h: { i: { j:{ k: { l:{ m: "felipe" }}}}}}},
 *        n: 'foo',
 *        o: [
 *          { p: 'A longer text comes here', q: 'Something else'},
 *          { r: 'Another text comes', s: 'yeah!'},
 *          { t: 'And here, could be a loren ipsum!', u: "just some bla bla bla"},
 *          { v: "ok, that's it...", x: 'x files'},
 *          { y: 'yah, baby, yeah!', z: "zzzzzzzz..."}
 *        ]
 *      };
 *      make.indexable(o);
 *      console.log( o.find('algo') );
 *      console.log( o.find('22') );
 *      console.log( o.find('felipe') );
 *      console.log( o.find('foo') );
 *      console.log( o.findLike('loren') );
 *      console.log( o.findLike("that's") );
 *      console.log( o.findLike(/bla {0,2}/));
 *      console.log( o.locate('p') );
 *      console.log( o.locate('k') );
 *      console.log( o.locate('x') );
 *      console.log( o.locateLike('P') );
 * ```
 * 
 * @method indexable
 * @param object The object to become indexable {Object}
 */
make.indexable= function(obj){

    if(!obj || typeof obj != 'object'){
        return console.error('indexable:Method makeIndexable expects first argument to be an Object');
    }

    /**
     * Indexable class.
     * This class adds useful methods to objects that extend it.
     * @class Indexable
     */
    function Indexable(){
        var self= this;

        var castEl= function(cur, i){
            i= i || '';
            if(typeof cur == 'object' && cur.length){
                i= '['+i+']';
            }else{
                i= '.'+i;
            }
            return i;
        };

        /**
         * Returns the path for the given value, or false if it was not found
         * in object.
         * 
         * @method find
         * @param search The niddle to be found in the haystack {mixed}
         * @param options An object with options for the method
         * - lookingForKey: in case you want to find a key(locate is an alias){Boolean}
         * - regEx: if your search is a regular expression{boolean}
         * @return {String}
         */
        this.find= function(search, opts, cur, path){

            if(search === void 0){
                return console.error('indexable:Method find expected one argument.');
            }

            path= path || [];
            cur= cur || this || self;
            opts= opts || {};
            var i= null,
                found= false,
                valueFound= void 0;

            var compare= function(target, key, search){

                var val= null,
                    oSearch= search;

                if(opts.regEx){
                    if(!(search instanceof RegExp)){
                        search= new RegExp(search, 'i');
                    }
                }else{
                    search= new RegExp(search, '');
                }
                if(opts.lookingForKey){
                    val= key;
                }else{
                    val= target[key];
                }
                val= val.valueOf() || '';

                try{
                    if( (val.match && val.match(search)) || val == oSearch ){
                        return true;
                    }
                }catch(e){
                    console.warn('compare', 'A problem occurred when trying to compare values. Possible error with a regExp, perhaps?', e);
                }
                return false;
            };

            for(i in cur){
                if(cur.hasOwnProperty(i)){
                    if( compare(cur, i, search) ){
                        path.push(castEl(cur, i));
                        valueFound= cur[i];
                        found= true;
                        break;

                    }else{
                        if(cur[i] && typeof cur[i] == 'object'){
                            path.push(castEl(cur, i));
                            found= self.find(search, opts, cur[i], path);
                            if(found){
                                return found;
                            }else{
                                path.pop();
                            }
                        }
                    }
                }
            }

            if(found && path && path.length){
                if(opts.returnPath !== false){
                    return path.join('').replace('.', '');
                }else{
                    return valueFound;
                }
            }
            return false;
        };

        /**
         * Locate an item in your object by the key, returning its path.
         * This method is an alias to: find(item, {lookingForKey: true})
         * 
         * @method locate
         * @param item The name of the key to be found
         * @return {String}
         */
        this.locate= function(item){
            return this.find(item, {
                lookingForKey: true
            });
        };

        /**
         * Find the first entry in the object, looking for it in its values,
         * that matches the regular expression, or has the search value as
         * part of it.
         * This method is an alias to: find(item, {regEx: true})
         * 
         * @method search
         * @param search The name of the key to be found
         * @return {String}
         */
        this.search= this.findLike= function(search){
            return this.find(search, {
                regEx: true
            });
        };

        /**
         * Locate an item in your object by the key, returning its path.
         * The difference here is that it returns the first key that matches
         * the regularExpression, or has the search value as part of the key.
         * This method is an alias to: find(item, {lookingForKey: true, regEx: true})
         * 
         * @method locateLike
         * @param item The name, part of the name, or regular expression to be found in keys.
         * @return {String}
         */
        this.locateLike= function(item){
            return this.find(item, {
                lookingForKey: true,
                regEx: true
            });
        };

        this.getAt= function(path){
            var peaces= path.replace(/\[/g, '.').replace(/\]/g, '').split('.'),
                l= peaces.length,
                target= this;

            for(var i=0; i<l; i++){
                if(target[peaces[i]] === void 0){
                    return void 0;
                }
                target= target[peaces[i]];
            }
            return target;
        };

        this.indexable= true;

    }

    if(!obj.indexable){
        if(typeof obj == 'function'){
            Indexable.apply(obj.prototype);
            return obj;
        }else{
            Indexable.apply(obj);
        }
    }

};
make.model= function(objOrFn){
    objOrFn= make.observable(objOrFn);
    objOrFn= make.indexable(objOrFn);

    

    return objOrFn;
};
(function(){


    /**
     * Each observable element extends observer.
     *
     * To trigger events to all pkg listeners, use:
     * __privileged.observable.trigger('trigger', data);
     */
    var Observer= function(observed, observerOpts){

        // tries to store the name of the object being observed
        if(observed === void 0){
            observed= this;
        }

        observerOpts= observerOpts || {};

        var triggered= {};

        observed= observed.name || observed.id || observed.toString().substring(0, 30);

        var observerOptions= {
                recursive: false
            };

        // Starting private variables
        var self= this,
            originalSet= null,
            indexOf= function(trigger, obj){
                var i = 0;
                trigger= self.observing[trigger] || [];

                while(i < trigger.length){
                    if(trigger[i] === obj){
                        return i;
                    }
                    i++;
                }
                return -1;
            };

        // preparing the list with its default object
        self.observing= {"*": []};

        /**
         * Starts listening to events
         *
         * This method allows you to start listening to a given trigger, or
         * to anything that happens to the current observable object.
         *
         * @method on
         * @param String The trigger your listener will be listening for(default *).
         * @param Function The listener callback.
         * @example
         *
         *      zaz.use(function(pkg){
         *
         *          var o = pkg.context.user; // contexts are observable
         *          o.on('lang', function(newLang){
         *              // everytime lang is changed in user context
         *              alert('The lang in user context was changed to ' + newLang);
         *          });
         *
         *      });
         */
        this.on= function(trigger, fn){
            if(!fn){
                fn= trigger;
            }
            if(typeof fn != 'function'){
                throw new Error('observer:Invalid listener!\nWhen adding listeners to observables, it is supposed to receive a function as callback.');
            }
            if(typeof trigger == 'string'){
                if(!self.observing[trigger]){
                    self.observing[trigger]= [];
                }
                self.observing[trigger].push(fn);
            }else{
                self.observing['*'].push(fn);
            }
            return this;
        };

        /**
         * Registers a listener to work only once.
         *
         * This listener will be executed and then be removed from the listeners list.
         * It could be seen as an alias for on() call that, inside, calls the off method.
         *
         * @method once
         * @param [String] The trigger to be listened to(defult *).
         * @param Function The listener to be called.
         * @example
         *
         *      zaz.use(function(pkg){
         *
         *          var o = pkg.context.user; // contexts are observable
         *          o.once('lang', function(newLang){
         *              // will happen only the first time when lang is changed in user context
         *              alert('The lang in user context was changed to ' + newLang);
         *          });
         *
         *      });
         */
        this.once= function(trigger, fn){
            fn.once= true;
            this.on(trigger, fn);
            return this;
        };

        /**
         * This method, differently from _on_ and _once_, will trigger
         * your callback:
         * - when the given trigger is set;
         * - isntantly, in case it was already triggered, with the data from the LAST call
         *
         * This method will *only call your callback once*.
         *
         * @method onceAt
         * @param trigger The event to be listened to
         * @param callback The function to be triggered
         * @chainable
         */
        this.onceAt= function(trigger, fn){
            if(triggered[trigger] !== void 0){
                try{
                    fn(triggered[trigger]);
                }catch(e){
                    console.error('observer:A listener produced an error! "atOnce" trigger '+trigger, e, fn);
                }
            }else{
                this.once(trigger, fn);
            }
            return this;
        };

        /**
         * This method, differently from _on_ and _once_, will trigger
         * your callback:
         * - when the given trigger is set;
         * - isntantly, in case it was already triggered, with the data from the LAST call
         *
         * This method will call your callback *everytime* the trigger is used.
         *
         * @method at
         * @param trigger The event to be listened to
         * @param callback The function to be triggered
         * @chainable
         */
        this.at= function(trigger, fn){
            if(triggered[trigger] !== void 0){
                try{
                    fn(triggered[trigger]);
                }catch(e){
                    console.error('observer:A listener produced an error! "at" trigger '+trigger, e, fn);
                }
            }
            this.on(trigger, fn);
            return this;
        };

        /**
         * Stops listening to a given trigger.
         *
         * @method off
         * @param [String] The trigger the listener was listening to.
         * @param Function The listener itself.
         * @chainable
         */
        this.off= function(trigger, fn){
            if(!trigger){
                throw new Error('observer:Invalid function passed to "off" method');
            }
            if(typeof trigger == 'function'){
                fn= trigger;
                trigger= '*';
            }
            self.observing[trigger].splice(indexOf(trigger, fn), 1);
            return this;
        };

        /**
         * Set properties to the observable object, triggering its event.
         *
         * By default, any property set via observable.set will trigger an event
         * with its name.
         *
         * @method set
         * @extends Pakage.Observable
         * @param String The name of the property to be set.
         * @param Mixed The value to be stored at the property.
         * @chainable
         */
        originalSet= this.set;
        this.set= function(prop, val){
            if(originalSet){
                originalSet.apply(this, Array.prototype.slice.call(arguments, 0));
            }else{
                this[prop]= val;
            }
            this.trigger(prop, val);
            return this;
        };

        //if(observerOpts.canTrigger){
        /**
         * Triggers events to the current observable listeners.
         *
         * @method trigger
         * @param [String] The trigger key for the event(default *).
         * @param Mixed The data to be sent to listeners.
         * @chainable
         */
        this.trigger= function(trigger, data){

            var i= 0, l= 0, list= [];

            if(data === void 0){
                data= trigger;
                trigger= '*';
            }

            list= (self.observing[trigger])? self.observing[trigger]: [];
            l= list.length;

            for(; i<l; i++){
                try{
                    list[i](data);
                    if(list[i].once === true){
                        this.off(trigger, list[i]);
                    }
                }catch(e){
                    console.error('observer:Failed to execute a function from a listener.\n' +
                                  'Listening to changes on '+trigger+'\n' +
                                  'At '+ observed);
                }
            }

            // also informs listeners from * about the event
            if(trigger != '*'){
                this.trigger('*', data);
            }

            triggered[trigger]= data;

            return this;
        };
        //}

        this.observable= true;

        return this;
    };
    
    make.observable= function(target, observerOpts){

        var i= null;
        observerOpts= observerOpts || {};

        if(target.nodeType){
            // DOM or Event elements are not treatable
            return target;
        }

        if(typeof target == 'object' &&
            observerOpts.recursive !== false &&
            target != make){
            for(i in target){
                if(target[i] && !target[i].observable && typeof target[i] == 'object' && !target[i].length){
                    // is an object, but not null neither array
                    make.observable(target[i], observerOpts);
                }
            }
        }

        Observer.apply(target.prototype || target, [target, observerOpts]);

        return target;
    };

    /**
     * Enabling privileged packages to trigger events on packages
     */
    /*__privileged.extend(function Observable(__protected, observerOpts){

        var self= this,
            PRIVATE= {},
            PUBLIC= {},
            PROTECTED= {},
            STATIC= {};

        //PRIVATE.observable= new CLASSES.Observable();
        CLASSES.Observable.apply(this, [__protected, observerOpts]);

        return this;
    });
    __privileged.observable= new __privileged.Observable();
    */

    /**
     * Extending package so it offers support to observable methods.
     */
    /*pkg.extend(function on(__protected){
        return function(target, fn){
            return __privileged.observable.on(target, fn);
        };
    });
    pkg.extend(function once(__protected){
        return function(target, fn){
            return __privileged.observable.once(target, fn);
        };
    });
    pkg.extend(function off(__protected){
        return function(target, fn){
            return __privileged.observable.off(target, fn);
        };
    });

    // pkg can trigger global events
    pkg.extend(function trigger(__protected){
        return function(target, fn){
            return __privileged.observable.trigger(target, fn);
        };
    });
    */


})();
make.readonly= function(target, options){

    var prop= null

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
(function(){

	make.setAndGetable= function(target, options){

		if(typeof target == 'function'){
			return make.setAndGetable(target.prototype, options);
		}

		options= options || {};
		options.specificOnly= options.specificOnly || false,
		options.setter= options.setter || true,
		options.getter= options.getter || true;
		options.filterIn= options.filterIn || false;
		options.filterOut= options.filterOut || false;
		options.protected= options.protected || true;

		var setFilters= { '*': [] };
		var getFilters= { '*': [] };

		if(options.filterIn){
			setFilters['*'].push(options.filterIn);
		}
		if(options.filterOut){
			getFilters['*'].push(options.filterOut);
		}

		function execList(list, prop, val, oprop){

			var ret= val, prevRet= ret;

			if(list && list.length){
				l= list.length;
				for(i= 0; i<l; i++){
					if(prop === '*'){
						ret= list[i](oprop, ret);
						if(ret === void 0){
							ret= prevRet;
						}
					}else{
						ret= list[i](ret);
						if(ret === void 0){
							ret= prevRet;
						}
					}
				}
			}
			return ret;
		}

		function applyFiltersIn(prop, val){
			
			var ret= val,
				list= setFilters[prop];

			ret= execList(list, prop, val);

			list= setFilters['*'];
			ret= execList(list, '*', ret, prop);

			return ret;
		}

		function applyFiltersOut(prop, val){
			
			var ret= val,
				list= getFilters[prop];

			ret= execList(list, prop, val);

			list= getFilters['*'];
			ret= execList(list, '*', ret, prop);

			return ret;
		}

		var i= null;

		for(i in target){
			if(target.hasOwnProperty(i)){

				(function(target, i){

					var value= target[i];
					var name= i[0].toUpperCase()+i.substring(1);

					if(!target['set'+name]){
						target['set'+name]= function(val){
							var tmp= null;
							
							try{
								tmp= applyFiltersIn(i, val);
							}catch(e){
								// in case any filter throws an error, it will simply not apply the value;
								return target;
							}

							if(tmp !== void 0){
								value= tmp;
							}
							
							return target;
						};
					}

					if(!target['get'+name]){
						target['get'+name]= function(){
							value= applyFiltersOut(i, value);
							return value;
						};
					}

					if(options.protected){
						Object.defineProperty(target, i, {
			                enumerable: false,
			                configurable: false,
			                //writable: false,
			                //value: target[i],
			                set: function(val){
			                	//value= val;
			                	this['set'+name](val);
			                	return this;
			                },
			                get: function(){
			                	return this['get'+name]();
			                }
			            });
					}
				})(target, i);
			}
		}

		if(options.setter && !target.set && !options.specificOnly){
			target.set= function(prop, val){
				//target[prop]= val;
				return target['set'+(prop[0].toUpperCase()+prop.substring(1))](val);
			}
		}

		if(options.getter && !target.get && !options.specificOnly){
			target.get= function(prop){
				//return target[prop];
				return target['get'+(prop[0].toUpperCase()+prop.substring(1))]();
			}
		}


		// filters
		if(!target.addSetterFilter && options.setter){
			target.addSetterFilter= function(prop, fn){

				if(!fn){
					fn= prop;
					prop= '*';
				}

				if(!setFilters[prop]){
					setFilters[prop]= [];
				}
				setFilters[prop].push(fn);
				return target;
			}
		}

		if(!target.addGetterFilter && options.getter){
			target.addGetterFilter= function(prop, fn){
				
				if(!fn){
					fn= prop;
					prop= '*';
				}

				if(!getFilters[prop]){
					getFilters[prop]= [];
				}
				getFilters[prop].push(fn);
				return target;
			}
		}

	};

	/*
	make.settable= function(target){
		return make.setAndGetable(target, {
			getter: false
		});
	};

	make.gettable= function(target){
		return make.setAndGetable(target, {
			setter: false
		});
	};
	*/
	//getternsetter.js
})();
// this file is supposed to offer the make.singleton maker
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
            if ((lastExecution.getTime() + dist) <= (new Date()).getTime()) {
                lastExecution = new Date();
                return fn.apply(target, arguments);
            }
        };
    };

    return target;
};
make.tiable= function(objOrClass){

	function Tiable(){

		var self= this,
			tiedList= {};

		var getId= function(target){
			var targetName= target.name || target.id;

			target._makerData= target._makerData||{};
			if(target._makerData.ref){
				return target._makerData.ref;
			}

			if(!targetName && target.prototype){
				targetName= target.prototype.name || target.valueOf().substring(0, 40);
			}else{
				targetName= (new Date()).getTime();
			}
			//target+= "."+targetProperty;

			target._makerData.ref= targetName;

			return targetName;
		};

		this.tie= function(property, target, targetProperty){

			var targetName;
			targetProperty= targetProperty || '*';

			if(arguments.length === 1){
				target= property;
				property= '*';
			}

			targetName= getId(target);
			if(!tiedList[targetName]){
				tiedList[targetName]= {};
			}

			if(tiedList[targetName][property]){
				// was already tied
				return self;
			}

			tiedList[targetName][property]= {
				target: target,
				prop: targetProperty
			};

			return self;

		};

		function onSet(prop, val){
			var i= null, tmp= null;

			for(i in tiedList){
				if(tiedList[i][prop]){
					// it does have someone tied to it!
					tmp= tiedList[i][prop];
					tmp.target[tmp.prop]= val;
				}else{
					if(tiedList[i]['*']){
						tmp = tiedList[i]['*'];
						tmp.target[prop]= val;
					}
				}
			}
			return val;
		}

		make.setAndGetable(this, {
			//specificOnly: true,
			getter: false,
			filterIn: onSet,
			protected: false
		});

		this.tiable= true;

		this.untie= function(target, prop){
			if(target._makerData && target._makerData.ref){
				if(!prop){
					delete tiedList[target._makerData.ref];
				}else{
					delete tiedList[target._makerData.ref][prop];
				}

			}
		}
	}

	if(!objOrClass || (typeof objOrClass != 'object' && typeof objOrClass != 'function')){
		throw new Error('Invalid type of object of class passed to tiable!');
	}

	if(objOrClass.prototype){
		// is a class
		Tiable.apply(objOrClass.prototype);
		return objOrClass;
	}else{
		// is an object
		Tiable.apply(objOrClass);
	}

	return this;

};
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
			var blob = new Blob([fn]);

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