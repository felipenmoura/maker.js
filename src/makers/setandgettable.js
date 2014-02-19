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
			if(typeof target[i] != 'function'){

				(function(target, i, isPrototypeOf){
					//debugger;
					var value= target[i];
					var name= i[0].toUpperCase() + i.substring(1);

					if(!target['set'+name]){
						target['set'+name]= function(val){

							if(!this.__makeSetGetValue){
								this.__makeSetGetValue= {};
							}

							var tmp= null;
							
							try{
								tmp= applyFiltersIn(i, val);
							}catch(e){
								// in case any filter throws an error, it will simply not apply the value;
								return target;
							}

							if(tmp !== void 0){
								if(options.isPrototypeOf){
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
							return v;
						};
					}

					if(options.isPrototypeOf){
						
					}

					if(options.protected && name.substring(0, 6) != '__make'){
						Object.defineProperty(target, i, {
			                enumerable: true,
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
				})(target, i, options.isPrototypeOf);
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
							if(this[name]){
								this[name](prop[i]);
							}else{
								if(!options.protected){
									this[i]= prop[i];
								}
							}
						}
					}
					return this;
				}else{
					return target['set'+(prop[0].toUpperCase()+prop.substring(1))](val);
				}
			}
		}

		if(options.getter && !options.specificOnly){
			target.get= function(prop){
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