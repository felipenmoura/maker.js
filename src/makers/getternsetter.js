(function(){

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

				(function(target, i){
					var value= target[i];
					var name= i[0].toUpperCase()+i.substring(1);

					target['set'+name]= function(val){
						var tmp= null;
						if(options.filterIn){
							tmp= options.filterIn(i, val);
							if(tmp !== void 0){
								value= tmp;
							}
						}else{
							value= val;
						}
						return target;
					};

					target['get'+name]= function(){
						if(options.filterOut){
							return options.filterOut(i, value);
						}
						return value;
					};

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