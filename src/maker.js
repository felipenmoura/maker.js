
make= {};

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