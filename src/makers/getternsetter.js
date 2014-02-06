(function(){

	var makeSettable= function(target, prop, opts){
		var setterName= 'set'+prop[0].toUpperCase() + prop.substring(1);
		if(typeof target[prop] != 'function' && !target[setterName]){
			target[setterName]= function(value){

				if(opts.filterIn){
					value= opts.filterIn(prop, value);
					if(value !== void 0){
						target[prop]= value;
					}
				}else{
					target[prop]= value;
				}
				return target;
			}
		}
	};

	var makeGettable= function(target, prop, opts){
		var getterName= 'get'+prop[0].toUpperCase() + prop.substring(1);
		if(typeof target[prop] != 'function' && !target[getterName]){
			target[getterName]= function(){
				if(opts.filterOut){
					return opts.filterOut(prop, target[prop]);
				}
				return target[prop];
			}
		}
	};

	make.setAndGetable= function(target, options){

		options= options || {};
		options.specificOnly= options.specificOnly || false,
		options.setter= options.setter || true,
		options.getter= options.getter || true;
		options.filterIn= options.filterIn || false;
		options.filterOut= options.filterOut || false;
		options.protected= options.protected || true;

		var i= null;

		for(i in target){
			if(target.hasOwnProperty(i)){
				if(options.setter){
					makeSettable(target, i, options);
				}
				if(options.getter){
					makeGettable(target, i, options);
				}
				if(options.protected){
					Object.defineProperty(target, i, {
		                enumerable: false,
		                configurable: false,
		                //writable: false,
		                //value: target[i],
		                set: function(val){
		                	var setter= 'set'+i[0].toUpperCase()+i.substring(1);
		                	if(target[setter] && typeof target[setter] == 'function'){
		                		console.log(this);
			                	return false;//target[setter](val);
			                }
			                return false;
		                }
		            });
				}
			}
		}

		if(options.setter && !target.set && !options.specificOnly){
			target.set= function(prop, val){
				//target[prop]= val;
				target['set'+(prop[0].toUpperCase()+prop.substring(1))](val);
			}
		}

		if(options.getter && !target.get && !options.specificOnly){
			target.get= function(prop){
				//return target[prop];
				return target['get'+(prop[0].toUpperCase()+prop.substring(1))]();
			}
		}
	};

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
	//getternsetter.js
})();