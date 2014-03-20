
make= {};

<<<<<<< HEAD
make.cleanUpProperties= function(obj, doNotRemoveMethods){

    var i = null,
        newObj= {};

    for(i in obj){
        if(i.substring(0,6) != '__make'){
            if(doNotRemoveMethods || typeof obj[i] != 'function'){
                if(typeof obj[i] == 'object'){
                    newObj[i]= make.cleanUpProperties(obj[i], doNotRemoveMethods);
                }else{
                    newObj[i]= obj[i];
                }
            }
        }
    }

    return newObj;
}
=======
(function(scope){

    function definePropertyWorks() {
        try {
            return 'x' in Object.defineProperty({}, 'x', {});
        } catch (e) {
            return false
        }
    }

    if(!definePropertyWorks()){
        // the blood ie8!!!
        if(window.console){
            console.warn('The browser does not support defineProperty correctly (it is an IE8, the ONLY browser that has this problem)\n'+
                         'WARNING: Setters and getters will work as usual, but FILTERS will NOT be applied unless you use the getProp and setProp methods!\n'+
                         'This means that "obj.data= 123;" will NOT trigger setter filters, although "obj.setData(123);" will.  ');
        }
        
        Object.defineProperty= function(obj, prop, desc) {
            //obj[prop] = descriptor.value;
            obj[prop] = desc.value;
            try{
                if(obj.__defineGetter__){
                    if ("get" in desc) obj.__defineGetter__(prop, desc.get);
                    if ("set" in desc) obj.__defineSetter__(prop, desc.set);
                }
            }catch(e){
                
            }
        };
    }

})(this);

