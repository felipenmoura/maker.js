make.model= function(objOrFn){
    objOrFn= make.observable(objOrFn);
    objOrFn= make.indexable(objOrFn);

    

    return objOrFn;
};