/**
    makes given objects indexables with Indexable methods

    var o= {
      a: {
        b: { d: [11, 22, 33]},
        c: { e: 'algo' }
      },
      f: { g: { h: { i: { j:{ k: { l:{ m: "felipe" }}}}}}},
      n: 'foo',
      o: [
        { p: 'A longer text comes here', q: 'Something else'},
        { r: 'Another text comes', s: 'yeah!'},
        { t: 'And here, could be a loren ipsum!', u: "just some bla bla bla"},
        { v: "ok, that's it...", x: 'x files'},
        { y: 'yah, baby, yeah!', z: "zzzzzzzz..."}
      ]
    };
    make.indexable(o);
    console.log( o.find('algo') );
    console.log( o.find('22') );
    console.log( o.find('felipe') );
    console.log( o.find('foo') );
    console.log( o.findLike('loren') );
    console.log( o.findLike("that's") );
    console.log( o.findLike(/bla {0,2}/));
    console.log( o.locate('p') );
    console.log( o.locate('k') );
    console.log( o.locate('x') );
    console.log( o.locateLike('P') );
 */
make.indexable= function(obj){

    if(!obj || typeof obj != 'object'){
        return console.error('indexable:Method makeIndexable expects first argument to be an Object');
    }

    function Indexable(){
        var self= this;

        var castEl= function(cur, i){
            i= i || '';
            if(typeof cur == 'object' && cur.length){
                i= '['+i+']';
            }else{
                i= '.'+i;
            }
            return i;
        };

        this.find= function(search, cur, path, opts){

            if(search === void 0){
                return console.error('indexable:Method find expected one argument.');
            }

            path= path || [];
            cur= cur || self;
            opts= opts || {};
            var i= null,
                found= false;

            var compare= function(target, key, search){

                var val= null,
                    oSearch= search;

                if(opts.regEx){
                    if(!(search instanceof RegExp)){
                        search= new RegExp(search, 'i');
                    }
                }else{
                    search= new RegExp(search, '');
                }
                if(opts.lookingForKey){
                    val= key;
                }else{
                    val= target[key];
                }
                val= val.valueOf() || '';

                try{
                    if( (val.match && val.match(search)) || val == oSearch ){
                        return true;
                    }
                }catch(e){
                    console.warn('compare', 'A problem occurred when trying to compare values. Possible error with a regExp, perhaps?', e);
                }
                return false;
            };

            for(i in cur){
                if(cur.hasOwnProperty(i)){
                    if( compare(cur, i, search) ){
                        path.push(castEl(cur, i));
                        found= true;
                        break;

                    }else{
                        if(cur[i] && typeof cur[i] == 'object'){
                            path.push(castEl(cur, i));
                            //cur= cur[i];
                            found= self.find(search, cur[i], path, opts);
                            if(found){
                                return found;
                            }else{
                                path.pop();
                            }
                        }
                    }
                }
            }

            if(found && path && path.length){
                return path.join('').replace('.', '');
            }
            return false;
        };

        this.locate= function(item){
            return this.find(item, false, false, {
                lookingForKey: true
            });
        };

        this.findLike= function(saerch){
            return this.find(saerch, false, false, {
                regEx: true
            });
        };

        this.locateLike= function(item){
            return this.find(item, false, false, {
                lookingForKey: true,
                regEx: true
            });
        };
    }

    Indexable.apply(obj);

};