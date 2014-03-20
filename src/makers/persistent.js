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