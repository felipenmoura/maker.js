(function(){

	function Promise(fn){

		this.fn= fn;

		return this;
	}

	make.promise= function(){
		var args= Array.prototype.slice.call(arguments);
		args= args.map(function(cur){
			return new Promise(cur);
		});
		return args.length > 1? args: args[0];
	}
})();