>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce
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
            if(typeof cur == 'object' && cur.length || i.match(/\W/) ){
                if(isNaN(i)){
                    i= '"'+i+'"';
                }
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
                val= val.valueOf? val.valueOf() : '';

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
<<<<<<< HEAD
                if(!cur.nodeType && cur.hasOwnProperty(i) && typeof cur[i] != 'function'){
=======
                if(cur.hasOwnProperty(i) && typeof cur[i] != 'function'){
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce
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
                    return path.join('');//.replace('.', '');
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

        this.getAt= function(path, node){
            var peaces= path.replace(/\[/g, '.').replace(/\]/g, '').split('.'),
                l= peaces.length,
                target= node || this;

            for(var i=0; i<l; i++){
                if(target[peaces[i]] === void 0){
                    return void 0;
                }
                target= target[peaces[i]];
            }
            return target;
        };

        this.query= function(prop, valueLike, start, all){
            if(typeof this != 'object' || this.length === void 0){
                console.warn('Indexable must be an array to allow queries to execute');
                return target;
            }
            var i= start || 0,
                l= this.length,
                item= null,
                resultSet= [];

            for(; i<l; i++){
                //console.log(this[i]);
                item= this.find(valueLike, {
                    regEx: true,
                    returnPath: false
                }, this[i]);

                if(item){
                    if(all){
                        resultSet.push(this[i]);
                    }else{
                        return i;
                    }
                }
            }
            return resultSet;
        }

        this.queryAll= function(prop, valueLike, start){
            return this.query(prop, valueLike, start, true);
        }

<<<<<<< HEAD
        //this.indexable= true;
        this.__makeData.indexable= true;
=======
        this.indexable= true;
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce

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
(function(){

    var modelsList= {};

    make.model= function(model){

        var Model= function(){},
            i= null;

        for(i in model){
            if(model.hasOwnProperty(i)){
                Model.prototype[i]= model[i];
            }
        }

        Model= make.tiable(Model);

        model.identifier= (new Date()).getTime();
        modelsList[model.identifier]= [];

        model.create= function(){
            
            var m= new Model();
            /*for(i in model){
                if(model.hasOwnProperty(i)){
                    m[i]= model[i];
                }
            }*/
            
            //make.observable(m);
            //make.setAndGettable(m);
            //console.log(m);
            //make.tiable(m);

            m.addSetterFilter(function(prop, val){
                m.trigger(prop, val);
            });
            
            if(typeof m.oncreate == 'function'){
                m.oncreate.apply(m, Array.prototype.slice.call(arguments, 0));
            }

            modelsList[model.identifier].push(m);

            return m;
        }
    };

    /* Collections */
    make.collection= function(model){
        
        var oModel= model;

        function Collection(model){

            var curPointer= 0,
                collectionId= model.identifier;

            // making it indexable
            make.indexable(modelsList[collectionId]);
            
            this.getLength= function(){
                return modelsList[collectionId].length;
            }

            this.first= function(){
                return modelsList[collectionId][0] || false;
            }

            this.last= function(){
                return modelsList[collectionId][ this.getLength() -1 ] || false;
            }

            this.goTo= function(idx){
                if(idx < 0){
                    idx= 0;
                }else if(idx >= this.getLength()){
                    idx= this.getLength() -1;
                }
                curPointer= idx;
                return modelsList[collectionId][idx];
            };

            this.current= function(){
                return modelsList[collectionId][curPointer] || false;
            }

            this.currentIdx= function(){
                return curPointer;
            }
            /**
             *
             *  while(x = people.next()){
             *      console.log(x.name);
             *  }
             */
            this.next= function(){
                var ret= modelsList[collectionId][curPointer] || false;
                if(ret){
                    curPointer++;
                }
                return ret;
            }
            /**
             *
             *  while(x = people.prev()){
             *      console.log(x.name);
             *  }
             */
            this.prev= function(){
                var ret= modelsList[collectionId][curPointer] || false;
                if(ret){
                    curPointer--;
                }
                return ret;
            }

            this.reset= function(){
                curPointer= 0;
            }

            this.get= function(at){
                return modelsList[collectionId][at] || false;
            }

            this.list= function(from, to){
                if(from){
                    if(to){
                        return modelsList[collectionId].slice(from, to);
                    }else{
                        return modelsList[collectionId].slice(from);
                    }
                }else{
                    return modelsList[collectionId].slice();
                }
            };

            /**
             *
             *  while(cur = people.query('name', 'son')){
             *      console.log(cur.name);
             *  }
             */
            this.query= function(prop, valueLike){
                ret= modelsList[collectionId].query(prop, valueLike, curPointer);
                if(ret !== false){
                    curPointer= ret;
                    ret= this.get(ret);
                    curPointer++;
                }
                return ret;
            };

            this.queryAll= function(prop, valueLike){
                return modelsList[collectionId].queryAll(prop, valueLike);
            };
<<<<<<< HEAD

            this.__makeData.tiable= true;
=======
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce
        }

        return new Collection(model);
    };    

})();

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

        // Starting private variables
        var self= this,
            originalSet= null,
            indexOf= function(trigger, obj){
                var i = 0;
<<<<<<< HEAD
                trigger= self.__makeData.observing[trigger] || [];
=======
                trigger= self.__makeObserving[trigger] || [];
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce

                while(i < trigger.length){
                    if(trigger[i] === obj){
                        return i;
                    }
                    i++;
                }
                return -1;
            };

        // preparing the list with its default object
<<<<<<< HEAD
        if(!self.__makeData){
            self.__makeData= {};
        }
        self.__makeData.observing= {"*": []};
=======
        self.__makeObserving= {"*": []};
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce

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
         *          var o = pkg.context.user; // contexts are observable
         *          o.on('lang', function(newLang){
         *              // everytime lang is changed in user context
         *              alert('The lang in user context was changed to ' + newLang);
         *          });
         *
         */
        this.on= function(trigger, fn){
            if(!fn){
                fn= trigger;
            }
            if(typeof fn != 'function'){
                throw new Error('observer:Invalid listener!\nWhen adding listeners to observables, it is supposed to receive a function as callback.');
            }
            if(typeof trigger == 'string'){
<<<<<<< HEAD
                if(!self.__makeData.observing[trigger]){
                    self.__makeData.observing[trigger]= [];
                }
                self.__makeData.observing[trigger].push(fn);
            }else{
                self.__makeData.observing['*'].push(fn);
=======
                if(!self.__makeObserving[trigger]){
                    self.__makeObserving[trigger]= [];
                }
                self.__makeObserving[trigger].push(fn);
            }else{
                self.__makeObserving['*'].push(fn);
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce
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
<<<<<<< HEAD
            self.__makeData.observing[trigger].splice(indexOf(trigger, fn), 1);
=======
            self.__makeObserving[trigger].splice(indexOf(trigger, fn), 1);
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce
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
        /*originalSet= this.set;
        this.set= function(prop, val){
            if(originalSet){
                originalSet.apply(this, Array.prototype.slice.call(arguments, 0));
            }else{
                this[prop]= val;
            }
            this.trigger(prop, val);
            return this;
        };*/

<<<<<<< HEAD
        if(!observerOpts.onlyByTrigger){
            if(!this.settable){
                make.setAndGettable(this);
            }

            this.addSetterFilter(function(prop, val){
                if(observerOpts && observerOpts.recursive && typeof val == 'object' && !val.length){
                    make.observable(val, observerOpts);
                }
                self.trigger(prop, val);
                return val;
            });
        }
=======
        if(!this.settable){
            make.setAndGettable(this);
        }

        this.addSetterFilter(function(prop, val){
            if(observerOpts && observerOpts.recursive && typeof val == 'object' && !val.length){
                make.observable(val, observerOpts);
            }
            self.trigger(prop, val);
            return val;
        });
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce

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

<<<<<<< HEAD
            list= (self.__makeData.observing[trigger])? self.__makeData.observing[trigger]: [];
=======
            list= (self.__makeObserving[trigger])? self.__makeObserving[trigger]: [];
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce
            l= list.length;

            for(; i<l; i++){
                try{
                    list[i](data);
                    if(list[i].once === true){
                        this.off(trigger, list[i]);
                    }
                }catch(e){
                    var where= (observed.name || (observed.prototype? observed.prototype.name: ''));
                    console.error('observer:Failed to execute a function from a listener.\n' +
                                  'Listening to changes on "'+trigger+'"\n' +
                                  (where? 'At '+ where: '')+ '\n'+
                                  'with the message: ' + e.message, e);
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

<<<<<<< HEAD
        if(!this.__makeData.observable){
            this.__makeData.observable= true;
=======
        if(!this.__makeObservable){
            this.__makeObservable= true;
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce
        }

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
<<<<<<< HEAD
                if(target[i] && !(target[i].__makeData && target[i].__makeData.observable) && typeof target[i] == 'object' && !target[i].length){
=======
                if(target[i] && !target[i].__makeObservable && typeof target[i] == 'object' && !target[i].length){
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce
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
(function(){
    make.persistent= function makePersistent(target, id, bridge){

        if(typeof id != 'string' && !bridge){
            bridge= id;
            id= '__makePersistentGenericObject';
        }

        var name= target.prototype? target.prototype.name || target.name : id;

        if(!bridge){
            bridge= window.localStorage;
        }

        if(!target.__makeSetAndGettable){
            target= make.setAndGettable(target);
        }

        target.save= function(){
            bridge.setItem(name, JSON.stringify(target.__makeData.setGetValue));
        };
        target.load= function(cb){
            // works with both sync and async bridges
            var ret= bridge.getItem(name, function(ret){
                if(typeof ret == 'string'){
                    try{ret= JSON.parse(ret);}catch(e){};
                }
                target.set(ret);
                if(cb && typeof cb == 'function'){
                    try{cb(ret);}catch(e){}
                }
            });
            if(ret){
                if(typeof ret == 'string'){
                    try{ret= JSON.parse(ret);}catch(e){};
                }
                target.set(ret);
                if(cb && typeof cb == 'function'){
                    try{cb(ret);}catch(e){}
                }
            }
            return target;
        }

        target.addSetterFilter(make.debounce(function(){
            target.save();
        }, {distance: 200}));

        target.load();

        target.__makeData.Persistent= true;
        //target.save();

        return target;
    };
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
// TODO: there is a problem with making prototypes settable and its references.

(function(){

	make.setAndGettable= function(target, options){

		options= options || {};

		if(typeof target == 'function'){
			options.isPrototypeOf= target;
			return make.setAndGettable(target.prototype, options);
		}

		options.specificOnly= options.specificOnly || false,
		options.setter= options.setter || true,
		options.getter= options.getter || true;
		options.filterIn= options.filterIn || false;
		options.filterOut= options.filterOut || false;
		options.protected= options.protected || true;
		options.allowNewSetters= options.allowNewSetters || true;
<<<<<<< HEAD

		var oTarget= target;
=======
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce

		var setFilters= { '*': [] };
		var getFilters= { '*': [] };

		if(options.filterIn){
			setFilters['*'].push(options.filterIn);
		}
		if(options.filterOut){
			getFilters['*'].push(options.filterOut);
		}

		function execList(list, prop, val, oprop){

			var ret= val, prevRet= ret, l= 0;

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

<<<<<<< HEAD
		function verifySetAndGetValue(that){
			if(!that.__makeData.setGetValue){

				if(make.__isIE8){
					// need to be treated differently
					//var DOMElRef= document.createElement('makeDOMElement');
					//that.__makeSetGetDOMWorkAroundForIE8= DOMElRef;

				}else{}

				that.__makeData.setGetValue= {};
			}
		}

		function createSetterAndGetter(target, i, isPrototypeOf){
			
			var value= target[i];
			var name= i[0].toUpperCase() + i.substring(1);

			if(!target.__makeData){
				target.__makeData= {};
				target.__makeData.setGetValue= {};
			}

			if(!target['set'+name]){
				target['set'+name]= function(val){

					verifySetAndGetValue(this);
=======
		function createSetterAndGetter(target, i, isPrototypeOf){
			
			var value= target[i];
			var name= i[0].toUpperCase() + i.substring(1);

			if(!target['set'+name]){
				target['set'+name]= function(val){

					if(!this.__makeSetGetValue){
						this.__makeSetGetValue= {};
					}
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce

					var tmp= null;
					
					try{
						tmp= applyFiltersIn(i, val);
					}catch(e){
						// in case any filter throws an error, it will simply not apply the value;
						return target;
					}

					if(tmp !== void 0){
						if(options.isPrototypeOf){
<<<<<<< HEAD
							this.__makeData.setGetValue[i]= tmp;
						}else{
							value= tmp;
						}
					}
					
					return this;
				};
			}

			if(!target['get'+name] && name.substring(0, 6) != '__make'){
				target['get'+name]= function(){
					var v= null;
					if(options.isPrototypeOf){
						verifySetAndGetValue(this);
						
						v= this.__makeData.setGetValue[i];
					}else{
						v= value;
					}
					v= applyFiltersOut(i, v);

					if(v === void 0 && value !== void 0){
						return value;
					}

					return v;
				};
			}

=======
							this.__makeSetGetValue[i]= tmp;
						}else{
							value= tmp;
						}
					}
					
					return this;
				};
			}

			if(!target['get'+name] && name.substring(0, 6) != '__make'){
				target['get'+name]= function(){
					var v= null;
					if(options.isPrototypeOf){
						if(!this.__makeSetGetValue){
							this.__makeSetGetValue= {};
						}
						v= this.__makeSetGetValue[i];
					}else{
						v= value;
					}
					v= applyFiltersOut(i, v);

					if(v === void 0 && value !== void 0){
						return value;
					}

					return v;
				};
			}

>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce
			if(name.substring(0, 6) != '__make'){
				if(options.protected){
					try{
						Object.defineProperty(target, i, {
			                enumerable: true,
			                configurable: true,
			                //writable: true,
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
					}catch(e){
						// could not define a property...
						// we shall ignore it, because it is probably happening
						// because it was already defined.
<<<<<<< HEAD
					}
				}
				
				if(typeof i == 'string' || !isNaN(i)){
					if(!target.__makeData.setGetValue){
						target.__makeData.setGetValue= {};
					}
					target.__makeData.setGetValue[i]= oTarget[i];
				}
=======
					}
				}

>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce
			}
		}

		var i= null;

		for(i in target){
			if(typeof target[i] != 'function'){
				createSetterAndGetter(target, i, options.isPrototypeOf);
			}
		}

		if(options.setter && !options.specificOnly){
			target.set= function(prop, val){
				var i= null,
					name= '';

				if(typeof prop == 'object'){
					for(i in prop){
						if(prop.hasOwnProperty(i)){
							name= 'set'+(i[0].toUpperCase() + i.substring(1));
							if(!this[name] && (options.allowNewSetters || !options.protected)) {
								createSetterAndGetter(target, i, options.isPrototypeOf);
							}
							this[name](prop[i]);
						}
					}
					return this;
				}else{
					name = 'set'+(prop[0].toUpperCase()+prop.substring(1));
					if(!this[name] && (options.allowNewSetters || !options.protected)) {
						createSetterAndGetter(target, prop, options.isPrototypeOf);
						return this[name](val);
					}
					return target[name](val);
				}
			}
		}

		if(options.getter && !options.specificOnly){
			target.get= function(prop){
				var name= 'get'+(prop[0].toUpperCase()+prop.substring(1));
				
				if(!target[name]){
					createSetterAndGetter(target, prop, options.isPrototypeOf);
				}
				return this[name]();
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
				return this;
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
				return this;
			}
		}

<<<<<<< HEAD
		target.__makeData.setAndGettable= true;
=======
		target.__makeSetAndGettable= true;
>>>>>>> 85ab52998aba474dc464690e27aba3b0f1947cce

		return target;

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
            var t= this == window? target: this;
            if ((lastExecution.getTime() + dist) <= (new Date()).getTime()) {
                lastExecution = new Date();
                return fn.apply(t, arguments);
            }
        };
    };

    return makeThrottle(target, options);
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

//		debugger;
		make.observable(this/*, {
			//specificOnly: true,
			getter: false,
			filterIn: onSet,
			protected: false
		}*/);

		this.addSetterFilter(onSet);

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
		throw new Error('Invalid type of object or class passed to tiable!');
	}

	if(typeof objOrClass == 'function' && objOrClass.prototype){
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