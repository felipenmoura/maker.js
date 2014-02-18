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
		throw new Error('Invalid type of object or class passed to tiable!');
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