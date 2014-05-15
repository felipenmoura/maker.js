(function(){

    var modelsList= {};

    make.model= function(model){

        var Model= function(){},
            i= null;

        for(i in model){
            if(model.hasOwnProperty(i)){
                Model.prototype[i]= model[i];
            }
        }

        Model= make.tiable(Model);

        model.identifier= (new Date()).getTime();
        modelsList[model.identifier]= [];

        model.create= function(){
            
            var m= new Model();
            /*for(i in model){
                if(model.hasOwnProperty(i)){
                    m[i]= model[i];
                }
            }*/
            
            //make.observable(m);
            //make.setAndGettable(m);
            //console.log(m);
            //make.tiable(m);

            m.addSetterFilter(function(prop, val){
                m.trigger(prop, val);
            });
            
            if(typeof m.oncreate == 'function'){
                m.oncreate.apply(m, Array.prototype.slice.call(arguments, 0));
            }

            modelsList[model.identifier].push(m);

            return m;
        }
    };

    /* Collections */
    make.collection= function(model){
        
        var oModel= model;

        function Collection(model){

            var curPointer= 0,
                collectionId= model.identifier;

            this.__makeData= this.__makeData || {};

            // making it indexable
            make.indexable(modelsList[collectionId]);
            
            this.getLength= function(){
                return modelsList[collectionId].length;
            }

            this.first= function(){
                return modelsList[collectionId][0] || false;
            }

            this.last= function(){
                return modelsList[collectionId][ this.getLength() -1 ] || false;
            }

            this.goTo= function(idx){
                if(idx < 0){
                    idx= 0;
                }else if(idx >= this.getLength()){
                    idx= this.getLength() -1;
                }
                curPointer= idx;
                return modelsList[collectionId][idx];
            };

            this.current= function(){
                return modelsList[collectionId][curPointer] || false;
            }

            this.currentIdx= function(){
                return curPointer;
            }
            /**
             *
             *  while(x = people.next()){
             *      console.log(x.name);
             *  }
             */
            this.next= function(){
                var ret= modelsList[collectionId][curPointer] || false;
                if(ret){
                    curPointer++;
                }
                return ret;
            }
            /**
             *
             *  while(x = people.prev()){
             *      console.log(x.name);
             *  }
             */
            this.prev= function(){
                var ret= modelsList[collectionId][curPointer] || false;
                if(ret){
                    curPointer--;
                }
                return ret;
            }

            this.reset= function(){
                curPointer= 0;
            }

            this.get= function(at){
                return modelsList[collectionId][at] || false;
            }

            this.list= function(from, to){
                if(from){
                    if(to){
                        return modelsList[collectionId].slice(from, to);
                    }else{
                        return modelsList[collectionId].slice(from);
                    }
                }else{
                    return modelsList[collectionId].slice();
                }
            };

            /**
             *
             *  while(cur = people.query('name', 'son')){
             *      console.log(cur.name);
             *  }
             */
            this.query= function(prop, valueLike){
                ret= modelsList[collectionId].query(prop, valueLike, curPointer);
                if(ret !== false){
                    curPointer= ret;
                    ret= this.get(ret);
                    curPointer++;
                }
                return ret;
            };

            this.queryAll= function(prop, valueLike){
                return modelsList[collectionId].queryAll(prop, valueLike);
            };

            this.add= function(data){
                oModel.create(data);
            };

            this.__makeData.tiable= true;
        }

        return new Collection(model);
    };    

})();
