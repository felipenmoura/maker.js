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

		function verifySetAndGetValue(that){
			if(!that.__makeSetGetValue){

				if(make.__isIE8){
					// need to be treated differently
					//var DOMElRef= document.createElement('makeDOMElement');
					//that.__makeSetGetDOMWorkAroundForIE8= DOMElRef;

				}else{}

				that.__makeSetGetValue= {};
			}
		}

		function createSetterAndGetter(target, i, isPrototypeOf){
			
			var value= target[i];
			var name= i[0].toUpperCase() + i.substring(1);

			if(!target['set'+name]){
				target['set'+name]= function(val){

					verifySetAndGetValue(this);

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
						verifySetAndGetValue(this);
						
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
					}
				}

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

		target.__makeSetAndGettable= true;

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