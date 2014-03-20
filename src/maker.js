
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
