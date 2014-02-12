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

				if(typeof target[i] == 'function'){
					continue;
				}

				(function(target, i){

					var value= target[i];
					var name= i[0].toUpperCase() + i.substring(1);

					var oSet= target['set'+name] || function(){};
					target['set'+name]= function(val){
						var tmp= null;
						oSet(val);
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

					var oGet= target['get'+name] || function(){};
					target['get'+name]= function(){
						value= oGet()||value;
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

					target.gettable= options.getter? true: false;
					target.settable= options.setter? true: false;


				})(target, i);
			}
		}

		if(options.setter && !target.set && !options.specificOnly){
			target.set= function(prop, val){
				var i= null;
				if(typeof prop == 'object'){
					for(i in prop){
						if(prop.hasOwnProperty(i)){
							target['set'+i[0].toUpperCase() + i.substring(1)](prop[i]);
						}
					}
				}else{
					target['set'+(prop[0].toUpperCase()+prop.substring(1))](val);
				}
				return target;
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