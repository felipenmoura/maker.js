/**
 * This method offers the feature of making objects indexable.
 * By being indexable, such objects will have extra methods, like find, search,
 * locate, getAt and locateLike.
 * 
 * ```javascript
 *      makes given objects indexables with Indexable methods
 *      var o= {
 *        a: {
 *          b: { d: [11, 22, 33]},
 *          c: { e: 'algo' }
 *        },
 *        f: { g: { h: { i: { j:{ k: { l:{ m: "felipe" }}}}}}},
 *        n: 'foo',
 *        o: [
 *          { p: 'A longer text comes here', q: 'Something else'},
 *          { r: 'Another text comes', s: 'yeah!'},
 *          { t: 'And here, could be a loren ipsum!', u: "just some bla bla bla"},
 *          { v: "ok, that's it...", x: 'x files'},
 *          { y: 'yah, baby, yeah!', z: "zzzzzzzz..."}
 *        ]
 *      };
 *      make.indexable(o);
 *      console.log( o.find('algo') );
 *      console.log( o.find('22') );
 *      console.log( o.find('felipe') );
 *      console.log( o.find('foo') );
 *      console.log( o.findLike('loren') );
 *      console.log( o.findLike("that's") );
 *      console.log( o.findLike(/bla {0,2}/));
 *      console.log( o.locate('p') );
 *      console.log( o.locate('k') );
 *      console.log( o.locate('x') );
 *      console.log( o.locateLike('P') );
 * ```
 * 
 * @method indexable
 * @param object The object to become indexable {Object}
 */
make.indexable= function(obj){

    if(!obj || typeof obj != 'object'){
        return console.error('indexable:Method makeIndexable expects first argument to be an Object');
    }

    /**
     * Indexable class.
     * This class adds useful methods to objects that extend it.
     * @class Indexable
     */
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

        /**
         * Returns the path for the given value, or false if it was not found
         * in object.
         * 
         * @method find
         * @param search The niddle to be found in the haystack {mixed}
         * @param options An object with options for the method
         * - lookingForKey: in case you want to find a key(locate is an alias){Boolean}
         * - regEx: if your search is a regular expression{boolean}
         * @return {String}
         */
        this.find= function(search, opts, cur, path){

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
                            found= self.find(search, opts, cur[i], path);
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

        /**
         * Locate an item in your object by the key, returning its path.
         * This method is an alias to: find(item, {lookingForKey: true})
         * 
         * @method locate
         * @param item The name of the key to be found
         * @return {String}
         */
        this.locate= function(item){
            return this.find(item, {
                lookingForKey: true
            });
        };

        /**
         * Find the first entry in the object, looking for it in its values,
         * that matches the regular expression, or has the search value as
         * part of it.
         * This method is an alias to: find(item, {regEx: true})
         * 
         * @method search
         * @param search The name of the key to be found
         * @return {String}
         */
        this.search= this.findLike= function(search){
            return this.find(search, {
                regEx: true
            });
        };

        /**
         * Locate an item in your object by the key, returning its path.
         * The difference here is that it returns the first key that matches
         * the regularExpression, or has the search value as part of the key.
         * This method is an alias to: find(item, {lookingForKey: true, regEx: true})
         * 
         * @method locateLike
         * @param item The name, part of the name, or regular expression to be found in keys.
         * @return {String}
         */
        this.locateLike= function(item){
            return this.find(item, {
                lookingForKey: true,
                regEx: true
            });
        };

        this.getAt= function(path){
            var peaces= path.replace(/\[/g, '.').replace(/\]/g, '').split('.'),
                l= peaces.length,
                target= this;

            for(var i=0; i<l; i++){
                if(target[peaces[i]] === void 0){
                    return void 0;
                }
                target= target[peaces[i]];
            }
            return target;
        };
    }

    Indexable.apply(obj);

};