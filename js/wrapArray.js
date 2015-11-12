var WrapArray = function(limit) {
	var _limit = limit;
	var _array = [];
	var _cursor = -1;
	var _cap = 0;
	
	this.forEach = function(callback, r) {
		var reverse = r || false;
		// console.log("revese: ", reverse);
		var m = reverse ? -1 : 1;
		// console.log("m: ", m);
		var i = _cursor + (reverse ? 0 : 1);
		// console.log("i: ", i);
		var count = 0;
		// console.log("limit: ", _limit);
		while ( count < _cap ) {
			if (i < 0 || i === _cap)
				i += _cap * -m;

			callback(_array[i]); //"[" + i + "]" +  
			i+=m;
			count++;
		}
	}
	
	this.add = function (item) {
		if (_cursor >= _limit-1)
			_cursor = -1;
			
		_cursor++;
		_array[_cursor] = item;
		
		_cap++;
		if (_cap >= _limit)
			_cap = _limit;
	}
	
	this.toString = function() {
		return _array.join(",") + ": limit:" + _limit + ", cap:" + _cap + " cur:" + _cursor;
	}
	
	
}

WrapArray.test = function(limit, count) {
	var a = new WrapArray(limit);
	for (var i=0;i<count;i++){a.add(i);}
	
	console.log(a.toString());
	
	var tarr = [];
	a.forEach(function(item){tarr.push(item);});
	console.log(tarr.join(",")); tarr = [];
	a.forEach(function(item){tarr.push(item);},true);
	console.log(tarr.join(",")); tarr = [];
	a.forEach(function(item){tarr.push(item);},false);
	console.log(tarr.join(","));
}