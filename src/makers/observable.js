(function(){


    /**
     * Each observable element extends observer.
     *
     * To trigger events to all pkg listeners, use:
     * __privileged.observable.trigger('trigger', data);
     */
    Observer= function(observed, observerOpts){

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
                trigger= self.observerving[trigger] || [];

                while(i < trigger.length){
                    if(trigger[i] === obj){
                        return i;
                    }
                    i++;
                }
                return -1;
            };

        // preparing the list with its default object
        self.observerving= {"*": []};

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
                if(!self.observerving[trigger]){
                    self.observerving[trigger]= [];
                }
                self.observerving[trigger].push(fn);
            }else{
                self.observerving['*'].push(fn);
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
            self.observerving[trigger].splice(indexOf(trigger, fn), 1);
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

            list= (self.observerving[trigger])? self.observerving[trigger]: [];
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

        return this;
    };
    
    make.observable= function(observerOpts){

        CLASSES.Observer.apply(this, [this, observerOpts]);

        return this;
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