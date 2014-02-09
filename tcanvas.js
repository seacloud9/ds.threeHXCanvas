(function () { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IMap = function() { }
IMap.__name__ = true;
var Reflect = function() { }
Reflect.__name__ = true;
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		this.b += len == null?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
}
var Tcanvas = function() {
	this.mouseXOnMouseDown = 0;
	this.mouseX = 0;
	this.targetRotationOnMouseDown = 0;
	this.targetRotation = 0;
	this.container = js.Browser.document.createElement("div");
};
Tcanvas.__name__ = true;
Tcanvas.main = function() {
	console.log("Hello World !");
	var t = new Tcanvas();
	var body = js.Browser.document.body;
	body.appendChild(t.container);
	t.init();
	t.animate();
}
Tcanvas.prototype = {
	onDocumentTouchMove: function(event) {
		if(event.touches.length == 1) {
			event.preventDefault();
			this.mouseX = event.touches[0].pageX - this.windowHalfX;
			this.targetRotation = this.targetRotationOnMouseDown + (this.mouseX - this.mouseXOnMouseDown) * 0.05;
		}
	}
	,onDocumentTouchStart: function(event) {
		var etl = event.touches.length;
		if(etl == 1) {
			event.preventDefault();
			this.mouseXOnMouseDown = event.touches[0].pageX - this.windowHalfX;
			this.targetRotationOnMouseDown = this.targetRotation;
		}
	}
	,onDocumentMouseOut: function(event) {
		this.doc.removeEventListener("mousemove",$bind(this,this.onDocumentMouseMove),false);
		this.doc.removeEventListener("mouseup",$bind(this,this.onDocumentMouseUp),false);
		this.doc.removeEventListener("mouseout",$bind(this,this.onDocumentMouseOut),false);
	}
	,onDocumentMouseUp: function(event) {
		this.doc.removeEventListener("mousemove",$bind(this,this.onDocumentMouseMove),false);
		this.doc.removeEventListener("mouseup",$bind(this,this.onDocumentMouseUp),false);
		this.doc.removeEventListener("mouseout",$bind(this,this.onDocumentMouseOut),false);
	}
	,onDocumentMouseMove: function(event) {
		this.mouseX = event.clientX - this.windowHalfX;
		this.targetRotation = this.targetRotationOnMouseDown + (this.mouseX - this.mouseXOnMouseDown) * 0.02;
	}
	,onDocumentMouseDown: function(event) {
		event.preventDefault();
		this.doc.addEventListener("mousemove",$bind(this,this.onDocumentMouseMove),false);
		this.doc.addEventListener("mouseup",$bind(this,this.onDocumentMouseUp),false);
		this.doc.addEventListener("mouseout",$bind(this,this.onDocumentMouseOut),false);
		this.mouseXOnMouseDown = event.clientX - this.windowHalfX;
		this.targetRotationOnMouseDown = this.targetRotation;
	}
	,render: function() {
		this.plane.rotation.y = this.cube.rotation.y += (this.targetRotation - this.cube.rotation.y) * 0.05;
		this.renderer.render(this.scene,this.camera);
	}
	,animate: function() {
		requestAnimationFrame($bind(this,this.animate));
		this.render();
	}
	,init: function() {
		this.windowHalfX = js.Browser.window.innerWidth / 2;
		this.windowHalfY = js.Browser.window.innerHeight / 2;
		this.camera = new three.cameras.PerspectiveCamera(70,js.Browser.window.innerWidth / js.Browser.window.innerHeight,1,1000);
		this.camera.position.y = 150;
		this.camera.position.z = 500;
		this.scene = new three.scenes.Scene();
		var geometry = new three.extras.geometries.CubeGeometry(200,200,200);
		var i = 0;
		var hex = Math.random() * 16777215;
		while(i < geometry.faces.length) {
			geometry.faces[i].color.setHex(hex);
			geometry.faces[i + 1].color.setHex(hex);
			i += 2;
		}
		var material = new three.materials.MeshBasicMaterial({ vertexColors : three.THREE.FaceColors, overdraw : 0.5});
		this.cube = new three.objects.Mesh(geometry,material);
		this.cube.position.y = 150;
		this.scene.add(this.cube);
		var geometry1 = new three.extras.geometries.PlaneGeometry(200,200);
		geometry1.applyMatrix(new three.math.Matrix4().makeRotationX(-Math.PI / 2));
		var material1 = new three.materials.MeshBasicMaterial({ color : 14737632, overdraw : 0.5});
		this.plane = new three.objects.Mesh(geometry1,material1);
		this.scene.add(this.plane);
		this.renderer = new three.renderers.DebugRenderer();
		this.renderer.setSize(js.Browser.window.innerWidth,js.Browser.window.innerHeight);
		this.doc = js.Browser.document.body;
		this.doc.addEventListener("mousedown",$bind(this,this.onDocumentMouseDown),false);
		this.doc.addEventListener("touchstart",$bind(this,this.onDocumentTouchStart),false);
		this.doc.addEventListener("touchmove",$bind(this,this.onDocumentTouchMove),false);
	}
	,__class__: Tcanvas
}
var ValueType = { __ename__ : true, __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
Type.__name__ = true;
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumIndex = function(e) {
	return e[1];
}
var haxe = {}
haxe.Json = function() {
};
haxe.Json.__name__ = true;
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.stringify = function(value,replacer) {
	return new haxe.Json().toString(value,replacer);
}
haxe.Json.prototype = {
	parseNumber: function(c) {
		var start = this.pos - 1;
		var minus = c == 45, digit = !minus, zero = c == 48;
		var point = false, e = false, pm = false, end = false;
		while(true) {
			c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 48:
				if(zero && !point) this.invalidNumber(start);
				if(minus) {
					minus = false;
					zero = true;
				}
				digit = true;
				break;
			case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				if(zero && !point) this.invalidNumber(start);
				if(minus) minus = false;
				digit = true;
				zero = false;
				break;
			case 46:
				if(minus || point) this.invalidNumber(start);
				digit = false;
				point = true;
				break;
			case 101:case 69:
				if(minus || zero || e) this.invalidNumber(start);
				digit = false;
				e = true;
				break;
			case 43:case 45:
				if(!e || pm) this.invalidNumber(start);
				digit = false;
				pm = true;
				break;
			default:
				if(!digit) this.invalidNumber(start);
				this.pos--;
				end = true;
			}
			if(end) break;
		}
		var f = Std.parseFloat(HxOverrides.substr(this.str,start,this.pos - start));
		var i = f | 0;
		return i == f?i:f;
	}
	,invalidNumber: function(start) {
		throw "Invalid number at position " + start + ": " + HxOverrides.substr(this.str,start,this.pos - start);
	}
	,parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.addSub(this.str,start,this.pos - start - 1);
				c = this.str.charCodeAt(this.pos++);
				switch(c) {
				case 114:
					buf.b += "\r";
					break;
				case 110:
					buf.b += "\n";
					break;
				case 116:
					buf.b += "\t";
					break;
				case 98:
					buf.b += "";
					break;
				case 102:
					buf.b += "";
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.addSub(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseRec: function() {
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { }, field = null, comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						obj[field] = this.parseRec();
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [], comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma == false) this.invalidChar();
						return arr;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					default:
						if(comma) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
					this.pos = save;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				return this.parseNumber(c);
			default:
				this.invalidChar();
			}
		}
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,doParse: function(str) {
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,quote: function(s) {
		this.buf.b += "\"";
		var i = 0;
		while(true) {
			var c = s.charCodeAt(i++);
			if(c != c) break;
			switch(c) {
			case 34:
				this.buf.b += "\\\"";
				break;
			case 92:
				this.buf.b += "\\\\";
				break;
			case 10:
				this.buf.b += "\\n";
				break;
			case 13:
				this.buf.b += "\\r";
				break;
			case 9:
				this.buf.b += "\\t";
				break;
			case 8:
				this.buf.b += "\\b";
				break;
			case 12:
				this.buf.b += "\\f";
				break;
			default:
				this.buf.b += String.fromCharCode(c);
			}
		}
		this.buf.b += "\"";
	}
	,toStringRec: function(k,v) {
		if(this.replacer != null) v = this.replacer(k,v);
		var _g = Type["typeof"](v);
		var $e = (_g);
		switch( $e[1] ) {
		case 8:
			this.buf.b += "\"???\"";
			break;
		case 4:
			this.objString(v);
			break;
		case 1:
			var v1 = v;
			this.buf.b += Std.string(v1);
			break;
		case 2:
			this.buf.b += Std.string(Math.isFinite(v)?v:"null");
			break;
		case 5:
			this.buf.b += "\"<fun>\"";
			break;
		case 6:
			var c = $e[2];
			if(c == String) this.quote(v); else if(c == Array) {
				var v1 = v;
				this.buf.b += "[";
				var len = v1.length;
				if(len > 0) {
					this.toStringRec(0,v1[0]);
					var i = 1;
					while(i < len) {
						this.buf.b += ",";
						this.toStringRec(i,v1[i++]);
					}
				}
				this.buf.b += "]";
			} else if(c == haxe.ds.StringMap) {
				var v1 = v;
				var o = { };
				var $it0 = v1.keys();
				while( $it0.hasNext() ) {
					var k1 = $it0.next();
					o[k1] = v1.get(k1);
				}
				this.objString(o);
			} else this.objString(v);
			break;
		case 7:
			var i = Type.enumIndex(v);
			var v1 = i;
			this.buf.b += Std.string(v1);
			break;
		case 3:
			var v1 = v;
			this.buf.b += Std.string(v1);
			break;
		case 0:
			this.buf.b += "null";
			break;
		}
	}
	,objString: function(v) {
		this.fieldsString(v,Reflect.fields(v));
	}
	,fieldsString: function(v,fields) {
		var first = true;
		this.buf.b += "{";
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) continue;
			if(first) first = false; else this.buf.b += ",";
			this.quote(f);
			this.buf.b += ":";
			this.toStringRec(f,value);
		}
		this.buf.b += "}";
	}
	,toString: function(v,replacer) {
		this.buf = new StringBuf();
		this.replacer = replacer;
		this.toStringRec("",v);
		return this.buf.b;
	}
	,__class__: haxe.Json
}
haxe.ds = {}
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe.ds.ObjectMap.__name__ = true;
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		var id = key.__id__;
		if(!this.h.hasOwnProperty(id)) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,set: function(key,value) {
		var id = key.__id__ != null?key.__id__:key.__id__ = ++haxe.ds.ObjectMap.count;
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,__class__: haxe.ds.ObjectMap
}
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
js.Browser.__name__ = true;
var three = {}
three.THREE = function() { }
three.THREE.__name__ = true;
three.core = {}
three.core.Object3D = function() {
	this.id = 0;
	this.name = "";
	this.parent = null;
	this.children = new haxe.ds.ObjectMap();
	this.up = new three.math.Vector3(0,1,0);
	this.position = new three.math.Vector3();
	this.rotation = new three.math.Vector3();
	this.eulerOrder = three.THREE.defaultEulerOrder;
	this.scale = new three.math.Vector3(1,1,1);
	this.renderDepth = null;
	this.rotationAutoUpdate = true;
	this.matrix = new three.math.Matrix4();
	this.matrixWorld = new three.math.Matrix4();
	this.matrixAutoUpdate = true;
	this.matrixWorldNeedsUpdate = true;
	this.quaternion = new three.math.Quaternion();
	this.useQuaternion = false;
	this.visible = true;
	this.castShadow = false;
	this.receiveShadow = false;
	this.target = null;
	this.frustumCulled = true;
};
three.core.Object3D.__name__ = true;
three.core.Object3D.prototype = {
	clone: function(object) {
		if(object == null) object = new three.core.Object3D();
		object.name = this.name;
		object.up.copy(this.up);
		object.position.copy(this.position);
		object.rotation.copy(this.rotation);
		object.eulerOrder = this.eulerOrder;
		object.scale.copy(this.scale);
		object.renderDepth = this.renderDepth;
		object.rotationAutoUpdate = this.rotationAutoUpdate;
		object.matrix.copy(this.matrix);
		object.matrixWorld.copy(this.matrixWorld);
		object.matrixAutoUpdate = this.matrixAutoUpdate;
		object.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate;
		object.quaternion.copy(this.quaternion);
		object.useQuaternion = this.useQuaternion;
		object.visible = this.visible;
		object.castShadow = this.castShadow;
		object.receiveShadow = this.receiveShadow;
		object.frustumCulled = this.frustumCulled;
		object.userData = haxe.Json.parse(haxe.Json.stringify(this.userData));
		var cIter = this.children.iterator();
		while(cIter.hasNext() == true) {
			var child = cIter.next();
			object.add(child.clone());
		}
		return object;
	}
	,updateMatrixWorld: function(force) {
		if(force == null) force = false;
		if(this.matrixAutoUpdate == true) this.updateMatrix();
		if(this.matrixWorldNeedsUpdate == true || force == true) {
			if(this.parent == null) this.matrixWorld.copy(this.matrix); else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);
			this.matrixWorldNeedsUpdate = false;
			force = true;
		}
		var cIter = this.children.iterator();
		while(cIter.hasNext() == true) cIter.next().updateMatrixWorld(force);
	}
	,updateMatrix: function() {
		if(this.useQuaternion == false) this.matrix.makeFromPositionEulerScale(this.position,this.rotation,this.scale,this.eulerOrder); else this.matrix.makeFromPositionQuaternionScale(this.position,this.quaternion,this.scale);
		this.matrixWorldNeedsUpdate = true;
	}
	,getDescendants: function() {
		return new Array();
	}
	,getChildByName: function(name,recursive) {
		if(recursive == null) recursive = false;
		return this.getObjectByName(name,recursive);
	}
	,getObjectByName: function(name,recursive) {
		if(recursive == null) recursive = false;
		var cIter = this.children.iterator();
		while(cIter.hasNext() == true) {
			var child = cIter.next();
			if(child.name == name) return child;
			if(recursive == true) {
				var object = child.getObjectByName(name,recursive);
				if(object != null) return object;
			}
		}
		return null;
	}
	,getObjectById: function(id,recursive) {
		if(recursive == null) recursive = false;
		var cIter = this.children.iterator();
		while(cIter.hasNext() == true) {
			var child = cIter.next();
			if(child.id == id) return child;
			if(recursive == true) {
				var object = child.getObjectById(id,recursive);
				if(object != null) return child;
			}
		}
		return null;
	}
	,traverse: function(fnCallback) {
		fnCallback(this);
		var cIter = this.children.iterator();
		while(cIter.hasNext() == true) {
			var child = cIter.next();
			child.traverse(fnCallback);
		}
	}
	,remove: function(object) {
		if(this.children.h.hasOwnProperty(object.__id__) == false) return false;
		object.parent = null;
		this.children.remove(object);
		var scene = this;
		while(scene.parent != null) scene = scene.parent;
		if(js.Boot.__instanceof(scene,three.scenes.Scene) == false) return true;
		(js.Boot.__cast(scene , three.scenes.Scene)).__removeObject(object);
		return true;
	}
	,add: function(object) {
		if(object == this) {
			console.log("Object3D.add: An object cant be added as a child of itself.");
			return;
		}
		if(object.parent != null) object.parent.remove(object);
		object.parent = this;
		if(this.children.h.hasOwnProperty(object.__id__) == false) this.children.set(object,object);
		var scene = this;
		while(scene.parent != null) scene = scene.parent;
		if(js.Boot.__instanceof(scene,three.scenes.Scene) == false) return;
		(js.Boot.__cast(scene , three.scenes.Scene)).__addObject(object);
	}
	,lookAt: function(v) {
		var m1 = new three.math.Matrix4();
		m1.lookAt(v,this.position,this.up);
		if(this.useQuaternion == true) this.quaternion.setFromRotationMatrix(m1); else this.rotation.setEulerFromRotationMatrix(m1,this.eulerOrder);
	}
	,worldToLocal: function(v) {
		var m1 = new three.math.Matrix4();
		return v.applyMatrix4(m1.getInverse(this.matrixWorld));
	}
	,localToWorld: function(v) {
		return v.applyMatrix4(this.matrixWorld);
	}
	,translateZ: function(distance) {
		return this.translateOnAxis(new three.math.Vector3(0,0,1),distance);
	}
	,translateY: function(distance) {
		return this.translateOnAxis(new three.math.Vector3(0,1,0),distance);
	}
	,translateX: function(distance) {
		return this.translateOnAxis(new three.math.Vector3(1,0,0),distance);
	}
	,translate: function(distance,axis) {
		return this.translateOnAxis(axis,distance);
	}
	,translateOnAxis: function(axis,distance) {
		var v1 = new three.math.Vector3();
		v1.copy(axis);
		if(this.useQuaternion == true) v1.applyQuaternion(this.quaternion); else v1.applyEuler(this.rotation,this.eulerOrder);
		this.position.add(v1.multiplyScalar(distance));
		return this;
	}
	,rotateOnAxis: function(axis,angle) {
		var q1 = new three.math.Quaternion();
		var q2 = new three.math.Quaternion();
		q1.setFromAxisAngle(axis,angle);
		if(this.useQuaternion == true) this.quaternion.multiply(q1); else {
			q2.setFromEuler(this.rotation,this.eulerOrder);
			q2.multiply(q1);
			this.rotation.setEulerFromQuaternion(q2,this.eulerOrder);
		}
		return this;
	}
	,applyMatrix: function(m) {
		var m1 = new three.math.Matrix4();
		this.matrix.multiplyMatrices(m,this.matrix);
		this.position.getPositionFromMatrix(this.matrix);
		this.scale.getScaleFromMatrix(this.matrix);
		m1.extractRotation(this.matrix);
		if(this.useQuaternion == true) this.quaternion.setFromRotationMatrix(m1); else this.rotation.setEulerFromRotationMatrix(m1,this.eulerOrder);
	}
	,__class__: three.core.Object3D
}
three.cameras = {}
three.cameras.Camera = function() {
	three.core.Object3D.call(this);
	this.matrixWorldInverse = new three.math.Matrix4();
	this.projectionMatrix = new three.math.Matrix4();
	this.projectionMatrixInverse = new three.math.Matrix4();
	this.visible = false;
};
three.cameras.Camera.__name__ = true;
three.cameras.Camera.__super__ = three.core.Object3D;
three.cameras.Camera.prototype = $extend(three.core.Object3D.prototype,{
	lookAt: function(v) {
		var m1 = new three.math.Matrix4();
		m1.lookAt(this.position,v,this.up);
		if(this.useQuaternion == true) this.quaternion.setFromRotationMatrix(m1); else this.rotation.setEulerFromRotationMatrix(m1,this.eulerOrder);
	}
	,__class__: three.cameras.Camera
});
three.cameras.PerspectiveCamera = function(fov,aspect,near,far) {
	if(far == null) far = 2000;
	if(near == null) near = 0.1;
	if(aspect == null) aspect = 1;
	if(fov == null) fov = 50;
	this.height = null;
	this.width = null;
	this.y = null;
	this.x = null;
	this.fullHeight = null;
	this.fullWidth = null;
	three.cameras.Camera.call(this);
	this.fov = fov;
	this.aspect = aspect;
	this.near = near;
	this.far = far;
	this.updateProjectionMatrix();
};
three.cameras.PerspectiveCamera.__name__ = true;
three.cameras.PerspectiveCamera.__super__ = three.cameras.Camera;
three.cameras.PerspectiveCamera.prototype = $extend(three.cameras.Camera.prototype,{
	updateProjectionMatrix: function() {
		if(this.fullWidth != null) {
			var aspectRatio = this.fullWidth / this.fullHeight;
			var top = Math.tan(three.extras.MathUtils.degToRad(this.fov * 0.5)) * this.near;
			var bottom = -top;
			var left = aspectRatio * bottom;
			var right = aspectRatio * top;
			var w = Math.abs(right - left);
			var h = Math.abs(top - bottom);
			this.projectionMatrix.makeFrustum(left + this.x * w / this.fullWidth,left + (this.x + this.width) * w / this.fullWidth,top - (this.y + this.height) * h / this.fullHeight,top - this.y * h / this.fullHeight,this.near,this.far);
		} else this.projectionMatrix.makePerspective(this.fov,this.aspect,this.near,this.far);
	}
	,setViewOffset: function(fullWidth,fullHeight,x,y,width,height) {
		this.fullWidth = fullWidth;
		this.fullHeight = fullHeight;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.updateProjectionMatrix();
	}
	,setLens: function(focalLength,frameHeight) {
		if(frameHeight == null) frameHeight = 24;
		this.fov = 2 * three.extras.MathUtils.radToDeg(Math.atan(frameHeight / (focalLength * 2)));
		this.updateProjectionMatrix();
	}
	,__class__: three.cameras.PerspectiveCamera
});
three.core.Face3 = function(a,b,c,normals,colors,materialIndex) {
	if(materialIndex == null) materialIndex = 0;
	this.a = a;
	this.b = b;
	this.c = c;
	if(normals != null && normals.length > 0) {
		this.normal = normals[0];
		this.vertexNormals = normals;
	} else {
		this.normal = new three.math.Vector3();
		this.vertexNormals = new Array();
	}
	if(colors != null && colors.length > 0) {
		this.color = colors[0];
		this.vertexColors = colors;
	} else {
		this.color = new three.math.Color();
		this.vertexColors = new Array();
	}
	this.vertexTangents = new Array();
	this.materialIndex = materialIndex;
	this.centroid = new three.math.Vector3();
};
three.core.Face3.__name__ = true;
three.core.Face3.prototype = {
	clone: function() {
		var face = new three.core.Face3(this.a,this.b,this.c);
		face.normal.copy(this.normal);
		face.color.copy(this.color);
		face.centroid.copy(this.centroid);
		face.materialIndex = this.materialIndex;
		var i = 0, l = this.vertexColors.length;
		while(i < l) face.vertexColors.push(this.vertexColors[i++].clone());
		i = 0;
		l = this.vertexNormals.length;
		while(i < l) face.vertexNormals.push(this.vertexNormals[i++].clone());
		i = 0;
		l = this.vertexTangents.length;
		while(i < l) face.vertexTangents.push(this.vertexTangents[i++].clone());
		return face;
	}
	,__class__: three.core.Face3
}
three.core.Face4 = function(a,b,c,d,normals,colors,materialIndex) {
	if(materialIndex == null) materialIndex = 0;
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
	if(normals != null && normals.length > 0) {
		this.normal = normals[0];
		this.vertexNormals = normals;
	} else {
		this.normal = new three.math.Vector3();
		this.vertexNormals = new Array();
	}
	if(colors != null && colors.length > 0) {
		this.color = colors[0];
		this.vertexColors = colors;
	} else {
		this.color = new three.math.Color();
		this.vertexColors = new Array();
	}
	this.vertexTangents = new Array();
	this.materialIndex = materialIndex;
	this.centroid = new three.math.Vector3();
};
three.core.Face4.__name__ = true;
three.core.Face4.prototype = {
	clone: function() {
		var face = new three.core.Face4(this.a,this.b,this.c,this.d);
		face.normal.copy(this.normal);
		face.color.copy(this.color);
		face.centroid.copy(this.centroid);
		face.materialIndex = this.materialIndex;
		var i = 0, l = this.vertexColors.length;
		while(i < l) face.vertexColors.push(this.vertexColors[i++].clone());
		i = 0;
		l = this.vertexNormals.length;
		while(i < l) face.vertexNormals.push(this.vertexNormals[i++].clone());
		i = 0;
		l = this.vertexTangents.length;
		while(i < l) face.vertexTangents.push(this.vertexTangents[i++].clone());
		return face;
	}
	,__class__: three.core.Face4
}
three.core.Geometry = function() {
	this.vertices = new Array();
	this.colors = new Array();
	this.normals = new Array();
	this.faces = new Array();
	this.faceUvs = new Array();
	this.faceVertexUvs = new Array();
	this.faceVertexUvs.push(new Array());
	this.morphTargets = new Array();
	this.morphColors = new Array();
	this.morphNormals = new Array();
	this.skinWeights = new Array();
	this.skinIndices = new Array();
	this.lineDistances = new Array();
	this.boundingBox = new three.math.Box3();
	this.boundingSphere = new three.math.Sphere();
	this.hasTangents = false;
	this.isDynamic = true;
	this.verticesNeedUpdate = false;
	this.elementsNeedUpdate = false;
	this.uvsNeedUpdate = false;
	this.normalsNeedUpdate = false;
	this.tangentsNeedUpdate = false;
	this.colorsNeedUpdate = false;
	this.lineDistancesNeedUpdate = false;
	this.buffersNeedUpdate = false;
	this.__tmpVertices = null;
};
three.core.Geometry.__name__ = true;
three.core.Geometry.prototype = {
	dispose: function() {
	}
	,clone: function() {
		var geometry = new three.core.Geometry();
		var i = 0, l = this.vertices.length;
		while(i < l) geometry.vertices.push(this.vertices[i++].clone());
		i = 0;
		l = this.faces.length;
		while(i < l) geometry.faces.push(this.faces[i++].clone());
		return geometry;
	}
	,mergeVertices: function() {
		var verticesMap = new haxe.ds.StringMap();
		var unique = [];
		var changes = [];
		var v, key;
		var precisionPoints = 4;
		var precision = Math.pow(10,precisionPoints);
		var indices = [];
		this.__tmpVertices = null;
		var i = 0, il = this.vertices.length;
		while(i < il) {
			v = this.vertices[i];
			key = [Math.round(v.x * precision),Math.round(v.y * precision),Math.round(v.z * precision)].join("_");
			if(verticesMap.exists(key) == false) {
				verticesMap.set(key,i);
				unique.push(this.vertices[i]);
				changes[i] = unique.length - 1;
			} else changes[i] = changes[verticesMap.get(key)];
			i++;
		}
		var faceIndicesToRemove = [];
		i = 0;
		il = this.faces.length;
		while(i < il) {
			var face = this.faces[i];
			if(js.Boot.__instanceof(face,three.core.Face3) == true) {
				var face1 = js.Boot.__cast(face , three.core.Face3);
				face1.a = changes[face1.a];
				face1.b = changes[face1.b];
				face1.c = changes[face1.c];
				indices = [face1.a,face1.b,face1.c];
				var dupIndex = -1;
				var n = 0;
				while(n < 3) {
					if(indices[n] == indices[(n + 1) % 3]) {
						dupIndex = n;
						faceIndicesToRemove.push(i);
						break;
					}
					n++;
				}
			} else if(js.Boot.__instanceof(face,three.core.Face4) == true) {
				var face1 = js.Boot.__cast(face , three.core.Face4);
				face1.a = changes[face1.a];
				face1.b = changes[face1.b];
				face1.c = changes[face1.c];
				face1.d = changes[face1.d];
				indices = [face1.a,face1.b,face1.c,face1.d];
				var dupIndex = -1;
				var n = 0;
				while(n < 4) {
					if(indices[n] == indices[(n + 1) % 4]) {
						if(dupIndex >= 0) faceIndicesToRemove.push(i);
						dupIndex = n;
					}
					n++;
				}
				if(dupIndex >= 0) {
					indices.splice(dupIndex,1);
					var newFace = new three.core.Face3(indices[0],indices[1],indices[2],[face1.normal],[face1.color],face1.materialIndex);
					var j = 0, jl = this.faceVertexUvs.length;
					while(j < jl) {
						var u = this.faceVertexUvs[j][i];
						if(u != null) u.splice(dupIndex,1);
						j++;
					}
					if(face1.vertexNormals != null && face1.vertexNormals.length > 0) {
						newFace.vertexNormals = face1.vertexNormals;
						newFace.vertexNormals.splice(dupIndex,1);
					}
					if(face1.vertexColors != null && face1.vertexColors.length > 0) {
						newFace.vertexColors = face1.vertexColors;
						newFace.vertexColors.splice(dupIndex,1);
					}
					this.faces[i] = newFace;
				}
			}
			i++;
		}
		var i1 = faceIndicesToRemove.length - 1;
		while(i1 >= 0) {
			this.faces.splice(i1,1);
			var j = 0, jl = this.faceVertexUvs.length;
			while(j < jl) {
				this.faceVertexUvs[j].splice(i1,1);
				j++;
			}
			i1--;
		}
		var diff = this.vertices.length - unique.length;
		console.log("Geometry.mergeVertices: " + this.vertices.length + " -> " + unique.length);
		this.vertices = unique;
		return diff;
	}
	,computeBoundingSphere: function() {
		if(this.boundingSphere == null) this.boundingSphere = new three.math.Sphere();
		this.boundingSphere.setFromCenterAndPoints(this.boundingSphere.center,this.vertices);
	}
	,computeBoundingBox: function() {
		if(this.boundingBox == null) this.boundingBox = new three.math.Box3();
		this.boundingBox.setFromPoints(this.vertices);
	}
	,computeLineDistances: function() {
	}
	,computeTangents: function() {
	}
	,computeMorphNormals: function() {
	}
	,computeVertexNormals: function(areaWeighted) {
		if(areaWeighted == null) areaWeighted = false;
		if(this.__tmpVertices == null) {
			this.__tmpVertices = new Array();
			var v = 0, vl = this.vertices.length;
			while(v < vl) this.__tmpVertices[v++] = new three.math.Vector3();
			var f = 0, fl = this.faces.length;
			while(f < fl) {
				var face = this.faces[f++];
				if(js.Boot.__instanceof(face,three.core.Face3) == true) face.vertexNormals = [new three.math.Vector3(),new three.math.Vector3(),new three.math.Vector3()]; else face.vertexNormals = [new three.math.Vector3(),new three.math.Vector3(),new three.math.Vector3(),new three.math.Vector3()];
			}
		} else {
			var v = 0, vl = this.vertices.length;
			while(v < vl) this.__tmpVertices[v++].set(0,0,0);
		}
		if(areaWeighted == true) {
			var vA;
			var vB;
			var vC;
			var vD;
			var cb = new three.math.Vector3();
			var ab = new three.math.Vector3();
			var db = new three.math.Vector3();
			var dc = new three.math.Vector3();
			var bc = new three.math.Vector3();
			var f = 0, fl = this.faces.length;
			while(f < fl) {
				var face = this.faces[f++];
				if(js.Boot.__instanceof(face,three.core.Face3) == true) {
					vA = this.vertices[face.a];
					vB = this.vertices[face.b];
					vC = this.vertices[face.c];
					cb.subVectors(vC,vB);
					ab.subVectors(vA,vB);
					cb.cross(ab);
					this.__tmpVertices[face.a].add(cb);
					this.__tmpVertices[face.b].add(cb);
					this.__tmpVertices[face.c].add(cb);
				} else {
					vA = this.vertices[face.a];
					vB = this.vertices[face.b];
					vC = this.vertices[face.c];
					vD = this.vertices[face.d];
					db.subVectors(vD,vB);
					ab.subVectors(vA,vB);
					db.cross(ab);
					this.__tmpVertices[face.a].add(db);
					this.__tmpVertices[face.b].add(db);
					this.__tmpVertices[face.d].add(db);
					dc.subVectors(vD,vC);
					bc.subVectors(vB,vC);
					dc.cross(bc);
					this.__tmpVertices[face.b].add(dc);
					this.__tmpVertices[face.c].add(dc);
					this.__tmpVertices[face.d].add(dc);
				}
			}
		} else {
			var f = 0, fl = this.faces.length;
			while(f < fl) {
				var face = this.faces[f++];
				if(js.Boot.__instanceof(face,three.core.Face3) == true) {
					this.__tmpVertices[face.a].add(face.normal);
					this.__tmpVertices[face.b].add(face.normal);
					this.__tmpVertices[face.c].add(face.normal);
				} else {
					this.__tmpVertices[face.a].add(face.normal);
					this.__tmpVertices[face.b].add(face.normal);
					this.__tmpVertices[face.c].add(face.normal);
					this.__tmpVertices[face.d].add(face.normal);
				}
			}
		}
		var v = 0, vl = this.vertices.length;
		while(v < vl) this.__tmpVertices[v++].normalize();
		var f = 0, fl = this.faces.length;
		while(f < fl) {
			var face = this.faces[f++];
			if(js.Boot.__instanceof(face,three.core.Face3) == true) {
				face.vertexNormals[0].copy(this.__tmpVertices[face.a]);
				face.vertexNormals[1].copy(this.__tmpVertices[face.b]);
				face.vertexNormals[2].copy(this.__tmpVertices[face.c]);
			} else if(js.Boot.__instanceof(face,three.core.Face4) == true) {
				face.vertexNormals[0].copy(this.__tmpVertices[face.a]);
				face.vertexNormals[1].copy(this.__tmpVertices[face.b]);
				face.vertexNormals[2].copy(this.__tmpVertices[face.c]);
				face.vertexNormals[3].copy(this.__tmpVertices[face.d]);
			}
		}
	}
	,computeFaceNormals: function() {
		var cb = new three.math.Vector3(), ab = new three.math.Vector3();
		var f = 0, fl = this.faces.length, face;
		while(f < fl) {
			face = this.faces[f++];
			var vA = this.vertices[face.a];
			var vB = this.vertices[face.b];
			var vC = this.vertices[face.c];
			cb.subVectors(vC,vB);
			ab.subVectors(vA,vB);
			cb.cross(ab);
			cb.normalize();
			face.normal.copy(cb);
		}
	}
	,computeCentroids: function() {
		var f = 0, fl = this.faces.length, face;
		while(f < fl) {
			face = this.faces[f++];
			face.centroid.set(0,0,0);
			if(js.Boot.__instanceof(face,three.core.Face4) == true) {
				face.centroid.add(this.vertices[face.a]);
				face.centroid.add(this.vertices[face.b]);
				face.centroid.add(this.vertices[face.c]);
				face.centroid.add(this.vertices[face.d]);
				face.centroid.divideScalar(4);
			} else {
				face.centroid.add(this.vertices[face.a]);
				face.centroid.add(this.vertices[face.b]);
				face.centroid.add(this.vertices[face.c]);
				face.centroid.divideScalar(3);
			}
		}
	}
	,applyMatrix: function(m) {
		var normalMatrix = new three.math.Matrix3().getNormalMatrix(m);
		var i = 0, l = this.vertices.length;
		while(i < l) this.vertices[i++].applyMatrix4(m);
		i = 0;
		l = this.faces.length;
		while(i < l) {
			var face = this.faces[i];
			face.normal.applyMatrix3(normalMatrix).normalize();
			var faceVertexNormals = face.vertexNormals;
			var j = 0, jl = faceVertexNormals.length;
			while(j < jl) faceVertexNormals[j++].applyMatrix3(normalMatrix).normalize();
			i++;
		}
	}
	,__class__: three.core.Geometry
}
three.core.Projector = function() {
	this.particlePoolLength = 0;
	this.particleCount = 0;
	this.linePoolLength = 0;
	this.lineCount = 0;
	this.face4PoolLength = 0;
	this.face4Count = 0;
	this.face3PoolLength = 0;
	this.face3Count = 0;
	this.vertexPoolLength = 0;
	this.vertexCount = 0;
	this.objectPoolLength = 0;
	this.objectCount = 0;
	this.objectPool = new Array();
	this.vertexPool = new Array();
	this.face3Pool = new Array();
	this.face4Pool = new Array();
	this.linePool = new Array();
	this.particlePool = new Array();
	this.renderData = new three.core.RenderData();
	this.vector3 = new three.math.Vector3();
	this.vector4 = new three.math.Vector4();
	this.clipBox = new three.math.Box3(new three.math.Vector3(-1,-1,-1),new three.math.Vector3(1,1,1));
	this.boundingBox = new three.math.Box3();
	this.points3 = new Array();
	this.points4 = new Array();
	this.viewMatrix = new three.math.Matrix4();
	this.viewProjectionMatrix = new three.math.Matrix4();
	this.modelViewProjectionMatrix = new three.math.Matrix4();
	this.normalMatrix = new three.math.Matrix3();
	this.normalViewMatrix = new three.math.Matrix3();
	this.centroid = new three.math.Vector3();
	this.frustum = new three.math.Frustum();
	this.clippedVertex1PositionScreen = new three.math.Vector4();
	this.clippedVertex2PositionScreen = new three.math.Vector4();
};
three.core.Projector.__name__ = true;
three.core.Projector.prototype = {
	clipLine: function(s1,s2) {
		var alpha1 = 0, alpha2 = 1;
		var bc1near = s1.z + s1.w;
		var bc2near = s2.z + s2.w;
		var bc1far = -s1.z + s1.w;
		var bc2far = -s2.z + s2.w;
		if(bc1near >= 0 && bc2near >= 0 && bc1far >= 0 && bc2far >= 0) return true; else if(bc1near < 0 && bc2near < 0 || bc1far < 0 && bc2far < 0) return false; else {
			if(bc1near < 0) alpha1 = Math.max(alpha1,bc1near / (bc1near - bc2near)); else if(bc2near < 0) alpha2 = Math.min(alpha2,bc1near / (bc1near - bc2near));
			if(bc1far < 0) alpha1 = Math.max(alpha1,bc1far / (bc1far - bc2far)); else if(bc2far < 0) alpha2 = Math.min(alpha2,bc1far / (bc1far - bc2far));
			if(alpha2 < alpha1) return false; else {
				s1.lerp(s2,alpha1);
				s2.lerp(s1,1 - alpha2);
				return true;
			}
		}
	}
	,getNextParticleInPool: function() {
		if(this.particleCount == this.particlePoolLength) {
			var particle = new three.renderers.renderables.RenderableParticle();
			this.particlePool.push(particle);
			this.particlePoolLength++;
			this.particleCount++;
			return particle;
		}
		return this.particlePool[this.particleCount++];
	}
	,getNextLineInPool: function() {
		if(this.lineCount == this.linePoolLength) {
			var line = new three.renderers.renderables.RenderableLine();
			this.linePool.push(line);
			this.linePoolLength++;
			this.lineCount++;
			return line;
		}
		return this.linePool[this.lineCount++];
	}
	,getNextFace4InPool: function() {
		if(this.face4Count == this.face4PoolLength) {
			var f4 = new three.renderers.renderables.RenderableFace4();
			this.face4Pool.push(f4);
			this.face4PoolLength++;
			this.face4Count++;
			return f4;
		}
		return this.face4Pool[this.face4Count++];
	}
	,getNextFace3InPool: function() {
		if(this.face3Count == this.face3PoolLength) {
			var f3 = new three.renderers.renderables.RenderableFace3();
			this.face3Pool.push(f3);
			this.face3PoolLength++;
			this.face3Count++;
			return f3;
		}
		return this.face3Pool[this.face3Count++];
	}
	,getNextVertexInPool: function() {
		if(this.vertexCount == this.vertexPoolLength) {
			var vert = new three.renderers.renderables.RenderableVertex();
			this.vertexPool.push(vert);
			this.vertexPoolLength++;
			this.vertexCount++;
			return vert;
		}
		return this.vertexPool[this.vertexCount++];
	}
	,getNextObjectInPool: function() {
		if(this.objectCount == this.objectPoolLength) {
			var obj = new three.renderers.renderables.RenderableObject();
			this.objectPool.push(obj);
			this.objectPoolLength++;
			this.objectCount++;
			return obj;
		}
		return this.objectPool[this.objectCount++];
	}
	,painterSort: function(a,b) {
		return b.z - a.z > 0?1:-1;
	}
	,projectScene_Mesh: function(mesh) {
		var geometry = mesh.geometry;
		var vertices = geometry.vertices;
		var faces = geometry.faces;
		var faceVertexUvs = geometry.faceVertexUvs;
		var visible = false;
		this.normalMatrix.getNormalMatrix(this.modelMatrix);
		var isFaceMaterial = js.Boot.__instanceof(mesh.material,three.materials.MeshFaceMaterial);
		var objectMaterials = isFaceMaterial == true?mesh.material:null;
		var v = 0, vl = vertices.length;
		while(v < vl) {
			this.vertexCurrent = this.getNextVertexInPool();
			this.vertexCurrent.positionWorld.copy(vertices[v]);
			this.vertexCurrent.positionWorld.applyMatrix4(this.modelMatrix);
			this.vertexCurrent.positionScreen.x = this.vertexCurrent.positionWorld.x;
			this.vertexCurrent.positionScreen.y = this.vertexCurrent.positionWorld.y;
			this.vertexCurrent.positionScreen.z = this.vertexCurrent.positionWorld.z;
			this.vertexCurrent.positionScreen.w = 1;
			this.vertexCurrent.positionScreen.applyMatrix4(this.viewProjectionMatrix);
			this.vertexCurrent.positionScreen.x /= this.vertexCurrent.positionScreen.w;
			this.vertexCurrent.positionScreen.y /= this.vertexCurrent.positionScreen.w;
			this.vertexCurrent.positionScreen.z /= this.vertexCurrent.positionScreen.w;
			this.vertexCurrent.visible = !(this.vertexCurrent.positionScreen.x < -1 || this.vertexCurrent.positionScreen.x > 1 || this.vertexCurrent.positionScreen.y < -1 || this.vertexCurrent.positionScreen.y > 1 || this.vertexCurrent.positionScreen.z < -1 || this.vertexCurrent.positionScreen.z > 1);
			v++;
		}
		var f = 0, fl = faces.length;
		while(f < fl) {
			var type = 3;
			var face = faces[f++];
			var material = isFaceMaterial == true?(js.Boot.__cast(mesh.material , three.materials.MeshFaceMaterial)).materials[face.materialIndex]:mesh.material;
			if(material == null) continue;
			var side = material.side;
			if(js.Boot.__instanceof(face,three.core.Face4) == true) {
				var v1 = this.vertexPool[face.a];
				var v2 = this.vertexPool[face.b];
				var v3 = this.vertexPool[face.c];
				var v4 = this.vertexPool[face.d];
				this.points4[0] = v1.positionScreen;
				this.points4[1] = v2.positionScreen;
				this.points4[2] = v3.positionScreen;
				this.points4[3] = v4.positionScreen;
				if(v1.visible == true || v2.visible == true || v3.visible == true || v4.visible == true || this.clipBox.isIntersectionBox(this.boundingBox.setFromPoints(this.points4)) == true) {
					visible = (v4.positionScreen.x - v1.positionScreen.x) * (v2.positionScreen.y - v1.positionScreen.y) - (v4.positionScreen.y - v1.positionScreen.y) * (v2.positionScreen.x - v1.positionScreen.x) < 0 || (v2.positionScreen.x - v3.positionScreen.x) * (v4.positionScreen.y - v3.positionScreen.y) - (v2.positionScreen.y - v3.positionScreen.y) * (v4.positionScreen.x - v3.positionScreen.x) < 0;
					if(side == three.THREE.DoubleSide || visible == (side == three.THREE.FrontSide)) {
						this.face4Current = this.getNextFace4InPool();
						this.face4Current.v1.copy(v1);
						this.face4Current.v2.copy(v2);
						this.face4Current.v3.copy(v3);
						this.face4Current.v4.copy(v4);
						type = 4;
					} else continue;
				} else continue;
			} else if(js.Boot.__instanceof(face,three.core.Face3) == true) {
				var v1 = this.vertexPool[face.a];
				var v2 = this.vertexPool[face.b];
				var v3 = this.vertexPool[face.c];
				this.points3[0] = v1.positionScreen;
				this.points3[1] = v2.positionScreen;
				this.points3[2] = v3.positionScreen;
				if(v1.visible == true || v2.visible == true || v3.visible == true || this.clipBox.isIntersectionBox(this.boundingBox.setFromPoints(this.points3)) == true) {
					visible = (v3.positionScreen.x - v1.positionScreen.x) * (v2.positionScreen.y - v1.positionScreen.y) - (v3.positionScreen.y - v1.positionScreen.y) * (v2.positionScreen.x - v1.positionScreen.x) < 0;
					if(side == three.THREE.DoubleSide || visible == (side == three.THREE.FrontSide)) {
						this.face3Current = this.getNextFace3InPool();
						this.face3Current.v1.copy(v1);
						this.face3Current.v2.copy(v2);
						this.face3Current.v3.copy(v3);
					} else continue;
				} else continue;
			}
			var current = type == 4?this.face4Current:this.face3Current;
			current.normalModel.copy(face.normal);
			if(visible == false && (side == three.THREE.BackSide || side == three.THREE.DoubleSide)) current.normalModel.negate();
			current.normalModel.applyMatrix3(this.normalMatrix);
			current.normalModel.normalize();
			current.normalModelView.copy(current.normalModel);
			current.normalModelView.applyMatrix3(this.normalViewMatrix);
			current.centroidModel.copy(face.centroid);
			current.centroidModel.applyMatrix4(this.modelMatrix);
			var faceVertexNormals = face.vertexNormals;
			var n = 0, nl = faceVertexNormals.length;
			while(n < nl) {
				var normalModel = current.vertexNormalsModel[n];
				normalModel.copy(faceVertexNormals[n]);
				if(visible == false && (side == three.THREE.BackSide || side == three.THREE.DoubleSide)) normalModel.negate();
				normalModel.applyMatrix3(this.normalMatrix);
				normalModel.normalize();
				var normalModelView = current.vertexNormalsModelView[n];
				normalModelView.copy(normalModel);
				normalModelView.applyMatrix3(this.normalViewMatrix);
				n++;
			}
			current.vertexNormalsLength = faceVertexNormals.length;
			var c = 0, cl = faceVertexUvs.length;
			while(c < cl) {
				var uvs = faceVertexUvs[c][f - 1];
				if(uvs == null) continue;
				var u = 0, ul = uvs.length;
				while(u < ul) {
					current.uvs[c][u] = uvs[u];
					u++;
				}
				c++;
			}
			current.color = face.color;
			current.material = material;
			this.centroid.copy(current.centroidModel);
			this.centroid.applyProjection(this.viewProjectionMatrix);
			current.z = this.centroid.z;
			this.renderData.elements.push(current);
		}
	}
	,projectScene: function(scene,camera,sortObjects,sortElements) {
		if(sortElements == null) sortElements = true;
		if(sortObjects == null) sortObjects = true;
		var object;
		this.face3Count = 0;
		this.face4Count = 0;
		this.lineCount = 0;
		this.particleCount = 0;
		this.renderData.elements = new Array();
		if(scene.autoUpdate == true) scene.updateMatrixWorld();
		if(camera.parent == null) camera.updateMatrixWorld();
		this.viewMatrix.copy(camera.matrixWorldInverse.getInverse(camera.matrixWorld));
		this.viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix,this.viewMatrix);
		this.normalViewMatrix.getNormalMatrix(this.viewMatrix);
		this.frustum.setFromMatrix(this.viewProjectionMatrix);
		this.projectGraph(scene,sortObjects);
		var o = 0, ol = this.renderData.objects.length;
		while(o < ol) {
			object = this.renderData.objects[o].object;
			this.modelMatrix = object.matrixWorld;
			this.vertexCount = 0;
			if(js.Boot.__instanceof(object,three.objects.Mesh) == true) this.projectScene_Mesh(js.Boot.__cast(object , three.objects.Mesh));
			o++;
		}
		if(sortElements == true) this.renderData.elements.sort($bind(this,this.painterSort));
		return this.renderData;
	}
	,projectGraph: function(root,sortObjects) {
		if(sortObjects == null) sortObjects = true;
		this.objectCount = 0;
		this.renderData.objects = new Array();
		this.projectObject(root);
		if(sortObjects == true) this.renderData.objects.sort($bind(this,this.painterSort));
		return this.renderData;
	}
	,projectObject: function(parent) {
		var cIter = parent.children.iterator();
		while(cIter.hasNext() == true) {
			var object = cIter.next();
			if(object.visible == false) continue;
			if(object.type == three.THREE.Light) this.renderData.lights.push(js.Boot.__cast(object , three.lights.Light)); else if(object.type == three.THREE.Mesh) {
				if(object.frustumCulled == false || this.frustum.intersectsObject(object) == true) {
					this.objectCurrent = this.getNextObjectInPool();
					this.objectCurrent.object = object;
					if(object.renderDepth != null) this.objectCurrent.z = object.renderDepth; else {
						var v1 = new three.math.Vector3();
						v1.getPositionFromMatrix(object.matrixWorld);
						v1.applyProjection(this.viewProjectionMatrix);
						this.objectCurrent.z = v1.z;
					}
					this.renderData.objects.push(this.objectCurrent);
				}
			} else {
				this.objectCurrent = this.getNextObjectInPool();
				this.objectCurrent.object = object;
				if(object.renderDepth != null) this.objectCurrent.z = object.renderDepth; else {
					this.vector3.getPositionFromMatrix(object.matrixWorld);
					this.vector3.applyProjection(this.viewProjectionMatrix);
					this.objectCurrent.z = this.vector3.z;
				}
				this.renderData.objects.push(this.objectCurrent);
			}
			this.projectObject(object);
		}
	}
	,pickingRay: function(v,camera) {
		v.z = -1.0;
		var end = new three.math.Vector3(v.x,v.y,1.0);
		this.unprojectVector(v,camera);
		this.unprojectVector(end,camera);
		end.sub(v).normalize();
		return new three.core.Raycaster(v,end);
	}
	,unprojectVector: function(v,camera) {
		camera.projectionMatrixInverse.getInverse(camera.projectionMatrix);
		this.viewProjectionMatrix.multiplyMatrices(camera.matrixWorld,camera.projectionMatrixInverse);
		return v.applyProjection(this.viewProjectionMatrix);
	}
	,projectVector: function(v,camera) {
		camera.matrixWorldInverse.getInverse(camera.matrixWorld);
		this.viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
		return v.applyProjection(this.viewProjectionMatrix);
	}
	,__class__: three.core.Projector
}
three.core.Raycaster = function(origin,direction,near,far) {
	this.precision = 0.0001;
	this.far = 0.0;
	this.near = 0.0;
	this.ray = new three.math.Ray(origin,direction);
	if(this.ray.direction.lengthSq() > 0) this.ray.direction.normalize();
	if(near != null) this.near = near;
	if(far != null) this.far = far; else this.far = Math.POSITIVE_INFINITY;
	this.sphere = new three.math.Sphere();
	this.localRay = new three.math.Ray();
	this.facePlane = new three.math.Plane();
	this.intersectPoint = new three.math.Vector3();
	this.matrixPosition = new three.math.Vector3();
	this.inverseMatrix = new three.math.Matrix4();
};
three.core.Raycaster.__name__ = true;
three.core.Raycaster.prototype = {
	intersectObjects: function(objects,recursive) {
		if(recursive == null) recursive = true;
		var intersects = new Array();
		var objIter = objects.iterator();
		while(objIter.hasNext() == true) {
			var object = objIter.next();
			this.intersectObject(object,this,intersects);
			if(recursive == true) this.intersectDescendants(object,this,intersects);
		}
		intersects.sort(function(a,b) {
			return a.distance - b.distance < 0?-1:1;
		});
		return intersects;
	}
	,set: function(origin,direction) {
		this.ray.set(origin,direction);
		if(this.ray.direction.length() > 0) this.ray.direction.normalize();
	}
	,intersectDescendants: function(object,raycaster,intersects) {
		var descendants = object.getDescendants();
		var i = 0, l = descendants.length;
		while(i < l) this.intersectObject(descendants[i++],raycaster,intersects);
	}
	,intersectObject: function(object,raycaster,intersects) {
		if(js.Boot.__instanceof(object,three.objects.Mesh) == true) {
			var obj = js.Boot.__cast(object , three.objects.Mesh);
			this.matrixPosition.getPositionFromMatrix(obj.matrixWorld);
			this.sphere.set(this.matrixPosition,obj.geometry.boundingSphere.radius * obj.matrixWorld.getMaxScaleOnAxis());
			if(raycaster.ray.isIntersectionSphere(this.sphere) == false) return intersects;
			var geometry = obj.geometry;
			var vertices = obj.geometry.vertices;
			var isFaceMaterial = js.Boot.__instanceof(obj.material,three.materials.MeshFaceMaterial);
			var objectMaterials = isFaceMaterial == true?(js.Boot.__cast(obj.material , three.materials.MeshFaceMaterial)).materials:null;
			var side = obj.material.side;
			var a, b, c, d;
			var precision = raycaster.precision;
			this.inverseMatrix.getInverse(obj.matrixWorld);
			this.localRay.copy(raycaster.ray).applyMatrix4(this.inverseMatrix);
			var f = 0, fl = geometry.faces.length;
			while(f < fl) {
				var face = geometry.faces[f++];
				var material = isFaceMaterial == true?objectMaterials[face.materialIndex]:obj.material;
				if(material == null) continue;
				this.facePlane.setFromNormalAndCoplanarPoint(face.normal,vertices[face.a]);
				var planeDistance = this.localRay.distanceToPlane(this.facePlane);
				if(Math.abs(planeDistance) < precision) continue;
				if(planeDistance < 0) continue;
				side = material.side;
				if(side != three.THREE.DoubleSide) {
					var planeSign = this.localRay.direction.dot(this.facePlane.normal);
					if(!(planeSign == three.THREE.FrontSide?planeSign < 0:planeSign > 0)) continue;
				}
				if(planeDistance < raycaster.near || planeDistance > raycaster.far) continue;
				this.intersectPoint = this.localRay.at(planeDistance,this.intersectPoint);
				if(js.Boot.__instanceof(face,three.core.Face3) == true) {
					a = vertices[face.a];
					b = vertices[face.b];
					c = vertices[face.c];
					if(three.math.Triangle.containsPoint(this.intersectPoint,a,b,c) == false) continue;
				} else if(js.Boot.__instanceof(face,three.core.Face4) == true) {
					a = vertices[face.a];
					b = vertices[face.b];
					c = vertices[face.c];
					d = vertices[face.d];
					if(!three.math.Triangle.containsPoint(this.intersectPoint,a,b,d) && !three.math.Triangle.containsPoint(this.intersectPoint,b,c,d)) continue;
				} else console.log("Raycaster.intersectObject: invalid face type!");
				intersects.push({ distance : planeDistance, point : raycaster.ray.at(planeDistance), face : face, faceIndex : f, object : object});
			}
		}
		return intersects;
	}
	,descSort: function(a,b) {
		return a.distance - b.distance;
	}
	,__class__: three.core.Raycaster
}
three.core.RenderData = function() {
	this.objects = new Array();
	this.sprites = new Array();
	this.lights = new Array();
	this.elements = new Array();
	this.ambientLight = new three.math.Color();
};
three.core.RenderData.__name__ = true;
three.core.RenderData.prototype = {
	__class__: three.core.RenderData
}
three.extras = {}
three.extras.GeometryUtils = function() { }
three.extras.GeometryUtils.__name__ = true;
three.extras.GeometryUtils.merge = function(geometry1,object2,materialIndexOffset) {
	if(materialIndexOffset == null) materialIndexOffset = 0;
	var geometry2 = object2.geometry;
	var vertexOffset = geometry1.vertices.length;
	var uvPosition = geometry1.faceVertexUvs[0].length;
	var vertices1 = geometry1.vertices;
	var vertices2 = geometry2.vertices;
	var faces1 = geometry1.faces;
	var faces2 = geometry2.faces;
	var uvs1 = geometry1.faceVertexUvs[0];
	var uvs2 = geometry2.faceVertexUvs[0];
	if(object2.matrixAutoUpdate) object2.updateMatrix();
	var matrix = object2.matrix;
	var normalMatrix = new three.math.Matrix3().getNormalMatrix(matrix);
	var i = 0, il = vertices2.length;
	while(i < il) {
		var vertex = vertices2[i];
		var vertexCopy = vertex.clone();
		vertexCopy.applyMatrix4(matrix);
		vertices1.push(vertexCopy);
		i++;
	}
	i = 0;
	il = faces2.length;
	while(i < il) {
		var face = faces2[i];
		var faceVertexNormals = face.vertexNormals;
		var faceVertexColors = face.vertexColors;
		var faceCopy;
		if(js.Boot.__instanceof(face,three.core.Face3) == true) faceCopy = new three.core.Face3(face.a + vertexOffset,face.b + vertexOffset,face.c + vertexOffset); else faceCopy = new three.core.Face4(face.a + vertexOffset,face.b + vertexOffset,face.c + vertexOffset,face.d + vertexOffset);
		faceCopy.normal.copy(face.normal);
		faceCopy.normal.applyMatrix3(normalMatrix).normalize();
		var j = 0, jl = faceVertexNormals.length;
		while(j < jl) {
			var normal = faceVertexNormals[j].clone();
			normal.applyMatrix3(normalMatrix).normalize();
			faceCopy.vertexNormals.push(normal);
			j++;
		}
		faceCopy.color.copy(face.color);
		j = 0;
		jl = faceVertexColors.length;
		while(j < jl) {
			var color = faceVertexColors[j];
			faceCopy.vertexColors.push(color.clone());
			j++;
		}
		faceCopy.materialIndex = face.materialIndex + materialIndexOffset;
		faceCopy.centroid.copy(face.centroid);
		faceCopy.centroid.applyMatrix4(matrix);
		faces1.push(faceCopy);
		i++;
	}
	i = 0;
	il = uvs2.length;
	while(i < il) {
		var uv = uvs2[i], uvCopy = new Array();
		var j = 0, jl = uv.length;
		while(j < jl) {
			uvCopy.push(new three.math.Vector2(uv[j].x,uv[j].y));
			j++;
		}
		uvs1.push(uvCopy);
		i++;
	}
}
three.extras.MathUtils = function() { }
three.extras.MathUtils.__name__ = true;
three.extras.MathUtils.clamp = function(value,a,b) {
	return value < a?a:value > b?b:value;
}
three.extras.MathUtils.clampBottom = function(value,a) {
	return value < a?a:value;
}
three.extras.MathUtils.mapLinear = function(value,a1,a2,b1,b2) {
	return b1 + (value - a1) * (b2 - b1) / (a2 - a1);
}
three.extras.MathUtils.smoothstep = function(x,min,max) {
	if(x <= min) return 0;
	if(x >= max) return 1;
	x = (x - min) / (max - min);
	return x * x * (3 - 2 * x);
}
three.extras.MathUtils.smootherstep = function(x,min,max) {
	if(x <= min) return 0;
	if(x >= max) return 1;
	x = (x - min) / (max - min);
	return x * x * x * (x * (x * 6 - 15) + 10);
}
three.extras.MathUtils.random16 = function() {
	return (65280 * Math.random() + 255 * Math.random()) / 65535;
}
three.extras.MathUtils.randInt = function(low,high) {
	return low + Math.floor(Math.random() * (high - low + 1));
}
three.extras.MathUtils.randFloat = function(low,high) {
	return low + Math.random() * (high - low);
}
three.extras.MathUtils.randFloatSpread = function(range) {
	return range * (0.5 - Math.random());
}
three.extras.MathUtils.sign = function(x) {
	return x < 0?-1:x > 0?1:0;
}
three.extras.MathUtils.degToRad = function(deg) {
	return deg * three.extras.MathUtils.DEG2RAD;
}
three.extras.MathUtils.radToDeg = function(rad) {
	return rad * three.extras.MathUtils.RAD2DEG;
}
three.extras.Utils = function() { }
three.extras.Utils.__name__ = true;
three.extras.Utils.indexOf = function(a,value) {
	var i = 0, l = a.length;
	while(i < l) {
		var here = a[i];
		if(here == value) return i;
		i++;
	}
	return -1;
}
three.extras.Utils.get = function(arr,idx) {
	if(idx < 0) idx += arr.length;
	if(idx >= arr.length) idx %= arr.length;
	return arr[idx];
}
three.extras.geometries = {}
three.extras.geometries.CubeGeometry = function(width,height,depth,widthSegments,heightSegments,depthSegments) {
	if(depthSegments == null) depthSegments = 1;
	if(heightSegments == null) heightSegments = 1;
	if(widthSegments == null) widthSegments = 1;
	three.core.Geometry.call(this);
	this.width = width;
	this.height = height;
	this.depth = depth;
	this.widthSegments = widthSegments;
	this.heightSegments = heightSegments;
	this.depthSegments = depthSegments;
	var whalf = width / 2;
	var hhalf = height / 2;
	var dhalf = depth / 2;
	this.buildPlane("z","y",-1,-1,depth,height,whalf,0);
	this.buildPlane("z","y",1,-1,depth,height,-whalf,0);
	this.buildPlane("x","z",1,1,width,depth,hhalf,0);
	this.buildPlane("x","z",1,-1,width,depth,-hhalf,0);
	this.buildPlane("x","y",1,-1,width,height,dhalf,0);
	this.buildPlane("x","y",-1,-1,width,height,-dhalf,0);
	this.mergeVertices();
	this.computeCentroids();
};
three.extras.geometries.CubeGeometry.__name__ = true;
three.extras.geometries.CubeGeometry.__super__ = three.core.Geometry;
three.extras.geometries.CubeGeometry.prototype = $extend(three.core.Geometry.prototype,{
	buildPlane: function(u,v,udir,vdir,width,height,depth,materialIndex) {
		var w = "z", ix, iy;
		var gridX = this.widthSegments;
		var gridY = this.heightSegments;
		var whalf = width / 2;
		var hhalf = height / 2;
		var offset = this.vertices.length;
		if(u == "x" && v == "y" || u == "y" && v == "x") w = "z"; else if(u == "x" && v == "z" || u == "z" && v == "x") {
			w = "y";
			gridY = this.depthSegments;
		} else if(u == "z" && v == "y" || u == "y" && v == "z") {
			w = "x";
			gridX = this.depthSegments;
		}
		var gridX1 = gridX + 1;
		var gridY1 = gridY + 1;
		var segment_width = width / gridX;
		var segment_height = height / gridY;
		var normal = new three.math.Vector3();
		normal[w] = depth > 0?1:-1;
		var iy1 = 0;
		while(iy1 < gridY1) {
			var ix1 = 0;
			while(ix1 < gridX1) {
				var vec = new three.math.Vector3();
				vec[u] = (ix1 * segment_width - whalf) * udir;
				vec[v] = (iy1 * segment_height - hhalf) * vdir;
				vec[w] = depth;
				this.vertices.push(vec);
				ix1++;
			}
			iy1++;
		}
		iy1 = 0;
		while(iy1 < gridY) {
			ix = 0;
			while(ix < gridX) {
				var a = ix + gridX1 * iy1;
				var b = ix + gridX1 * (iy1 + 1);
				var c = ix + 1 + gridX1 * (iy1 + 1);
				var d = ix + 1 + gridX1 * iy1;
				var face = new three.core.Face4(a + offset,b + offset,c + offset,d + offset);
				face.normal.copy(normal);
				face.vertexNormals.push(normal.clone());
				face.vertexNormals.push(normal.clone());
				face.vertexNormals.push(normal.clone());
				face.vertexNormals.push(normal.clone());
				face.materialIndex = materialIndex;
				this.faces.push(face);
				this.faceVertexUvs[0].push([new three.math.Vector3(ix / gridX,1 - iy1 / gridY),new three.math.Vector3(ix / gridX,1 - (iy1 + 1) / gridY),new three.math.Vector3((ix + 1) / gridX,1 - (iy1 + 1) / gridY),new three.math.Vector3((ix + 1) / gridX,1 - iy1 / gridY)]);
				ix++;
			}
			iy1++;
		}
	}
	,__class__: three.extras.geometries.CubeGeometry
});
three.extras.geometries.PlaneGeometry = function(width,height,widthSegments,heightSegments) {
	if(heightSegments == null) heightSegments = 1;
	if(widthSegments == null) widthSegments = 1;
	three.core.Geometry.call(this);
	this.width = width;
	this.height = height;
	this.widthSegments = widthSegments;
	this.heightSegments = heightSegments;
	var whalf = width / 2;
	var hhalf = height / 2;
	var gridX = widthSegments;
	var gridZ = heightSegments;
	var gridX1 = gridX + 1;
	var gridZ1 = gridZ + 1;
	var segment_width = width / gridX;
	var segment_height = height / gridZ;
	var normal = new three.math.Vector3(0,0,1);
	var iz = 0;
	while(iz < gridZ1) {
		var ix = 0;
		while(ix < gridX1) {
			var x = ix * segment_width - whalf;
			var y = iz * segment_height - hhalf;
			this.vertices.push(new three.math.Vector3(x,-y,0));
			ix++;
		}
		iz++;
	}
	var iz1 = 0;
	while(iz1 < gridZ) {
		var ix = 0;
		while(ix < gridX) {
			var a = ix + gridX1 * iz1;
			var b = ix + gridX1 * (iz1 + 1);
			var c = ix + 1 + gridX1 * (iz1 + 1);
			var d = ix + 1 + gridX1 * iz1;
			var face = new three.core.Face4(a,b,c,d);
			face.normal.copy(normal);
			face.vertexNormals.push(normal.clone());
			face.vertexNormals.push(normal.clone());
			face.vertexNormals.push(normal.clone());
			face.vertexNormals.push(normal.clone());
			this.faces.push(face);
			this.faceVertexUvs[0].push([new three.math.Vector2(ix / gridX,1 - iz1 / gridZ),new three.math.Vector2(ix / gridX,1 - (iz1 + 1) / gridZ),new three.math.Vector2((ix + 1) / gridX,1 - (iz1 + 1) / gridZ),new three.math.Vector2((ix + 1) / gridX,1 - iz1 / gridZ)]);
			ix++;
		}
		iz1++;
	}
	this.computeCentroids();
};
three.extras.geometries.PlaneGeometry.__name__ = true;
three.extras.geometries.PlaneGeometry.__super__ = three.core.Geometry;
three.extras.geometries.PlaneGeometry.prototype = $extend(three.core.Geometry.prototype,{
	__class__: three.extras.geometries.PlaneGeometry
});
three.lights = {}
three.lights.Light = function(hex) {
	if(hex == null) hex = -1;
	three.core.Object3D.call(this);
	this.type = three.THREE.Light;
	this.color = new three.math.Color(hex);
	this.target = null;
};
three.lights.Light.__name__ = true;
three.lights.Light.__super__ = three.core.Object3D;
three.lights.Light.prototype = $extend(three.core.Object3D.prototype,{
	clone: function(object) {
		if(object != null) object = new three.lights.Light();
		three.core.Object3D.prototype.clone.call(this,js.Boot.__cast(object , three.core.Object3D));
		var light = js.Boot.__cast(object , three.lights.Light);
		light.color.copy(this.color);
		return object;
	}
	,__class__: three.lights.Light
});
three.lights.AmbientLight = function(hex) {
	if(hex == null) hex = 0;
	three.lights.Light.call(this,hex);
};
three.lights.AmbientLight.__name__ = true;
three.lights.AmbientLight.__super__ = three.lights.Light;
three.lights.AmbientLight.prototype = $extend(three.lights.Light.prototype,{
	__class__: three.lights.AmbientLight
});
three.materials = {}
three.materials.Material = function() {
	this.needsUpdate = true;
	this.visible = true;
	this.wireframeLinejoin = "round";
	this.wireframeLinecap = "round";
	this.wireframeLineWidth = 1.0;
	this.wireframe = false;
	this.overdraw = false;
	this.alphaTest = 0.0;
	this.polygonOffsetUnits = 0.0;
	this.polygonOffsetFactor = 0.0;
	this.polygonOffset = false;
	this.depthWrite = true;
	this.depthTest = true;
	this.transparent = false;
	this.opacity = 1.0;
	this.side = three.THREE.FrontSide;
	this.blending = three.THREE.NormalBlending;
	this.blendSrc = three.THREE.SrcAlphaFactor;
	this.blendDst = three.THREE.OneMinusSrcAlphaFactor;
	this.blendEquation = three.THREE.AddEquation;
	this.color = new three.math.Color(Math.round(Math.random() * 16777215));
};
three.materials.Material.__name__ = true;
three.materials.Material.prototype = {
	dispose: function() {
	}
	,clone: function(material) {
		if(material == null) material = new three.materials.Material();
		material.name = this.name;
		material.side = this.side;
		material.color.copy(this.color);
		material.opacity = this.opacity;
		material.transparent = this.transparent;
		material.blending = this.blending;
		material.blendSrc = this.blendSrc;
		material.blendDst = this.blendDst;
		material.blendEquation = this.blendEquation;
		material.depthTest = this.depthTest;
		material.depthWrite = this.depthWrite;
		material.polygonOffset = this.polygonOffset;
		material.polygonOffsetFactor = this.polygonOffsetFactor;
		material.polygonOffsetUnits = this.polygonOffsetUnits;
		material.alphaTest = this.alphaTest;
		material.overdraw = this.overdraw;
		material.visible = this.visible;
		material.wireframe = this.wireframe;
		material.wireframeLineWidth = this.wireframeLineWidth;
		material.wireframeLinecap = this.wireframeLinecap;
		material.wireframeLinejoin = this.wireframeLinejoin;
		return material;
	}
	,setValues: function(values) {
		if(values == null) return;
		var fields = Reflect.fields(values);
		var i = 0, l = fields.length;
		while(i < l) {
			var fieldName = fields[i++];
			if(Reflect.hasField(this,fieldName) == false) continue;
			var fieldValue = Reflect.getProperty(values,fieldName);
			var ourValue = Reflect.getProperty(this,fieldName);
			if(js.Boot.__instanceof(ourValue,three.math.Color) == true) (js.Boot.__cast(ourValue , three.math.Color)).set(fieldValue); else if(js.Boot.__instanceof(ourValue,three.math.Vector3) == true && js.Boot.__instanceof(fieldValue,three.math.Vector3) == true) (js.Boot.__cast(ourValue , three.math.Vector3)).copy(fieldValue); else ourValue = fieldValue;
		}
	}
	,__class__: three.materials.Material
}
three.materials.MeshBasicMaterial = function(parameters) {
	this.morphTargets = false;
	this.skinning = false;
	this.fog = true;
	this.refractionRatio = 0.98;
	this.reflectivity = 1.0;
	three.materials.Material.call(this);
	this.shading = three.THREE.SmoothShading;
	this.combine = three.THREE.MultiplyOperation;
	this.vertexColors = three.THREE.NoColors;
	this.setValues(parameters);
};
three.materials.MeshBasicMaterial.__name__ = true;
three.materials.MeshBasicMaterial.__super__ = three.materials.Material;
three.materials.MeshBasicMaterial.prototype = $extend(three.materials.Material.prototype,{
	clone: function(material) {
		var mat = new three.materials.MeshBasicMaterial();
		three.materials.Material.prototype.clone.call(this,js.Boot.__cast(mat , three.materials.Material));
		mat.map = this.map;
		mat.lightMap = this.lightMap;
		mat.specularMap = this.specularMap;
		mat.envMap = this.envMap;
		mat.combine = this.combine;
		mat.reflectivity = this.reflectivity;
		mat.refractionRatio = this.refractionRatio;
		mat.fog = this.fog;
		mat.shading = this.shading;
		mat.vertexColors = this.vertexColors;
		mat.skinning = this.skinning;
		mat.morphTargets = this.morphTargets;
		return mat;
	}
	,__class__: three.materials.MeshBasicMaterial
});
three.materials.MeshFaceMaterial = function(materials) {
	if(materials == null) this.materials = new Array(); else this.materials = materials.slice(0);
};
three.materials.MeshFaceMaterial.__name__ = true;
three.materials.MeshFaceMaterial.prototype = {
	__class__: three.materials.MeshFaceMaterial
}
three.math = {}
three.math.Box2 = function(min,max) {
	if(min == null) this.min = new three.math.Vector2(Math.POSITIVE_INFINITY,Math.POSITIVE_INFINITY); else this.min.copy(min);
	if(max == null) this.max = new three.math.Vector2(-Math.POSITIVE_INFINITY,-Math.POSITIVE_INFINITY); else this.max.copy(max);
};
three.math.Box2.__name__ = true;
three.math.Box2.prototype = {
	clone: function() {
		return new three.math.Box2().copy(this);
	}
	,equals: function(box) {
		return box.min.equals(this.min) && box.max.equals(this.max);
	}
	,translate: function(offset) {
		this.min.add(offset);
		this.max.add(offset);
		return this;
	}
	,union: function(box) {
		this.min.min(box.min);
		this.max.max(box.max);
		return this;
	}
	,intersect: function(box) {
		this.min.max(box.min);
		this.max.min(box.max);
		return this;
	}
	,distanceToPoint: function(point) {
		var v1 = new three.math.Vector2();
		var clampedPoint = v1.copy(point).clamp(this.min,this.max);
		return clampedPoint.sub(point).length();
	}
	,clampPoint: function(point,optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector2();
		return result.copy(point).clamp(this.min,this.max);
	}
	,isIntersectionBox: function(box) {
		if(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y) return false;
		return true;
	}
	,getParameter: function(point) {
		return new three.math.Vector2((point.x - this.min.x) / (this.max.x - this.min.x),(point.y - this.min.y) / (this.max.y - this.min.y));
	}
	,containsBox: function(box) {
		if(this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y) return true;
		return false;
	}
	,containsPoint: function(point) {
		if(point.x < this.min.x || point.x > this.max.x || point.y < this.min.y || point.y > this.max.y) return false;
		return true;
	}
	,expandByScalar: function(s) {
		this.min.addScalar(-s);
		this.max.addScalar(s);
		return this;
	}
	,expandByVector: function(v) {
		this.min.sub(v);
		this.max.add(v);
		return this;
	}
	,expandByPoint: function(point) {
		this.min.min(point);
		this.max.max(point);
		return this;
	}
	,size: function(optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector2();
		return result.subVectors(this.max,this.min);
	}
	,center: function(optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector2();
		return result.addVectors(this.min,this.max).multiplyScalar(0.5);
	}
	,empty: function() {
		return this.max.x < this.min.x || this.max.y < this.min.y;
	}
	,makeEmpty: function() {
		this.min.x = this.min.y = Math.POSITIVE_INFINITY;
		this.max.x = this.max.y = -Math.POSITIVE_INFINITY;
		return this;
	}
	,copy: function(box) {
		this.min.copy(box.min);
		this.max.copy(box.max);
		return this;
	}
	,setFromCenterAndSize: function(center,size) {
		var v1 = new three.math.Vector2();
		var halfSize = v1.copy(size).multiplyScalar(0.5);
		this.min.copy(center).sub(halfSize);
		this.max.copy(center).add(halfSize);
		return this;
	}
	,setFromPoints: function(points) {
		if(points.length == 0) {
			this.makeEmpty();
			return this;
		}
		var point = points[0];
		this.min.copy(point);
		this.max.copy(point);
		var i = 1, l = points.length;
		while(i < l) {
			point = points[i++];
			if(point.x < this.min.x) this.min.x = point.x; else if(point.x > this.max.x) this.max.x = point.x;
			if(point.y < this.min.y) this.min.y = point.y; else if(point.y > this.max.y) this.max.y = point.y;
		}
		return this;
	}
	,set: function(min,max) {
		this.min.copy(min);
		this.max.copy(max);
		return this;
	}
	,__class__: three.math.Box2
}
three.math.Box3 = function(min,max) {
	this.min = min != null?min:new three.math.Vector3(Math.POSITIVE_INFINITY,Math.POSITIVE_INFINITY,Math.POSITIVE_INFINITY);
	this.max = max != null?max:new three.math.Vector3(Math.NEGATIVE_INFINITY,Math.NEGATIVE_INFINITY,Math.NEGATIVE_INFINITY);
};
three.math.Box3.__name__ = true;
three.math.Box3.prototype = {
	clone: function() {
		return new three.math.Box3().copy(this);
	}
	,equals: function(box) {
		return box.min.equals(this.min) && box.max.equals(this.max);
	}
	,translate: function(offset) {
		this.min.add(offset);
		this.max.add(offset);
		return this;
	}
	,applyMatrix4: function(m) {
		var points = new Array();
		points.push(new three.math.Vector3());
		points.push(new three.math.Vector3());
		points.push(new three.math.Vector3());
		points.push(new three.math.Vector3());
		points.push(new three.math.Vector3());
		points.push(new three.math.Vector3());
		points.push(new three.math.Vector3());
		points.push(new three.math.Vector3());
		points[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(m);
		points[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(m);
		points[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(m);
		points[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(m);
		points[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(m);
		points[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(m);
		points[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(m);
		points[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(m);
		this.makeEmpty();
		this.setFromPoints(points);
		return this;
	}
	,union: function(box) {
		this.min.min(box.min);
		this.max.max(box.max);
		return this;
	}
	,intersect: function(box) {
		this.min.max(box.min);
		this.max.min(box.max);
		return this;
	}
	,getBoundingSphere: function(optTarget) {
		var v1 = new three.math.Vector3();
		var result = optTarget != null?optTarget:new three.math.Sphere();
		result.center = this.center();
		result.radius = this.size(v1).length() * 0.5;
		return result;
	}
	,distanceToPoint: function(point) {
		var v1 = point.clone();
		var clampedPoint = v1.clamp(this.min,this.max);
		return clampedPoint.sub(point).length();
	}
	,clampPoint: function(point,optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		return result.copy(point).clamp(this.min,this.max);
	}
	,isIntersectionBox: function(box) {
		if(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z) return false;
		return true;
	}
	,getParameter: function(point) {
		return new three.math.Vector3((point.x - this.min.x) / (this.max.x - this.min.x),(point.y - this.min.y) / (this.max.y - this.min.y),(point.z - this.min.z) / (this.max.z - this.min.z));
	}
	,containsBox: function(box) {
		if(this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y && this.min.z <= box.min.z && box.max.z <= this.max.z) return true;
		return false;
	}
	,containsPoint: function(point) {
		if(point.x < this.min.x || point.x > this.max.x || point.y < this.min.y || point.y > this.max.y || point.z < this.min.z || point.z > this.max.z) return false;
		return true;
	}
	,expandByScalar: function(s) {
		this.min.addScalar(-s);
		this.max.addScalar(s);
		return this;
	}
	,expandByVector: function(v) {
		this.min.sub(v);
		this.max.add(v);
		return this;
	}
	,expandByPoint: function(point) {
		this.min.min(point);
		this.max.max(point);
		return this;
	}
	,size: function(optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		return result.subVectors(this.max,this.min);
	}
	,center: function(optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		return result.addVectors(this.min,this.max).multiplyScalar(0.5);
	}
	,empty: function() {
		return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
	}
	,makeEmpty: function() {
		this.min.x = this.min.y = this.min.z = Math.POSITIVE_INFINITY;
		this.max.x = this.max.y = this.max.z = Math.NEGATIVE_INFINITY;
		return this;
	}
	,copy: function(box) {
		this.min.copy(box.min);
		this.max.copy(box.max);
		return this;
	}
	,setFromCenterAndSize: function(center,size) {
		var v1 = size.clone();
		var halfSize = v1.multiplyScalar(0.5);
		this.min.copy(center).sub(halfSize);
		this.max.copy(center).add(halfSize);
		return this;
	}
	,setFromPoints: function(points) {
		if(points.length > 0) {
			var point = points[0];
			this.min.copy(point);
			this.max.copy(point);
			var i = 0, l = points.length;
			while(i < l) {
				point = points[i];
				if(point.x < this.min.x) this.min.x = point.x; else if(point.x > this.max.x) this.max.x = point.x;
				if(point.y < this.min.y) this.min.y = point.y; else if(point.y > this.max.y) this.max.y = point.y;
				if(point.z < this.min.z) this.min.z = point.z; else if(point.z > this.max.z) this.max.z = point.z;
				i++;
			}
		} else this.makeEmpty();
		return this;
	}
	,set: function(min,max) {
		this.min.copy(min);
		this.max.copy(max);
		return this;
	}
	,__class__: three.math.Box3
}
three.math.Color = function(value) {
	this.a = 1.0;
	this.b = 1.0;
	this.g = 1.0;
	this.r = 1.0;
	if(value != null) this.set(value);
};
three.math.Color.__name__ = true;
three.math.Color.prototype = {
	toArray: function() {
		var arr = new Array();
		arr.push(this.r);
		arr.push(this.g);
		arr.push(this.b);
		arr.push(this.a);
		return arr;
	}
	,clone: function() {
		return new three.math.Color().setRGB(this.r,this.g,this.b);
	}
	,equals: function(c) {
		return c.r == this.r && c.g == this.g && c.b == this.b;
	}
	,lerp: function(c,alpha) {
		this.r += (c.r - this.r) * alpha;
		this.g += (c.g - this.g) * alpha;
		this.b += (c.b - this.b) * alpha;
		return this;
	}
	,multiplyScalar: function(s) {
		this.r *= s;
		this.g *= s;
		this.b *= s;
		return this;
	}
	,multiply: function(c) {
		this.r *= c.r;
		this.g *= c.g;
		this.b *= c.b;
		return this;
	}
	,addScalar: function(s) {
		this.r += s;
		this.g += s;
		this.b += s;
		return this;
	}
	,addColors: function(c1,c2) {
		this.r = c1.r + c2.r;
		this.g = c1.g + c2.g;
		this.b = c1.b + c2.b;
		return this;
	}
	,add: function(color) {
		this.r += color.r;
		this.g += color.g;
		this.b += color.b;
		return this;
	}
	,offsetHSL: function(h,s,l) {
		return this;
	}
	,getStyle: function() {
		var tr = Math.round(this.r * 255) | 0;
		var tg = Math.round(this.g * 255) | 0;
		var tb = Math.round(this.b * 255) | 0;
		return "rgb(" + tr + "," + tg + "," + tb + ")";
	}
	,getHSL: function() {
		return { };
	}
	,getHexString: function() {
		var hex = this.getHex();
		return "000000";
	}
	,getHex: function() {
		return Math.round(this.r * 255) << 16 ^ Math.round(this.g * 255) << 8 ^ Math.round(this.b * 255);
	}
	,convertLinearToGamma: function() {
		this.r = Math.sqrt(this.r);
		this.g = Math.sqrt(this.g);
		this.b = Math.sqrt(this.b);
		return this;
	}
	,convertGammaToLinear: function() {
		var tr = this.r, tg = this.g, tb = this.b;
		this.r = tr * tr;
		this.g = tg * tg;
		this.b = tb * tb;
		return this;
	}
	,copyLinearToGamma: function(color) {
		this.r = Math.sqrt(color.r);
		this.g = Math.sqrt(color.g);
		this.b = Math.sqrt(color.b);
		return this;
	}
	,copyGammaToLinear: function(color) {
		this.r = color.r * color.r;
		this.g = color.g * color.g;
		this.b = color.b * color.b;
		return this;
	}
	,copy: function(color) {
		this.r = color.r;
		this.g = color.g;
		this.b = color.b;
		return this;
	}
	,setStyle: function(style) {
		var r1 = new EReg("^rgb\\((\\d+),(\\d+),(\\d+)\\)$","i");
		if(r1.match(style) != null) {
			var rgbExpr = new EReg("^rgb\\((\\d+),(\\d+),(\\d+)\\)$","i");
			var color = rgbExpr.split(style);
			this.r = Math.min(255,Std.parseInt(color[1])) / 255;
			this.g = Math.min(255,Std.parseInt(color[2])) / 255;
			this.b = Math.min(255,Std.parseInt(color[3])) / 255;
			return this;
		}
		return this;
	}
	,setHSL: function(h,s,l) {
		if(s == 0) this.r = this.g = this.b = l; else {
			var p = l <= 0.5?l * (1 + s):l + s - l * s;
			var q = 2 * l - p;
			this.r = this.hue2rgb(q,p,h + 1 / 3);
			this.g = this.hue2rgb(q,p,h);
			this.b = this.hue2rgb(q,p,h - 1 / 3);
		}
		return this;
	}
	,hue2rgb: function(p,q,t) {
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1 / 6) return p + (q - p) * 6 * t;
		if(t < 0.5) return q;
		if(t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
		return p;
	}
	,setRGB: function(r,g,b) {
		this.r = r;
		this.g = g;
		this.b = b;
		return this;
	}
	,setHex: function(hex) {
		this.r = (hex >> 16 & 255) / 255;
		this.g = (hex >> 8 & 255) / 255;
		this.b = (hex & 255) / 255;
		return this;
	}
	,set: function(value) {
		if(js.Boot.__instanceof(value,three.math.Color) == true) this.copy(value); else if(js.Boot.__instanceof(value,Int) == true) this.setHex(value); else if(js.Boot.__instanceof(value,String) == true) this.setStyle(value);
		return this;
	}
	,__class__: three.math.Color
}
three.math.Frustum = function(p0,p1,p2,p3,p4,p5) {
	this.planes = new Array();
	this.planes.push(p0 != null?p0:new three.math.Plane());
	this.planes.push(p1 != null?p1:new three.math.Plane());
	this.planes.push(p2 != null?p2:new three.math.Plane());
	this.planes.push(p3 != null?p3:new three.math.Plane());
	this.planes.push(p4 != null?p4:new three.math.Plane());
	this.planes.push(p5 != null?p5:new three.math.Plane());
};
three.math.Frustum.__name__ = true;
three.math.Frustum.prototype = {
	clone: function() {
		return new three.math.Frustum().copy(this);
	}
	,containsPoint: function(point) {
		var i = 0;
		while(i < 6) {
			if(this.planes[i].distanceToPoint(point) < 0) return false;
			i++;
		}
		return true;
	}
	,intersectsSphere: function(sphere) {
		var center = sphere.center;
		var negRadius = -sphere.radius;
		var i = 0;
		while(i < 6) {
			var distance = this.planes[i].distanceToPoint(center);
			if(distance < negRadius) return false;
			i++;
		}
		return true;
	}
	,intersectsObject: function(object) {
		var object1 = js.Boot.__cast(object , three.objects.Mesh);
		var center = new three.math.Vector3();
		var matrix = object1.matrixWorld;
		var negRadius = -object1.geometry.boundingSphere.radius * matrix.getMaxScaleOnAxis();
		center.getPositionFromMatrix(matrix);
		var i = 0;
		while(i < 6) {
			var distance = this.planes[i].distanceToPoint(center);
			if(distance < negRadius) return false;
			i++;
		}
		return true;
	}
	,setFromMatrix: function(m) {
		var me = m.elements;
		var me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
		var me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
		var me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
		var me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];
		this.planes[0].setComponents(me3 - me0,me7 - me4,me11 - me8,me15 - me12).normalize();
		this.planes[1].setComponents(me3 + me0,me7 + me4,me11 + me8,me15 + me12).normalize();
		this.planes[2].setComponents(me3 + me1,me7 + me5,me11 + me9,me15 + me13).normalize();
		this.planes[3].setComponents(me3 - me1,me7 - me5,me11 - me9,me15 - me13).normalize();
		this.planes[4].setComponents(me3 - me2,me7 - me6,me11 - me10,me15 - me14).normalize();
		this.planes[5].setComponents(me3 + me2,me7 + me6,me11 + me10,me15 + me14).normalize();
		return this;
	}
	,copy: function(frustum) {
		var i = 0;
		while(i < 6) {
			this.planes[i].copy(frustum.planes[i]);
			i++;
		}
		return this;
	}
	,set: function(p0,p1,p2,p3,p4,p5) {
		this.planes[0].copy(p0);
		this.planes[1].copy(p1);
		this.planes[2].copy(p2);
		this.planes[3].copy(p3);
		this.planes[4].copy(p4);
		this.planes[5].copy(p5);
		return this;
	}
	,__class__: three.math.Frustum
}
three.math.Line3 = function(start,end) {
	this.start = start != null?start:new three.math.Vector3();
	this.end = end != null?end:new three.math.Vector3();
};
three.math.Line3.__name__ = true;
three.math.Line3.prototype = {
	clone: function() {
		return new three.math.Line3().copy(this);
	}
	,equals: function(line) {
		return line.start.equals(this.start) && line.end.equals(this.end);
	}
	,applyMatrix4: function(m) {
		this.start.applyMatrix4(m);
		this.end.applyMatrix4(m);
		return this;
	}
	,closestPointToPointParameter: function(point,clampToLine) {
		if(clampToLine == null) clampToLine = false;
		var startP = new three.math.Vector3();
		var startEnd = new three.math.Vector3();
		startP.subVectors(point,this.start);
		startEnd.subVectors(this.end,this.start);
		var startEnd2 = startEnd.dot(startEnd);
		var startEnd_startP = startEnd.dot(startP);
		var t = startEnd_startP / startEnd2;
		if(clampToLine == true) t = three.extras.MathUtils.clamp(t,0,1);
		return t;
	}
	,at: function(t,optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		return this.delta(result).multiplyScalar(t).add(this.start);
	}
	,distance: function() {
		return this.start.distanceTo(this.end);
	}
	,distanceSq: function() {
		return this.start.distanceToSquared(this.end);
	}
	,delta: function(optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		return result.subVectors(this.end,this.start);
	}
	,center: function(optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		return result.addVectors(this.start,this.end).multiplyScalar(0.5);
	}
	,copy: function(line) {
		this.start.copy(line.start);
		this.end.copy(line.end);
		return this;
	}
	,set: function(start,end) {
		this.start.copy(start);
		this.end.copy(end);
		return this;
	}
	,__class__: three.math.Line3
}
three.math.Matrix3 = function(n11,n12,n13,n21,n22,n23,n31,n32,n33) {
	if(n33 == null) n33 = 1;
	if(n32 == null) n32 = 0;
	if(n31 == null) n31 = 0;
	if(n23 == null) n23 = 0;
	if(n22 == null) n22 = 1;
	if(n21 == null) n21 = 0;
	if(n13 == null) n13 = 0;
	if(n12 == null) n12 = 0;
	if(n11 == null) n11 = 1;
	this.elements = new Array();
	var i = 0;
	while(i++ < 9) this.elements.push(0.0);
	this.set(n11,n12,n13,n21,n22,n23,n31,n32,n33);
};
three.math.Matrix3.__name__ = true;
three.math.Matrix3.prototype = {
	clone: function() {
		var e = this.elements;
		return new three.math.Matrix3(e[0],e[3],e[6],e[1],e[4],e[7],e[2],e[5],e[8]);
	}
	,transposeIntoArray: function(r) {
		var m = this.elements;
		r[0] = m[0];
		r[1] = m[3];
		r[2] = m[6];
		r[3] = m[1];
		r[4] = m[4];
		r[5] = m[7];
		r[6] = m[2];
		r[7] = m[5];
		r[8] = m[8];
		return this;
	}
	,getNormalMatrix: function(m) {
		return this.getInverse(m).transpose();
	}
	,transpose: function() {
		var tmp, m = this.elements;
		tmp = m[1];
		m[1] = m[3];
		m[3] = tmp;
		tmp = m[2];
		m[2] = m[6];
		m[6] = tmp;
		tmp = m[5];
		m[5] = m[7];
		m[7] = tmp;
		return this;
	}
	,getInverse: function(m) {
		var me = m.elements;
		var te = this.elements;
		te[0] = me[10] * me[5] - me[6] * me[9];
		te[1] = -me[10] * me[1] + me[2] * me[9];
		te[2] = me[6] * me[1] - me[2] * me[5];
		te[3] = -me[10] * me[4] + me[6] * me[8];
		te[4] = me[10] * me[0] - me[2] * me[8];
		te[5] = -me[6] * me[0] + me[2] * me[4];
		te[6] = me[9] * me[4] - me[5] * me[8];
		te[7] = -me[9] * me[0] + me[1] * me[8];
		te[8] = me[5] * me[0] - me[1] * me[4];
		var det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];
		if(det == 0) {
			console.log("Matrix3.getInverse: cant invert matrix, determinant is 0");
			this.identity();
			return this;
		}
		this.multiplyScalar(1.0 / det);
		return this;
	}
	,determinant: function() {
		var te = this.elements;
		var a = te[0], b = te[1], c = te[2];
		var d = te[3], e = te[4], f = te[5];
		var g = te[6], h = te[7], i = te[8];
		return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
	}
	,multiplyScalar: function(s) {
		var e = this.elements;
		e[0] *= s;
		e[3] *= s;
		e[6] *= s;
		e[1] *= s;
		e[4] *= s;
		e[7] *= s;
		e[2] *= s;
		e[5] *= s;
		e[8] *= s;
		return this;
	}
	,multiplyVector3Array: function(a) {
		var v1 = new three.math.Vector3();
		var i = 0, il = a.length;
		while(i < il) {
			v1.x = a[i];
			v1.y = a[i + 1];
			v1.z = a[i + 2];
			v1.applyMatrix3(this);
			a[i] = v1.x;
			a[i + 1] = v1.y;
			a[i + 2] = v1.z;
			i++;
		}
		return a;
	}
	,multiplyVector3: function(v) {
		return v.applyMatrix3(this);
	}
	,copy: function(m) {
		var me = m.elements;
		this.set(me[0],me[3],me[6],me[1],me[4],me[7],me[2],me[5],me[8]);
		return this;
	}
	,identity: function() {
		this.set(1,0,0,0,1,0,0,0,1);
		return this;
	}
	,set: function(n11,n12,n13,n21,n22,n23,n31,n32,n33) {
		if(n33 == null) n33 = 1;
		if(n32 == null) n32 = 0;
		if(n31 == null) n31 = 0;
		if(n23 == null) n23 = 0;
		if(n22 == null) n22 = 1;
		if(n21 == null) n21 = 0;
		if(n13 == null) n13 = 0;
		if(n12 == null) n12 = 0;
		if(n11 == null) n11 = 1;
		var e = this.elements;
		e[0] = n11;
		e[3] = n12;
		e[6] = n13;
		e[1] = n21;
		e[4] = n22;
		e[7] = n23;
		e[2] = n31;
		e[5] = n32;
		e[8] = n33;
		return this;
	}
	,__class__: three.math.Matrix3
}
three.math.Matrix4 = function(n11,n12,n13,n14,n21,n22,n23,n24,n31,n32,n33,n34,n41,n42,n43,n44) {
	if(n44 == null) n44 = 1;
	if(n43 == null) n43 = 0;
	if(n42 == null) n42 = 0;
	if(n41 == null) n41 = 0;
	if(n34 == null) n34 = 0;
	if(n33 == null) n33 = 1;
	if(n32 == null) n32 = 0;
	if(n31 == null) n31 = 0;
	if(n24 == null) n24 = 0;
	if(n23 == null) n23 = 0;
	if(n22 == null) n22 = 1;
	if(n21 == null) n21 = 0;
	if(n14 == null) n14 = 0;
	if(n13 == null) n13 = 0;
	if(n12 == null) n12 = 0;
	if(n11 == null) n11 = 1;
	this.elements = new Array();
	var i = 0;
	while(i++ < 16) this.elements.push(0.0);
	this.set(n11,n12,n13,n14,n21,n22,n23,n24,n31,n32,n33,n34,n41,n42,n43,n44);
};
three.math.Matrix4.__name__ = true;
three.math.Matrix4.prototype = {
	decompose: function(position,quaternion,scale) {
		var te = this.elements;
		var ax = new three.math.Vector3(te[0],te[1],te[2]);
		var ay = new three.math.Vector3(te[4],te[5],te[6]);
		var az = new three.math.Vector3(te[8],te[9],te[10]);
		var matrix = new three.math.Matrix4();
		if(position == null) position = new three.math.Vector3();
		if(quaternion == null) quaternion = new three.math.Quaternion();
		if(scale == null) scale = new three.math.Vector3();
		scale.x = ax.length();
		scale.y = ay.length();
		scale.z = az.length();
		position.x = te[12];
		position.y = te[13];
		position.z = te[14];
		matrix.copy(this);
		var me = matrix.elements;
		me[0] /= scale.x;
		me[1] /= scale.x;
		me[2] /= scale.x;
		me[4] /= scale.y;
		me[5] /= scale.y;
		me[6] /= scale.y;
		me[8] /= scale.z;
		me[9] /= scale.z;
		me[10] /= scale.z;
		quaternion.setFromRotationMatrix(matrix);
		var arr = new Array();
		arr.push(position);
		arr.push(quaternion);
		arr.push(scale);
		return arr;
	}
	,clone: function() {
		var te = this.elements;
		return new three.math.Matrix4(te[0],te[4],te[8],te[12],te[1],te[5],te[9],te[13],te[2],te[6],te[10],te[14],te[3],te[7],te[11],te[15]);
	}
	,makeOrthographic: function(left,right,top,bottom,near,far) {
		var te = this.elements;
		var w = right - left;
		var h = top - bottom;
		var p = far - near;
		var tx = (right + left) / w;
		var ty = (top + bottom) / h;
		var tz = (far + near) / p;
		te[0] = 2 / w;
		te[4] = 0;
		te[8] = 0;
		te[12] = -tx;
		te[1] = 0;
		te[5] = 2 / h;
		te[9] = 0;
		te[13] = -ty;
		te[2] = 0;
		te[6] = 0;
		te[10] = -2 / p;
		te[14] = -tz;
		te[3] = 0;
		te[7] = 0;
		te[11] = 0;
		te[15] = 1;
		return this;
	}
	,makePerspective: function(fov,aspect,near,far) {
		var ymax = near * Math.tan(three.extras.MathUtils.degToRad(fov * 0.5));
		var ymin = -ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;
		return this.makeFrustum(xmin,xmax,ymin,ymax,near,far);
	}
	,makeFrustum: function(left,right,bottom,top,near,far) {
		var te = this.elements;
		var tx = 2 * near / (right - left);
		var ty = 2 * near / (top - bottom);
		var a = (right + left) / (right - left);
		var b = (top + bottom) / (top - bottom);
		var c = -(far + near) / (far - near);
		var d = -2 * far * near / (far - near);
		te[0] = tx;
		te[4] = 0;
		te[8] = a;
		te[12] = 0;
		te[1] = 0;
		te[5] = ty;
		te[9] = b;
		te[13] = 0;
		te[2] = 0;
		te[6] = 0;
		te[10] = c;
		te[14] = d;
		te[3] = 0;
		te[7] = 0;
		te[11] = -1;
		te[15] = 0;
		return this;
	}
	,makeFromPositionEulerScale: function(vpos,vrot,vscale,order) {
		if(order == null) order = "XYZ";
		this.makeRotationFromEuler(vrot,order);
		this.scale(vscale);
		this.setPosition(vpos);
		return this;
	}
	,makeFromPositionQuaternionScale: function(vpos,q,vscale) {
		this.makeRotationFromQuaternion(q);
		this.scale(vscale);
		this.setPosition(vpos);
		return this;
	}
	,compose: function(vpos,q,vscale) {
		return this.makeFromPositionQuaternionScale(vpos,q,vscale);
	}
	,makeScale: function(x,y,z) {
		this.set(x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1);
		return this;
	}
	,makeRotationAxis: function(axis,angle) {
		var c = Math.cos(angle);
		var s = Math.sin(angle);
		var t = 1 - c;
		var ax = axis.x, ay = axis.y, az = axis.z;
		var tx = t * ax, ty = t * ay;
		this.set(tx * ax + c,tx * ay - s * az,tx * az + s * ay,0,tx * ay + s * az,ty * ay + c,ty * az - s * ax,0,tx * az - s * ay,ty * az + s * ax,t * az * az + c,0,0,0,0,1);
		return this;
	}
	,makeRotationZ: function(theta) {
		var c = Math.cos(theta), s = Math.sin(theta);
		this.set(c,-s,0,0,s,c,0,0,0,0,1,0,0,0,0,1);
		return this;
	}
	,makeRotationY: function(theta) {
		var c = Math.cos(theta), s = Math.sin(theta);
		this.set(c,0,s,0,0,1,0,0,-s,0,c,0,0,0,0,1);
		return this;
	}
	,makeRotationX: function(theta) {
		var c = Math.cos(theta), s = Math.sin(theta);
		this.set(1,0,0,0,0,c,-s,0,0,s,c,0,0,0,0,1);
		return this;
	}
	,makeTranslation: function(x,y,z) {
		this.set(1,0,0,x,0,1,0,y,0,0,1,z,0,0,0,1);
		return this;
	}
	,getMaxScaleOnAxis: function() {
		var te = this.elements;
		var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
		var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
		var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
		return Math.sqrt(Math.max(scaleXSq,Math.max(scaleYSq,scaleZSq)));
	}
	,scale: function(v) {
		var te = this.elements;
		var x = v.x, y = v.y, z = v.z;
		te[0] *= x;
		te[4] *= y;
		te[8] *= z;
		te[1] *= x;
		te[5] *= y;
		te[9] *= z;
		te[2] *= x;
		te[6] *= y;
		te[10] *= z;
		te[3] *= x;
		te[7] *= y;
		te[11] *= z;
		return this;
	}
	,getInverse: function(m) {
		var te = this.elements;
		var me = m.elements;
		var n11 = me[0], n12 = me[4], n13 = me[8], n14 = me[12];
		var n21 = me[1], n22 = me[5], n23 = me[9], n24 = me[13];
		var n31 = me[2], n32 = me[6], n33 = me[10], n34 = me[14];
		var n41 = me[3], n42 = me[7], n43 = me[11], n44 = me[15];
		te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
		var det = me[0] * te[0] + me[1] * te[4] + me[2] * te[8] + me[3] * te[12];
		if(det == 0) {
			console.log("Matrix4.getInverse: cant invert matrix, determinant is 0");
			this.identity();
			return this;
		}
		this.multiplyScalar(1 / det);
		return this;
	}
	,setPosition: function(v) {
		var te = this.elements;
		te[12] = v.x;
		te[13] = v.y;
		te[14] = v.z;
		return this;
	}
	,getPosition: function() {
		var te = this.elements;
		return new three.math.Vector3(te[12],te[13],te[14]);
	}
	,flattenToArrayOffset: function(flat,offset) {
		var te = this.elements;
		flat[offset] = te[0];
		flat[offset + 1] = te[1];
		flat[offset + 2] = te[2];
		flat[offset + 3] = te[3];
		flat[offset + 4] = te[4];
		flat[offset + 5] = te[5];
		flat[offset + 6] = te[6];
		flat[offset + 7] = te[7];
		flat[offset + 8] = te[8];
		flat[offset + 9] = te[9];
		flat[offset + 10] = te[10];
		flat[offset + 11] = te[11];
		flat[offset + 12] = te[12];
		flat[offset + 13] = te[13];
		flat[offset + 14] = te[14];
		flat[offset + 15] = te[15];
		return flat;
	}
	,flattenToArray: function(flat) {
		if(flat == null) {
			flat = new Array();
			var i = 0;
			while(i++ < 16) flat.push(0.0);
		}
		var te = this.elements;
		flat[0] = te[0];
		flat[1] = te[1];
		flat[2] = te[2];
		flat[3] = te[3];
		flat[4] = te[4];
		flat[5] = te[5];
		flat[6] = te[6];
		flat[7] = te[7];
		flat[8] = te[8];
		flat[9] = te[9];
		flat[10] = te[10];
		flat[11] = te[11];
		flat[12] = te[12];
		flat[13] = te[13];
		flat[14] = te[14];
		flat[15] = te[15];
		return flat;
	}
	,transpose: function() {
		var te = this.elements;
		var tmp;
		tmp = te[1];
		te[1] = te[4];
		te[4] = tmp;
		tmp = te[2];
		te[2] = te[8];
		te[8] = tmp;
		tmp = te[6];
		te[6] = te[9];
		te[9] = tmp;
		tmp = te[3];
		te[3] = te[12];
		te[12] = tmp;
		tmp = te[7];
		te[7] = te[13];
		te[13] = tmp;
		tmp = te[11];
		te[11] = te[14];
		te[14] = tmp;
		return this;
	}
	,determinant: function() {
		var te = this.elements;
		var n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
		var n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
		var n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
		var n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
		return n41 * (n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
	}
	,crossVector: function(v) {
		return v.applyMatrix4(this);
	}
	,rotateAxis: function(v) {
		v.transformDirection(this);
	}
	,multiplyVector3Array: function(a) {
		var v1 = new three.math.Vector3();
		var i = 0, il = a.length;
		while(i < il) {
			v1.x = a[i];
			v1.y = a[i + 1];
			v1.z = a[i + 2];
			v1.applyProjection(this);
			a[i] = v1.x;
			a[i + 1] = v1.y;
			a[i + 2] = v1.z;
			i += 3;
		}
		return a;
	}
	,multiplyVector4: function(v) {
		return v.applyMatrix4(this);
	}
	,multiplyVector3: function(v) {
		return v.applyProjection(this);
	}
	,multiplyScalar: function(s) {
		var te = this.elements;
		te[0] *= s;
		te[4] *= s;
		te[8] *= s;
		te[12] *= s;
		te[1] *= s;
		te[5] *= s;
		te[9] *= s;
		te[13] *= s;
		te[2] *= s;
		te[6] *= s;
		te[10] *= s;
		te[14] *= s;
		te[3] *= s;
		te[7] *= s;
		te[11] *= s;
		te[15] *= s;
		return this;
	}
	,multiplyToArray: function(a,b,r) {
		var te = this.elements;
		this.multiplyMatrices(a,b);
		r[0] = te[0];
		r[1] = te[1];
		r[2] = te[2];
		r[3] = te[3];
		r[4] = te[4];
		r[5] = te[5];
		r[6] = te[6];
		r[7] = te[7];
		r[8] = te[8];
		r[9] = te[9];
		r[10] = te[10];
		r[11] = te[11];
		r[12] = te[12];
		r[13] = te[13];
		r[14] = te[14];
		r[15] = te[15];
		return this;
	}
	,multiplyMatrices: function(a,b) {
		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;
		var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
		var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
		var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
		var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
		var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
		var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
		var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
		var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
		te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
		te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
		te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
		te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
		return this;
	}
	,multiply: function(m,n) {
		if(n != null) return this.multiplyMatrices(m,n);
		return this.multiplyMatrices(this,m);
	}
	,lookAt: function(eye,target,up) {
		var x = new three.math.Vector3(), y = new three.math.Vector3(), z = new three.math.Vector3();
		var te = this.elements;
		z.subVectors(eye,target).normalize();
		if(z.length() == 0) z.z = 1;
		x.crossVectors(up,z).normalize();
		if(x.length() == 0) {
			z.x += 0.0001;
			x.crossVectors(up,z).normalize();
		}
		y.crossVectors(z,x);
		te[0] = x.x;
		te[4] = y.x;
		te[8] = z.x;
		te[1] = x.y;
		te[5] = y.y;
		te[9] = z.y;
		te[2] = x.z;
		te[6] = y.z;
		te[10] = z.z;
		return this;
	}
	,makeRotationFromQuaternion: function(q) {
		var te = this.elements;
		var x2 = q.x + q.x, y2 = q.y + q.y, z2 = q.z + q.z;
		var xx = q.x * x2, xy = q.x * y2, xz = q.x * z2;
		var yy = q.y * y2, yz = q.y * z2, zz = q.z * z2;
		var wx = q.w * x2, wy = q.w * y2, wz = q.w * z2;
		te[0] = 1 - (yy + zz);
		te[4] = xy - wz;
		te[8] = xz + wy;
		te[1] = xy + wz;
		te[5] = 1 - (xx + zz);
		te[9] = yz - wx;
		te[2] = xz - wy;
		te[6] = yz + wx;
		te[10] = 1 - (xx + yy);
		te[3] = 0;
		te[7] = 0;
		te[11] = 0;
		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;
		return this;
	}
	,setRotationFromQuaternion: function(q) {
		return this.makeRotationFromQuaternion(q);
	}
	,makeRotationFromEuler: function(v,order) {
		if(order == null) order = "XYZ";
		var te = this.elements;
		var a = Math.cos(v.x), b = Math.sin(v.x);
		var c = Math.cos(v.y), d = Math.sin(v.y);
		var e = Math.cos(v.z), f = Math.sin(v.z);
		if(order == "XYZ") {
			var ae = a * e, af = a * f, be = b * e, bf = b * f;
			te[0] = c * e;
			te[4] = -c * f;
			te[8] = d;
			te[1] = af + be * d;
			te[5] = ae - bf * d;
			te[9] = -b * c;
			te[2] = bf - ae * d;
			te[6] = be + af * d;
			te[10] = a * c;
		}
		te[3] = 0;
		te[7] = 0;
		te[11] = 0;
		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;
		return this;
	}
	,setRotationFromEuler: function(v,order) {
		if(order == null) order = "XYZ";
		return this.makeRotationFromEuler(v,order);
	}
	,extractRotation: function(m) {
		var v1 = new three.math.Vector3();
		var te = this.elements;
		var me = m.elements;
		var scaleX = 1 / v1.set(me[0],me[1],me[2]).length();
		var scaleY = 1 / v1.set(me[4],me[5],me[6]).length();
		var scaleZ = 1 / v1.set(me[8],me[9],me[10]).length();
		te[0] = me[0] * scaleX;
		te[1] = me[1] * scaleX;
		te[2] = me[2] * scaleX;
		te[4] = me[4] * scaleY;
		te[5] = me[5] * scaleY;
		te[6] = me[6] * scaleY;
		te[8] = me[8] * scaleZ;
		te[9] = me[9] * scaleZ;
		te[10] = me[10] * scaleZ;
		return this;
	}
	,copyPosition: function(m) {
		var te = this.elements;
		var me = m.elements;
		te[12] = me[12];
		te[13] = me[13];
		te[14] = me[14];
		return this;
	}
	,extractPosition: function(m) {
		return this.copyPosition(m);
	}
	,copy: function(m) {
		var me = m.elements;
		this.set(me[0],me[4],me[8],me[12],me[1],me[5],me[9],me[13],me[2],me[6],me[10],me[14],me[3],me[7],me[11],me[15]);
		return this;
	}
	,identity: function() {
		this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
		return this;
	}
	,set: function(n11,n12,n13,n14,n21,n22,n23,n24,n31,n32,n33,n34,n41,n42,n43,n44) {
		var e = this.elements;
		e[0] = n11;
		e[4] = n12;
		e[8] = n13;
		e[12] = n14;
		e[1] = n21;
		e[5] = n22;
		e[9] = n23;
		e[13] = n24;
		e[2] = n31;
		e[6] = n32;
		e[10] = n33;
		e[14] = n34;
		e[3] = n41;
		e[7] = n42;
		e[11] = n43;
		e[15] = n44;
		return this;
	}
	,__class__: three.math.Matrix4
}
three.math.Plane = function(normal,constant) {
	if(constant == null) constant = 0;
	this.normal = normal != null?normal:new three.math.Vector3(1,0,0);
	this.constant = constant;
};
three.math.Plane.__name__ = true;
three.math.Plane.prototype = {
	clone: function() {
		return new three.math.Plane().copy(this);
	}
	,equals: function(plane) {
		return plane.normal.equals(this.normal) && plane.constant == this.constant;
	}
	,translate: function(offset) {
		this.constant -= offset.dot(this.normal);
		return this;
	}
	,applyMatrix4: function(m,normalMatrix) {
		if(normalMatrix == null) normalMatrix = new three.math.Matrix3().getNormalMatrix(m);
		var newNormal = this.normal.clone().applyMatrix3(normalMatrix);
		var newCoplanarPoint = this.coplanarPoint(new three.math.Vector3());
		newCoplanarPoint.applyMatrix4(m);
		this.setFromNormalAndCoplanarPoint(newNormal,newCoplanarPoint);
		return this;
	}
	,coplanarPoint: function(optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		return result.copy(this.normal).multiplyScalar(-this.constant);
	}
	,intersectLine: function(line,optTarget) {
		var v1 = new three.math.Vector3();
		var result = optTarget != null?optTarget:new three.math.Vector3();
		var direction = line.delta(v1);
		var denominator = this.normal.dot(direction);
		if(denominator == 0) {
			if(this.distanceToPoint(line.start) == 0) return result.copy(line.start);
			return null;
		}
		var t = -(line.start.dot(this.normal) + this.constant) / denominator;
		if(t < 0 || t > 1) return null;
		return result.copy(direction).multiplyScalar(t).add(line.start);
	}
	,isIntersectionLine: function(line) {
		var startSign = this.distanceToPoint(line.start);
		var endSign = this.distanceToPoint(line.end);
		return startSign < 0 && endSign > 0 || endSign < 0 && startSign > 0;
	}
	,orthoPoint: function(point,optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		var perpendicularMagnitude = this.distanceToPoint(point);
		return result.copy(this.normal).multiplyScalar(perpendicularMagnitude);
	}
	,projectPoint: function(point,optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		return this.orthoPoint(point,result).sub(point).negate();
	}
	,distanceToSphere: function(sphere) {
		return this.distanceToPoint(sphere.center) - sphere.radius;
	}
	,distanceToPoint: function(point) {
		return this.normal.dot(point) + this.constant;
	}
	,negate: function() {
		this.constant *= -1;
		this.normal.negate();
		return this;
	}
	,normalize: function() {
		var inverseNormalLength = 1.0 / this.normal.length();
		this.normal.multiplyScalar(inverseNormalLength);
		this.constant *= inverseNormalLength;
		return this;
	}
	,copy: function(plane) {
		this.normal.copy(plane.normal);
		this.constant = plane.constant;
		return this;
	}
	,setFromCoplanarPoints: function(a,b,c) {
		var v1 = new three.math.Vector3();
		var v2 = new three.math.Vector3();
		var n = v1.subVectors(c,b).cross(v2.subVectors(a,b)).normalize();
		this.setFromNormalAndCoplanarPoint(n,a);
		return this;
	}
	,setFromNormalAndCoplanarPoint: function(normal,point) {
		this.normal.copy(normal);
		this.constant = -point.dot(this.normal);
		return this;
	}
	,setComponents: function(x,y,z,w) {
		this.normal.set(x,y,z);
		this.constant = w;
		return this;
	}
	,set: function(normal,constant) {
		this.normal.copy(normal);
		this.constant = constant;
		return this;
	}
	,__class__: three.math.Plane
}
three.math.Quaternion = function(x,y,z,w) {
	if(w == null) w = 1;
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};
three.math.Quaternion.__name__ = true;
three.math.Quaternion.prototype = {
	clone: function() {
		return new three.math.Quaternion(this.x,this.y,this.z,this.w);
	}
	,toArray: function() {
		var a = new Array();
		a.push(this.x);
		a.push(this.y);
		a.push(this.z);
		a.push(this.w);
		return a;
	}
	,fromArray: function(a) {
		this.x = a[0];
		this.y = a[1];
		this.z = a[2];
		this.w = a[3];
		return this;
	}
	,slerp: function(qb,t) {
		console.log("Quaternion.slerp: NOT DONE YET");
		return this;
	}
	,equals: function(q) {
		return q.x == this.x && q.y == this.y && q.z == this.z && q.w == this.w;
	}
	,multiplyVector3: function(v) {
		return v.applyQuaternion(this);
	}
	,multiplyQuaternions: function(a,b) {
		var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
		var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;
		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
		return this;
	}
	,multiply: function(q,p) {
		if(p != null) return this.multiplyQuaternions(q,p);
		return this.multiplyQuaternions(this,q);
	}
	,normalize: function() {
		var l = this.length();
		if(l == 0) {
			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;
		} else {
			l = 1 / l;
			this.x *= l;
			this.y *= l;
			this.z *= l;
			this.w *= l;
		}
		return this;
	}
	,length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}
	,lengthSq: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}
	,conjugate: function() {
		this.x *= -1;
		this.y *= -1;
		this.z *= -1;
		return this;
	}
	,inverse: function() {
		return this.conjugate().normalize();
	}
	,setFromRotationMatrix: function(m) {
		var e = m.elements;
		var m11 = e[0], m12 = e[4], m13 = e[8];
		var m21 = e[1], m22 = e[5], m23 = e[9];
		var m31 = e[2], m32 = e[6], m33 = e[10];
		var tr = m11 + m22 + m33, s;
		if(tr > 0) {
			s = 0.5 / Math.sqrt(tr + 1.0);
			this.w = 0.25 / s;
			this.x = (m32 - m23) * s;
			this.y = (m13 - m31) * s;
			this.z = (m21 - m12) * s;
		} else if(m11 > m22 && m11 > m33) {
			s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
			this.w = (m32 - m23) / s;
			this.x = 0.25 * s;
			this.y = (m12 + m21) / s;
			this.z = (m13 + m31) / s;
		} else if(m22 > m33) {
			s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
			this.w = (m13 - m31) / s;
			this.x = (m12 + m21) / s;
			this.y = 0.25 * s;
			this.z = (m23 + m32) / s;
		} else {
			s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
			this.w = (m21 - m12) / s;
			this.x = (m13 + m31) / s;
			this.y = (m23 + m32) / s;
			this.z = 0.25 * s;
		}
		return this;
	}
	,setFromAxisAngle: function(axis,angle) {
		var halfAngle = angle / 2;
		var s = Math.sin(halfAngle);
		this.x = axis.x * s;
		this.y = axis.y * s;
		this.z = axis.z * s;
		this.w = Math.cos(halfAngle);
		return this;
	}
	,setFromEuler: function(v,order) {
		if(order == null) order = "XYZ";
		var c1 = Math.cos(v.x / 2);
		var c2 = Math.cos(v.y / 2);
		var c3 = Math.cos(v.z / 2);
		var s1 = Math.sin(v.x / 2);
		var s2 = Math.sin(v.y / 2);
		var s3 = Math.sin(v.z / 2);
		if(order == "XYZ") {
			this.x = s1 * c2 * c3 + c1 * s2 * s3;
			this.y = c1 * s2 * c3 - s1 * c2 * s3;
			this.z = c1 * c2 * s3 + s1 * s2 * c3;
			this.w = c1 * c2 * c3 - s1 * s2 * s3;
		}
		return this;
	}
	,copy: function(q) {
		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
		this.w = q.w;
		return this;
	}
	,set: function(x,y,z,w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}
	,__class__: three.math.Quaternion
}
three.math.Ray = function(origin,direction) {
	if(origin != null) this.origin = origin; else this.origin = new three.math.Vector3();
	if(direction != null) this.direction = direction; else this.direction = new three.math.Vector3();
};
three.math.Ray.__name__ = true;
three.math.Ray.prototype = {
	clone: function() {
		return new three.math.Ray().copy(this);
	}
	,equals: function(ray) {
		return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);
	}
	,applyMatrix4: function(matrix) {
		this.direction.add(this.origin).applyMatrix4(matrix);
		this.origin.applyMatrix4(matrix);
		this.direction.sub(this.origin);
		return this;
	}
	,intersectPlane: function(plane,optTarget) {
		var t = this.distanceToPlane(plane);
		if(t == null) return null;
		var result = optTarget != null?optTarget:new three.math.Vector3();
		return this.at(t,result);
	}
	,distanceToPlane: function(plane) {
		var denominator = plane.normal.dot(this.direction);
		if(denominator == 0) {
			if(plane.distanceToPoint(this.origin) == 0) return 0;
			return null;
		}
		var t = -(this.origin.dot(plane.normal) + plane.constant) / denominator;
		return t;
	}
	,isIntersectionPlane: function(plane) {
		var denominator = plane.normal.dot(this.direction);
		if(denominator != 0) return true;
		if(plane.distanceToPoint(this.origin) == 0) return true;
		return false;
	}
	,isIntersectionSphere: function(sphere) {
		return this.distanceToPoint(sphere.center) <= sphere.radius;
	}
	,distanceToPoint: function(point) {
		var v = new three.math.Vector3();
		var directionDistance = v.subVectors(v,this.origin).dot(this.direction);
		v.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
		return v.distanceTo(point);
	}
	,closestPointToPoint: function(point,optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		result.subVectors(point,this.origin);
		var directionDistance = result.dot(this.direction);
		return result.copy(this.direction).multiplyScalar(directionDistance).add(this.origin);
	}
	,recast: function(t) {
		return this.origin.copy(this.at(t));
	}
	,at: function(t,optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		return result.copy(this.direction).multiplyScalar(t).add(this.origin);
	}
	,copy: function(ray) {
		this.origin.copy(ray.origin);
		this.direction.copy(ray.direction);
		return this;
	}
	,set: function(origin,direction) {
		this.origin.copy(origin);
		this.direction.copy(direction);
		return this;
	}
	,__class__: three.math.Ray
}
three.math.Sphere = function(center,radius) {
	if(radius == null) radius = 0;
	this.center = center != null?center:new three.math.Vector3();
	this.radius = radius;
};
three.math.Sphere.__name__ = true;
three.math.Sphere.prototype = {
	clone: function() {
		return new three.math.Sphere().copy(this);
	}
	,equals: function(sphere) {
		return sphere.center.equals(this.center) && sphere.radius == this.radius;
	}
	,translate: function(offset) {
		this.center.add(offset);
		return this;
	}
	,applyMatrix4: function(m) {
		this.center.applyMatrix4(m);
		this.radius = this.radius * m.getMaxScaleOnAxis();
		return this;
	}
	,getBoundingBox: function(optTarget) {
		var box = optTarget;
		box.set(this.center,this.center);
		box.expandByScalar(this.radius);
		return box;
	}
	,clampPoint: function(point,optTarget) {
		var deltaLengthSq = this.center.distanceToSquared(point);
		var result = optTarget != null?optTarget:new three.math.Vector3();
		result.copy(point);
		if(deltaLengthSq > this.radius * this.radius) {
			result.sub(this.center).normalize();
			result.multiplyScalar(this.radius).add(this.center);
		}
		return result;
	}
	,intersectsSphere: function(sphere) {
		var radiusSum = this.radius + sphere.radius;
		return sphere.center.distanceToSquared(this.center) <= radiusSum * radiusSum;
	}
	,distanceToPoint: function(point) {
		return point.distanceTo(this.center) - this.radius;
	}
	,containsPoint: function(point) {
		return point.distanceToSquared(this.center) <= this.radius * this.radius;
	}
	,empty: function() {
		return this.radius <= 0;
	}
	,copy: function(sphere) {
		this.center.copy(sphere.center);
		this.radius = sphere.radius;
		return this;
	}
	,setFromCenterAndPoints: function(center,points) {
		var maxRadiusSq = 0;
		var i = 0, l = points.length;
		while(i < l) {
			var radiusSq = center.distanceToSquared(points[i]);
			maxRadiusSq = Math.max(maxRadiusSq,radiusSq);
			i++;
		}
		this.center = center;
		this.radius = Math.sqrt(maxRadiusSq);
		return this;
	}
	,set: function(center,radius) {
		this.center.copy(center);
		this.radius = radius;
		return this;
	}
	,__class__: three.math.Sphere
}
three.math.Triangle = function(a,b,c) {
	if(a != null) this.a = a; else this.a = new three.math.Vector3();
	if(b != null) this.b = b; else this.b = new three.math.Vector3();
	if(c != null) this.c = c; else this.c = new three.math.Vector3();
};
three.math.Triangle.__name__ = true;
three.math.Triangle.normal = function(a,b,c,optTarget) {
	var v0 = new three.math.Vector3();
	var result = optTarget != null?optTarget:new three.math.Vector3();
	result.subVectors(c,b);
	v0.subVectors(a,b);
	result.cross(v0);
	var length = result.lengthSq();
	if(length > 0) return result.multiplyScalar(1 / Math.sqrt(length));
	return result.set(0,0,0);
}
three.math.Triangle.barycoordFromPoint = function(point,a,b,c,optTarget) {
	var result = optTarget != null?optTarget:new three.math.Vector3();
	var v0 = new three.math.Vector3();
	var v1 = new three.math.Vector3();
	var v2 = new three.math.Vector3();
	v0.subVectors(c,a);
	v1.subVectors(b,a);
	v2.subVectors(point,a);
	var dot00 = v0.dot(v0);
	var dot01 = v0.dot(v1);
	var dot02 = v0.dot(v2);
	var dot11 = v1.dot(v1);
	var dot12 = v1.dot(v2);
	var denom = dot00 * dot11 - dot01 * dot01;
	if(denom == 0) return result.set(-2,-1,-1);
	var invDenom = 1 / denom;
	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
	return result.set(1 - u - v,v,u);
}
three.math.Triangle.containsPoint = function(point,a,b,c) {
	var v1 = new three.math.Vector3();
	var result = three.math.Triangle.barycoordFromPoint(point,a,b,c,v1);
	return result.x >= 0 && result.y >= 0 && result.x + result.z <= 1;
}
three.math.Triangle.prototype = {
	clone: function() {
		return new three.math.Triangle().copy(this);
	}
	,equals: function(triangle) {
		return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);
	}
	,_containsPoint: function(point) {
		return three.math.Triangle.containsPoint(point,this.a,this.b,this.c);
	}
	,_barycoordFromPoint: function(point,optTarget) {
		return three.math.Triangle.barycoordFromPoint(point,this.a,this.b,this.c,optTarget);
	}
	,plane: function(optTarget) {
		var result = optTarget != null?optTarget:new three.math.Plane();
		return result.setFromCoplanarPoints(this.a,this.b,this.c);
	}
	,_normal: function(optTarget) {
		return three.math.Triangle.normal(this.a,this.b,this.c,optTarget);
	}
	,midpoint: function(optTarget) {
		var result = optTarget != null?optTarget:new three.math.Vector3();
		return result.addVectors(this.a,this.b).add(this.c).multiplyScalar(0.333333);
	}
	,area: function() {
		var v0 = new three.math.Vector3();
		var v1 = new three.math.Vector3();
		v0.subVectors(this.c,this.b);
		v1.subVectors(this.a,this.b);
		return v0.cross(v1).length() * 0.5;
	}
	,copy: function(triangle) {
		this.a.copy(triangle.a);
		this.b.copy(triangle.b);
		this.c.copy(triangle.c);
		return this;
	}
	,setFromPointsAndIndices: function(points,i0,i1,i2) {
		this.a.copy(points[i0]);
		this.b.copy(points[i1]);
		this.c.copy(points[i2]);
		return this;
	}
	,set: function(a,b,c) {
		this.a.copy(a);
		this.b.copy(b);
		this.c.copy(c);
		return this;
	}
	,__class__: three.math.Triangle
}
three.math.Vector2 = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
three.math.Vector2.__name__ = true;
three.math.Vector2.prototype = {
	clone: function() {
		return new three.math.Vector2(this.x,this.y);
	}
	,toArray: function() {
		var a = new Array();
		a.push(this.x);
		a.push(this.y);
		return a;
	}
	,fromArray: function(a) {
		this.x = a[0];
		this.y = a[1];
		return this;
	}
	,equals: function(v) {
		return v.x == this.x && v.y == this.y;
	}
	,lerp: function(v,alpha) {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		return this;
	}
	,setLength: function(l) {
		var oldLength = this.length();
		if(oldLength != 0 && l != oldLength) this.multiplyScalar(l / oldLength);
		return this;
	}
	,distanceToSquared: function(v) {
		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;
	}
	,distanceTo: function(v) {
		return Math.sqrt(this.distanceToSquared(v));
	}
	,normalize: function() {
		return this.divideScalar(this.length());
	}
	,length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	,lengthSq: function() {
		return this.x * this.x + this.y * this.y;
	}
	,dot: function(v) {
		return this.x * v.x + this.y * v.y;
	}
	,negate: function() {
		return this.multiplyScalar(-1);
	}
	,clamp: function(min,max) {
		if(this.x < min.x) this.x = min.x; else if(this.x > max.x) this.x = max.x;
		if(this.y < min.y) this.y = min.y; else if(this.y > max.y) this.y = max.y;
		return this;
	}
	,max: function(v) {
		if(this.x < v.x) this.x = v.x;
		if(this.y < v.y) this.y = v.y;
		return this;
	}
	,min: function(v) {
		if(this.x > v.x) this.x = v.x;
		if(this.y > v.y) this.y = v.y;
		return this;
	}
	,divideScalar: function(s) {
		if(s == 0) return this.set(0,0);
		this.x /= s;
		this.y /= s;
		return this;
	}
	,multiplyScalar: function(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}
	,subVectors: function(a,b) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		return this;
	}
	,sub: function(v,w) {
		if(w != null) return this.subVectors(v,w);
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}
	,addScalar: function(s) {
		this.x += s;
		this.y += s;
		return this;
	}
	,addVectors: function(a,b) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		return this;
	}
	,add: function(v,w) {
		if(w != null) return this.addVectors(v,w);
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	,copy: function(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}
	,getComponent: function(index) {
		switch(index) {
		case 0:
			return this.x;
		case 1:
			return this.y;
		default:
			console.log("Vector2.getComponent: index is out of range (" + index + ")");
		}
		return 0;
	}
	,setComponent: function(index,value) {
		switch(index) {
		case 0:
			this.x = value;
			break;
		case 1:
			this.y = value;
			break;
		default:
			console.log("Vector2.setComponent: index is out of range (" + index + ")");
		}
		return this;
	}
	,setY: function(y) {
		this.y = y;
		return this;
	}
	,setX: function(x) {
		this.x = x;
		return this;
	}
	,set: function(x,y) {
		this.x = x;
		this.y = y;
		return this;
	}
	,__class__: three.math.Vector2
}
three.math.Vector3 = function(x,y,z) {
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.z = z;
};
three.math.Vector3.__name__ = true;
three.math.Vector3.prototype = {
	reflect: function(v) {
		var v1 = this.clone().projectOnVector(v).multiplyScalar(2);
		return this.subVectors(v1,this);
	}
	,projectOnPlane: function(planeNormal) {
		var v1 = this.clone().projectOnVector(planeNormal);
		return this.sub(v1);
	}
	,projectOnVector: function(v) {
		var v1 = v.clone().normalize();
		var d = this.dot(v1);
		this.copy(v1).multiplyScalar(d);
		return this;
	}
	,applyAxisAngle: function(axis,angle) {
		var q1 = new three.math.Quaternion();
		this.applyQuaternion(q1.setFromAxisAngle(axis,angle));
		return this;
	}
	,applyEuler: function(v,order) {
		if(order == null) order = "XYZ";
		var q1 = new three.math.Quaternion();
		this.applyQuaternion(q1.setFromEuler(v,order));
		return this;
	}
	,clone: function() {
		return new three.math.Vector3(this.x,this.y,this.z);
	}
	,toArray: function() {
		var a = new Array();
		a.push(this.x);
		a.push(this.y);
		a.push(this.z);
		return a;
	}
	,fromArray: function(a) {
		this.x = a[0];
		this.y = a[1];
		this.z = a[2];
		return this;
	}
	,equals: function(v) {
		return this.x == v.x && this.y == v.y && this.z == v.z;
	}
	,getColumnFromMatrix: function(index,m) {
		var offset = index * 4;
		var e = m.elements;
		this.x = e[offset];
		this.y = e[offset + 1];
		this.z = e[offset + 2];
		return this;
	}
	,getScaleFromMatrix: function(m) {
		var e = m.elements;
		var sx = this.set(e[0],e[1],e[2]).length();
		var sy = this.set(e[4],e[5],e[6]).length();
		var sz = this.set(e[8],e[9],e[10]).length();
		this.x = sx;
		this.y = sy;
		this.z = sz;
		return this;
	}
	,getPositionFromMatrix: function(m) {
		this.x = m.elements[12];
		this.y = m.elements[13];
		this.z = m.elements[14];
		return this;
	}
	,setEulerFromQuaternion: function(q,order) {
		if(order == null) order = "XYZ";
		var sqx = q.x * q.x;
		var sqy = q.y * q.y;
		var sqz = q.z * q.z;
		var sqw = q.w * q.w;
		if(order == "XYZ") {
			this.x = Math.atan2(2 * (q.x * q.w - q.y * q.z),sqw - sqx - sqy + sqz);
			this.y = Math.asin(three.extras.MathUtils.clamp(2 * (q.x * q.z + q.y * q.w),-1,1));
			this.z = Math.atan2(2 * (q.z * q.w - q.x * q.y),sqw + sqx - sqy - sqz);
		}
		return this;
	}
	,setEulerFromRotationMatrix: function(m,order) {
		if(order == null) order = "XYZ";
		var te = m.elements;
		var m11 = te[0], m12 = te[4], m13 = te[8];
		var m21 = te[1], m22 = te[5], m23 = te[9];
		var m31 = te[2], m32 = te[6], m33 = te[10];
		if(order == "XYZ") {
			this.y = Math.asin(Math.min(Math.max(m13,-1),1));
			if(Math.abs(m13) < 0.99999) {
				this.x = Math.atan2(-m23,m33);
				this.z = Math.atan2(-m12,m11);
			} else {
				this.x = Math.atan2(m32,m22);
				this.z = 0;
			}
		}
		return this;
	}
	,distanceTo: function(v) {
		return Math.sqrt(this.distanceToSquared(v));
	}
	,distanceToSquared: function(v) {
		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var dz = this.z - v.z;
		return dx * dx + dy * dy + dz * dz;
	}
	,angleTo: function(v) {
		var theta = this.dot(v) / (this.length() * v.length());
		if(theta < -1) theta = -1; else if(theta > 1) theta = 1;
		return Math.acos(theta);
	}
	,crossVectors: function(a,b) {
		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;
		return this;
	}
	,cross: function(v) {
		this.x = this.y * v.z - this.z * v.y;
		this.y = this.z * v.x - this.x * v.z;
		this.z = this.x * v.y - this.y * v.x;
		return this;
	}
	,lerp: function(v,alpha) {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		this.z += (v.z - this.z) * alpha;
		return this;
	}
	,setLength: function(l) {
		var oldLength = this.length();
		if(oldLength != 0 && l != oldLength) this.multiplyScalar(l / oldLength);
		return this;
	}
	,normalize: function() {
		return this.divideScalar(this.length());
	}
	,lengthManhattan: function() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}
	,length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	,lengthSq: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	,dot: function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	,negate: function() {
		return this.multiplyScalar(-1);
	}
	,clamp: function(vmin,vmax) {
		if(this.x < vmin.x) this.x = vmin.x; else if(this.x > vmax.x) this.x = vmax.x;
		if(this.y < vmin.y) this.y = vmin.y; else if(this.y > vmax.y) this.y = vmax.y;
		if(this.z < vmin.z) this.z = vmin.z; else if(this.z > vmax.z) this.z = vmax.z;
		return this;
	}
	,max: function(v) {
		if(this.x < v.x) this.x = v.x;
		if(this.y < v.y) this.y = v.y;
		if(this.z < v.z) this.z = v.z;
		return this;
	}
	,min: function(v) {
		if(this.x > v.x) this.x = v.x;
		if(this.y > v.y) this.y = v.y;
		if(this.z > v.z) this.z = v.z;
		return this;
	}
	,transformDirection: function(m) {
		var e = m.elements;
		var x = this.x, y = this.y, z = this.z;
		this.x = e[0] * x + e[4] * y + e[8] * z;
		this.y = e[1] * x + e[5] * y + e[9] * z;
		this.z = e[2] * x + e[6] * y + e[10] * z;
		this.normalize();
		return this;
	}
	,applyQuaternion: function(q) {
		var qx = q.x;
		var qy = q.y;
		var qz = q.z;
		var qw = q.w;
		var ix = qw * this.x + qy * this.z - qz * this.y;
		var iy = qw * this.y + qz * this.x - qx * this.z;
		var iz = qw * this.z + qx * this.y - qy * this.x;
		var iw = -qx * this.x - qy * this.y - qz * this.z;
		this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
		return this;
	}
	,applyProjection: function(m) {
		var e = m.elements;
		var x = this.x, y = this.y, z = this.z;
		var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
		this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
		this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
		this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
		return this;
	}
	,applyMatrix4: function(m) {
		var e = m.elements;
		var x = this.x, y = this.y, z = this.z;
		this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
		this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
		this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
		return this;
	}
	,applyMatrix3: function(m) {
		var e = m.elements;
		var x = this.x, y = this.y, z = this.z;
		this.x = e[0] * x + e[3] * y + e[6] * z;
		this.y = e[1] * x + e[4] * y + e[7] * z;
		this.z = e[2] * x + e[5] * y + e[8] * z;
		return this;
	}
	,divideScalar: function(s) {
		if(s == 0.0) return this.set(0,0,0);
		this.x /= s;
		this.y /= s;
		this.z /= s;
		return this;
	}
	,divide: function(v) {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		return this;
	}
	,multiplyVectors: function(a,b) {
		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;
		return this;
	}
	,multiplyScalar: function(s) {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		return this;
	}
	,multiply: function(v) {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	}
	,subVectors: function(a,b) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		return this;
	}
	,sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}
	,addVectors: function(a,b) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		return this;
	}
	,addScalar: function(s) {
		this.x += s;
		this.y += s;
		this.z += s;
		return this;
	}
	,add: function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}
	,getComponent: function(index) {
		switch(index) {
		case 0:
			return this.x;
		case 1:
			return this.y;
		case 2:
			return this.z;
		default:
			console.log("getComponent: Index is out of range (" + index + ")");
			return 0.0;
		}
	}
	,setComponent: function(index,value) {
		switch(index) {
		case 0:
			this.x = value;
			break;
		case 1:
			this.y = value;
			break;
		case 2:
			this.z = value;
			break;
		default:
			console.log("setComponent: Index is out of range (" + index + ")");
		}
		return this;
	}
	,setZ: function(z) {
		if(z == null) z = 0;
		this.z = z;
		return this;
	}
	,setY: function(y) {
		if(y == null) y = 0;
		this.y = y;
		return this;
	}
	,setX: function(x) {
		if(x == null) x = 0;
		this.x = x;
		return this;
	}
	,set: function(x,y,z) {
		if(z == null) z = 0;
		if(y == null) y = 0;
		if(x == null) x = 0;
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}
	,copy: function(v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}
	,__class__: three.math.Vector3
}
three.math.Vector4 = function(x,y,z,w) {
	if(w == null) w = 1;
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};
three.math.Vector4.__name__ = true;
three.math.Vector4.prototype = {
	clone: function() {
		return new three.math.Vector4(this.x,this.y,this.z,this.w);
	}
	,toArray: function() {
		var a = new Array();
		a.push(this.x);
		a.push(this.y);
		a.push(this.z);
		a.push(this.w);
		return a;
	}
	,fromArray: function(a) {
		this.x = a[0];
		this.y = a[1];
		this.z = a[2];
		this.w = a[3];
		return this;
	}
	,equals: function(v) {
		return this.x == v.x && this.y == v.y && this.z == v.z && this.w == v.w;
	}
	,lerp: function(v,alpha) {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		this.z += (v.z - this.z) * alpha;
		this.w += (v.w - this.w) * alpha;
		return this;
	}
	,setLength: function(l) {
		var oldLength = this.length();
		if(oldLength != 0 && l != oldLength) this.multiplyScalar(l / oldLength);
		return this;
	}
	,normalize: function() {
		return this.divideScalar(this.length());
	}
	,lengthManhattan: function() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
	}
	,length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}
	,lengthSq: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}
	,dot: function(v) {
		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
	}
	,negate: function() {
		return this.multiplyScalar(-1);
	}
	,clamp: function(vmin,vmax) {
		if(this.x < vmin.x) this.x = vmin.x; else if(this.x > vmax.x) this.x = vmax.x;
		if(this.y < vmin.y) this.y = vmin.y; else if(this.y > vmax.y) this.y = vmax.y;
		if(this.z < vmin.z) this.z = vmin.z; else if(this.z > vmax.z) this.z = vmax.z;
		if(this.w < vmin.w) this.w = vmin.w; else if(this.w > vmax.w) this.w = vmax.w;
		return this;
	}
	,max: function(v) {
		if(this.x < v.x) this.x = v.x;
		if(this.y < v.y) this.y = v.y;
		if(this.z < v.z) this.z = v.z;
		if(this.w < v.w) this.w = v.w;
		return this;
	}
	,min: function(v) {
		if(this.x > v.x) this.x = v.x;
		if(this.y > v.y) this.y = v.y;
		if(this.z > v.z) this.z = v.z;
		if(this.w > v.w) this.w = v.w;
		return this;
	}
	,setAxisAngleFromRotationMatrix: function(m) {
		var x = this.x, y = this.y, z = this.z, w = this.w;
		var angle, epsilon = 0.01, epsilon2 = 0.1;
		var te = m.elements;
		var m11 = te[0], m12 = te[4], m13 = te[8];
		var m21 = te[1], m22 = te[5], m23 = te[9];
		var m31 = te[2], m32 = te[6], m33 = te[10];
		if(Math.abs(m12 - m21) < epsilon && Math.abs(m13 - m31) < epsilon && Math.abs(m23 - m32) < epsilon) {
			if(Math.abs(m12 + m21) < epsilon2 && Math.abs(m13 + m31) < epsilon2 && Math.abs(m23 + m32) < epsilon2 && Math.abs(m11 + m22 + m33 - 3) < epsilon2) {
				this.set(1,0,0,0);
				return this;
			}
			angle = Math.PI;
			var xx = (m11 + 1) / 2;
			var yy = (m22 + 1) / 2;
			var zz = (m33 + 1) / 2;
			var xy = (m12 + m21) / 4;
			var xz = (m13 + m31) / 4;
			var yz = (m23 + m32) / 4;
			if(xx > yy && xx > zz) {
				if(xx < epsilon) {
					x = 0;
					y = 0.707106781;
					z = 0.707106781;
				} else {
					x = Math.sqrt(xx);
					y = xy / x;
					z = xz / x;
				}
			} else if(yy > zz) {
				if(yy < epsilon) {
					x = 0.707106781;
					y = 0;
					z = 0.707106781;
				} else {
					y = Math.sqrt(yy);
					x = xy / y;
					z = yz / y;
				}
			} else if(zz < epsilon) {
				x = 0.707106781;
				y = 0.707106781;
				z = 0;
			} else {
				z = Math.sqrt(zz);
				x = xz / z;
				y = yz / z;
			}
			this.set(x,y,z,angle);
			return this;
		}
		var s = Math.sqrt((m32 - m23) * (m32 - m23) + (m13 - m31) * (m13 - m31) + (m21 - m12) * (m21 - m12));
		if(Math.abs(s) < 0.001) s = 1;
		this.x = (m32 - m23) / s;
		this.y = (m13 - m31) / s;
		this.z = (m21 - m12) / s;
		this.w = Math.acos((m11 + m22 + m33 - 1) / 2);
		return this;
	}
	,setAxisAngleFromQuaternion: function(q) {
		this.w = 2 * Math.acos(q.w);
		var s = Math.sqrt(1 - q.w * q.w);
		if(s < 0.0001) {
			this.x = 1;
			this.y = 0;
			this.z = 0;
		} else {
			this.x = q.x / s;
			this.y = q.y / s;
			this.z = q.z / s;
		}
		return this;
	}
	,applyMatrix4: function(m) {
		var e = m.elements;
		var x = this.x, y = this.y, z = this.z, w = this.w;
		this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
		this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
		this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
		this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
		return this;
	}
	,divideScalar: function(s) {
		if(s == 0.0) return this.set(0,0,0,1);
		this.x /= s;
		this.y /= s;
		this.z /= s;
		this.w /= s;
		return this;
	}
	,divide: function(v) {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		this.w /= v.w;
		return this;
	}
	,multiplyVectors: function(a,b) {
		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;
		this.w = a.w * b.w;
		return this;
	}
	,multiplyScalar: function(s) {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		this.w *= s;
		return this;
	}
	,multiply: function(v) {
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		this.w *= v.w;
		return this;
	}
	,subVectors: function(a,b) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		this.w = a.w - b.w;
		return this;
	}
	,sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.w -= v.w;
		return this;
	}
	,addVectors: function(a,b) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		this.w = a.w + b.w;
		return this;
	}
	,addScalar: function(s) {
		this.x += s;
		this.y += s;
		this.z += s;
		this.w += this.w;
		return this;
	}
	,add: function(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;
		return this;
	}
	,getComponent: function(index) {
		switch(index) {
		case 0:
			return this.x;
		case 1:
			return this.y;
		case 2:
			return this.z;
		case 3:
			return this.w;
		default:
			console.log("getComponent: Index is out of range (" + index + ")");
			return 0.0;
		}
	}
	,setComponent: function(index,value) {
		switch(index) {
		case 0:
			this.x = value;
			break;
		case 1:
			this.y = value;
			break;
		case 2:
			this.z = value;
			break;
		case 3:
			this.w = value;
			break;
		default:
			console.log("setComponent: Index is out of range (" + index + ")");
		}
		return this;
	}
	,setW: function(w) {
		if(w == null) w = 0;
		this.w = w;
		return this;
	}
	,setZ: function(z) {
		if(z == null) z = 0;
		this.z = z;
		return this;
	}
	,setY: function(y) {
		if(y == null) y = 0;
		this.y = y;
		return this;
	}
	,setX: function(x) {
		if(x == null) x = 0;
		this.x = x;
		return this;
	}
	,set: function(x,y,z,w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}
	,copy: function(v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = v.w;
		return this;
	}
	,__class__: three.math.Vector4
}
three.objects = {}
three.objects.Mesh = function(geometry,material) {
	three.core.Object3D.call(this);
	this.type = three.THREE.Mesh;
	if(geometry != null) this.setGeometry(geometry);
	this.setMaterial(material);
};
three.objects.Mesh.__name__ = true;
three.objects.Mesh.__super__ = three.core.Object3D;
three.objects.Mesh.prototype = $extend(three.core.Object3D.prototype,{
	clone: function(object) {
		if(object == null) object = new three.objects.Mesh(this.geometry,this.material);
		three.core.Object3D.prototype.clone.call(this,object);
		return object;
	}
	,getMorphTargetIndexByName: function(name) {
		return 0;
	}
	,updateMorphTargets: function() {
		if(this.geometry.morphTargets.length == 0) return;
		return;
	}
	,setMaterial: function(material) {
		if(material != null) this.material = material; else this.material = new three.materials.MeshBasicMaterial({ color : Math.random() * 16777215, wireframe : true});
	}
	,setGeometry: function(geometry) {
		this.geometry = geometry;
		if(this.geometry.boundingSphere == null) this.geometry.computeBoundingSphere();
		this.updateMorphTargets();
	}
	,__class__: three.objects.Mesh
});
three.renderers = {}
three.renderers.CanvasRenderer = function(parameters) {
	this.gradientMapQuality = 16;
	this.uv3y = 0.0;
	this.uv3x = 0.0;
	this.uv2y = 0.0;
	this.uv2x = 0.0;
	this.uv1y = 0.0;
	this.uv1x = 0.0;
	this.v6y = 0.0;
	this.v5y = 0.0;
	this.v4y = 0.0;
	this.v3y = 0.0;
	this.v2y = 0.0;
	this.v1y = 0.0;
	this.v6x = 0.0;
	this.v5x = 0.0;
	this.v4x = 0.0;
	this.v3x = 0.0;
	this.v2x = 0.0;
	this.v1x = 0.0;
	this.contextGapSize = 0.0;
	this.contextDashSize = 0.0;
	this.contextLineWidth = 1.0;
	this.contextGlobalCompositeOperation = 0;
	this.contextGlobalAlpha = 1.0;
	this.clearAlpha = 1.0;
	this.autoClear = true;
	this.sortElements = true;
	this.sortObjects = true;
	this.devicePixelRatio = 1.0;
	if(parameters == null) parameters = { };
	this.projector = new three.core.Projector();
	this.canvas = js.Browser.document.createElement("canvas");
	this.context = this.canvas.getContext("2d");
	this.clearColor = new three.math.Color(0);
	this.v5 = new three.renderers.renderables.RenderableVertex();
	this.v6 = new three.renderers.renderables.RenderableVertex();
	this.color = new three.math.Color();
	this.color1 = new three.math.Color();
	this.color2 = new three.math.Color();
	this.color3 = new three.math.Color();
	this.color4 = new three.math.Color();
	this.diffuseColor = new three.math.Color();
	this.emissiveColor = new three.math.Color();
	this.lightColor = new three.math.Color();
	this.patterns = new haxe.ds.StringMap();
	this.imageDatas = new haxe.ds.StringMap();
	this.clipBox = new three.math.Box2();
	this.clearBox = new three.math.Box2();
	this.elemBox = new three.math.Box2();
	this.ambientLight = new three.math.Color();
	this.directionalLights = new three.math.Color();
	this.pointLights = new three.math.Color();
	this.vector3 = new three.math.Vector3();
	this.pixelMap = js.Browser.document.createElement("canvas");
	this.pixelMap.width = this.pixelMap.height = 2;
	this.pixelMapContext = this.pixelMap.getContext("2d");
	this.pixelMapContext.fillStyle = "rgba(0,0,0,1)";
	this.pixelMapContext.fillRect(0,0,2,2);
	this.pixelMapImage = this.pixelMapContext.getImageData(0,0,2,2);
	this.pixelMapData = this.pixelMapImage.data;
	this.gradientMap = js.Browser.document.createElement("canvas");
	this.gradientMap.width = this.gradientMap.height = this.gradientMapQuality;
	this.gradientMapContext = this.gradientMap.getContext("2d");
	this.gradientMapContext.translate(-this.gradientMapQuality / 2,-this.gradientMapQuality / 2);
	this.gradientMapContext.scale(this.gradientMapQuality,this.gradientMapQuality);
	this.gradientMapQuality--;
	this.domElement = this.canvas;
	if(Reflect.hasField(parameters,"devicePixelRatio") == true) this.devicePixelRatio = parameters.devicePixelRatio; else this.devicePixelRatio = js.Browser.window.devicePixelRatio;
	this.info = { render : { vertices : 0, faces : 0}};
};
three.renderers.CanvasRenderer.__name__ = true;
three.renderers.CanvasRenderer.prototype = {
	setDashAndGap: function(dashSizeValue,gapSizeValue) {
		if(this.contextDashSize != dashSizeValue || this.contextGapSize != gapSizeValue) {
			this.context.setLineDash([dashSizeValue,gapSizeValue]);
			this.contextDashSize = dashSizeValue;
			this.contextGapSize = gapSizeValue;
		}
	}
	,setFillStyle: function(value) {
		if(this.contextFillStyle != value) {
			this.context.fillStyle = value;
			this.contextFillStyle = value;
		}
	}
	,setStrokeStyle: function(value) {
		if(this.contextStrokeStyle != value) {
			this.context.strokeStyle = value;
			this.contextStrokeStyle = value;
		}
	}
	,setLineJoin: function(value) {
		if(this.contextLineJoin != value) {
			this.context.lineJoin = value;
			this.contextLineJoin = value;
		}
	}
	,setLineCap: function(value) {
		if(this.contextLineCap != value) {
			this.context.lineCap = value;
			this.contextLineCap = value;
		}
	}
	,setLineWidth: function(value) {
		if(this.contextLineWidth != value) {
			this.context.lineWidth = value;
			this.contextLineWidth = value;
		}
	}
	,setBlending: function(value) {
		if(this.contextGlobalCompositeOperation != value) {
			if(value == three.THREE.NormalBlending) this.context.globalCompositeOperation = "source-over"; else if(value == three.THREE.AdditiveBlending) this.context.globalCompositeOperation = "lighter"; else if(value == three.THREE.SubtractiveBlending) this.context.globalCompositeOperation = "darker";
			this.contextGlobalCompositeOperation = value;
		}
	}
	,setOpacity: function(value) {
		if(this.contextGlobalAlpha != value) {
			this.context.globalAlpha = value;
			this.contextGlobalAlpha = value;
		}
	}
	,expand: function(v1,v2) {
		var x = v2.x - v1.x, y = v2.y - v1.y;
		var det = x * x + y * y;
		if(det != 0) {
			var idet = 1 / Math.sqrt(det);
			x *= idet;
			y *= idet;
			v2.x += x;
			v2.y += y;
			v1.x -= x;
			v1.y -= y;
		}
	}
	,getGradientTexture: function(color1,color2,color3,color4) {
		this.pixelMapData[0] = Math.round(color1.r * 255) | 0;
		this.pixelMapData[1] = Math.round(color1.g * 255) | 0;
		this.pixelMapData[2] = Math.round(color1.b * 255) | 0;
		this.pixelMapData[4] = Math.round(color2.r * 255) | 0;
		this.pixelMapData[5] = Math.round(color2.g * 255) | 0;
		this.pixelMapData[6] = Math.round(color2.b * 255) | 0;
		this.pixelMapData[8] = Math.round(color3.r * 255) | 0;
		this.pixelMapData[9] = Math.round(color3.g * 255) | 0;
		this.pixelMapData[10] = Math.round(color3.b * 255) | 0;
		this.pixelMapData[12] = Math.round(color4.r * 255) | 0;
		this.pixelMapData[13] = Math.round(color4.g * 255) | 0;
		this.pixelMapData[14] = Math.round(color4.b * 255) | 0;
		this.pixelMapContext.putImageData(this.pixelMapImage,0,0);
		this.gradientMapContext.drawImage(this.pixelMap,0,0);
		return this.gradientMap;
	}
	,clipImage: function(x0,y0,x1,y1,x2,y2,u0,v0,u1,v1,u2,v2,image) {
	}
	,patternPath: function(x0,y0,x1,y1,x2,y2,u0,v0,u1,v1,u2,v2,texture) {
	}
	,fillPath: function(color) {
		this.setFillStyle(color.getStyle());
		this.context.fill();
	}
	,strokePath: function(color,linewidth,linecap,linejoin) {
		if(this.contextLineWidth != linewidth) {
			this.context.lineWidth = linewidth;
			this.contextLineWidth = linewidth;
		}
		if(this.contextLineCap != linecap) {
			this.context.lineCap = linecap;
			this.contextLineCap = linecap;
		}
		if(this.contextLineJoin != linejoin) {
			this.context.lineJoin = linejoin;
			this.contextLineJoin = linejoin;
		}
		this.setStrokeStyle(color.getStyle());
		this.context.stroke();
		this.elemBox.expandByScalar(linewidth * 2);
	}
	,drawQuad: function(x0,y0,x1,y1,x2,y2,x3,y3) {
		this.context.beginPath();
		this.context.moveTo(x0,y0);
		this.context.lineTo(x1,y1);
		this.context.lineTo(x2,y2);
		this.context.lineTo(x3,y3);
		this.context.closePath();
	}
	,drawTriangle: function(x0,y0,x1,y1,x2,y2) {
		this.context.beginPath();
		this.context.moveTo(x0,y0);
		this.context.lineTo(x1,y1);
		this.context.lineTo(x2,y2);
		this.context.closePath();
	}
	,renderFace4: function(v1,v2,v3,v4,v5,v6,element,material) {
	}
	,renderFace3: function(v1,v2,v3,uv1,uv2,uv3,element,material) {
		this.info.render.vertices += 3;
		this.info.render.faces++;
		this.setOpacity(material.opacity);
		this.setBlending(material.blending);
		this.v1x = v1.positionScreen.x;
		this.v1y = v1.positionScreen.y;
		this.v2x = v2.positionScreen.x;
		this.v2y = v2.positionScreen.y;
		this.v3x = v3.positionScreen.x;
		this.v3y = v3.positionScreen.y;
		this.context.beginPath();
		this.context.moveTo(this.v1x,this.v1y);
		this.context.lineTo(this.v2x,this.v2y);
		this.context.lineTo(this.v3x,this.v3y);
		this.context.closePath();
	}
	,renderLine: function(v1,v2,element,material) {
		this.setOpacity(material.opacity);
		this.setBlending(material.blending);
		this.context.beginPath();
		this.context.moveTo(v1.positionScreen.x,v1.positionScreen.y);
		this.context.lineTo(v2.positionScreen.x,v2.positionScreen.y);
	}
	,renderParticle: function(v1,element,material) {
		this.setOpacity(material.opacity);
		this.setBlending(material.blending);
		var width, height, scaleX, scaleY;
	}
	,calculateLight: function(position,normal,color) {
		var lights = this.renderData.lights;
		var l = 0, ll = lights.length;
		while(l < ll) {
			var light = lights[l++];
			this.lightColor.copy(light.color);
		}
	}
	,calculateLights: function() {
		this.ambientLight.setRGB(0,0,0);
		this.directionalLights.setRGB(0,0,0);
		this.pointLights.setRGB(0,0,0);
		var lights = this.renderData.lights;
		var l = 0, ll = lights.length;
		while(l < ll) {
			var light = lights[l++];
			this.lightColor.copy(light.color);
			if(light.type == three.THREE.AmbientLight) this.ambientLight.add(this.lightColor);
		}
	}
	,render: function(scene,camera) {
		if(this.autoClear == true) this.clear();
		this.context.setTransform(1,0,0,-1,this.canvasWidthHalf,this.canvasHeightHalf);
		this.info.render.vertices = 0;
		this.info.render.faces = 0;
		this.renderData = this.projector.projectScene(scene,camera,this.sortObjects,this.sortElements);
		var elements = this.renderData.elements;
		var lights = this.renderData.lights;
		this.calculateLights();
		var e = 0, el = elements.length;
		while(e < el) {
			var element = elements[e++];
			var material = element.material;
			if(material == null || material.visible == false) continue;
			this.elemBox.makeEmpty();
			if(element.type == three.THREE.RenderableParticle) {
				var element1 = js.Boot.__cast(element , three.renderers.renderables.RenderableParticle);
				element1.x *= this.canvasWidthHalf;
				element1.y *= this.canvasHeightHalf;
				this.renderParticle(element1,element1,material);
			} else if(element.type == three.THREE.RenderableLine) {
				var element1 = js.Boot.__cast(element , three.renderers.renderables.RenderableLine);
				this.v1 = element1.v1;
				this.v2 = element1.v2;
				this.v1.positionScreen.x *= this.canvasWidthHalf;
				this.v1.positionScreen.y *= this.canvasHeightHalf;
				this.v2.positionScreen.x *= this.canvasWidthHalf;
				this.v2.positionScreen.y *= this.canvasHeightHalf;
				var vec2_1 = new three.math.Vector2(this.v1.positionScreen.x,this.v1.positionScreen.y);
				var vec2_2 = new three.math.Vector2(this.v2.positionScreen.x,this.v2.positionScreen.y);
				this.elemBox.setFromPoints([vec2_1,vec2_2]);
				if(this.clipBox.isIntersectionBox(this.elemBox) == true) this.renderLine(this.v1,this.v2,element1,material);
			} else if(element.type == three.THREE.RenderableFace3) {
				var element1 = js.Boot.__cast(element , three.renderers.renderables.RenderableFace3);
				this.v1 = element1.v1;
				this.v2 = element1.v2;
				this.v3 = element1.v3;
				if(this.v1.positionScreen.z < -1 || this.v1.positionScreen.z > 1) continue;
				if(this.v2.positionScreen.z < -1 || this.v2.positionScreen.z > 1) continue;
				if(this.v3.positionScreen.z < -1 || this.v3.positionScreen.z > 1) continue;
				this.v1.positionScreen.x *= this.canvasWidthHalf;
				this.v1.positionScreen.y *= this.canvasHeightHalf;
				this.v2.positionScreen.x *= this.canvasWidthHalf;
				this.v2.positionScreen.y *= this.canvasHeightHalf;
				this.v3.positionScreen.x *= this.canvasWidthHalf;
				this.v3.positionScreen.y *= this.canvasHeightHalf;
				if(material.overdraw == true) {
					this.expand(this.v1.positionScreen,this.v2.positionScreen);
					this.expand(this.v2.positionScreen,this.v3.positionScreen);
					this.expand(this.v3.positionScreen,this.v1.positionScreen);
				}
				var vec2_1 = new three.math.Vector2(this.v1.positionScreen.x,this.v1.positionScreen.y);
				var vec2_2 = new three.math.Vector2(this.v1.positionScreen.x,this.v1.positionScreen.y);
				var vec2_3 = new three.math.Vector2(this.v1.positionScreen.x,this.v1.positionScreen.y);
				this.elemBox.setFromPoints([vec2_1,vec2_2,vec2_3]);
				if(this.clipBox.isIntersectionBox(this.elemBox) == true) this.renderFace3(this.v1,this.v2,this.v3,0,1,2,element1,material);
			} else if(element.type == three.THREE.RenderableFace4) {
				var element1 = js.Boot.__cast(element , three.renderers.renderables.RenderableFace4);
				this.v1 = element1.v1;
				this.v2 = element1.v2;
				this.v3 = element1.v3;
				this.v4 = element1.v4;
				if(this.v1.positionScreen.z < -1 || this.v1.positionScreen.z > 1) continue;
				if(this.v2.positionScreen.z < -1 || this.v2.positionScreen.z > 1) continue;
				if(this.v3.positionScreen.z < -1 || this.v3.positionScreen.z > 1) continue;
				if(this.v4.positionScreen.z < -1 || this.v4.positionScreen.z > 1) continue;
				this.v1.positionScreen.x *= this.canvasWidthHalf;
				this.v1.positionScreen.y *= this.canvasHeightHalf;
				this.v2.positionScreen.x *= this.canvasWidthHalf;
				this.v2.positionScreen.y *= this.canvasHeightHalf;
				this.v3.positionScreen.x *= this.canvasWidthHalf;
				this.v3.positionScreen.y *= this.canvasHeightHalf;
				this.v4.positionScreen.x *= this.canvasWidthHalf;
				this.v4.positionScreen.y *= this.canvasHeightHalf;
				this.v5.positionScreen.copy(this.v2.positionScreen);
				this.v6.positionScreen.copy(this.v4.positionScreen);
				if(material.overdraw == true) {
					this.expand(this.v1.positionScreen,this.v2.positionScreen);
					this.expand(this.v2.positionScreen,this.v4.positionScreen);
					this.expand(this.v4.positionScreen,this.v1.positionScreen);
					this.expand(this.v3.positionScreen,this.v5.positionScreen);
					this.expand(this.v3.positionScreen,this.v6.positionScreen);
				}
				var vec2_1 = new three.math.Vector2(this.v1.positionScreen.x,this.v1.positionScreen.y);
				var vec2_2 = new three.math.Vector2(this.v2.positionScreen.x,this.v2.positionScreen.y);
				var vec2_3 = new three.math.Vector2(this.v3.positionScreen.x,this.v3.positionScreen.y);
				var vec2_4 = new three.math.Vector2(this.v4.positionScreen.x,this.v4.positionScreen.y);
				this.elemBox.setFromPoints([vec2_1,vec2_2,vec2_3,vec2_4]);
				if(this.clipBox.isIntersectionBox(this.elemBox) == true) null;
			}
			this.clearBox.union(this.elemBox);
		}
		this.context.setTransform(1,0,0,1,0,0);
	}
	,clear: function() {
		this.context.setTransform(1,0,0,-1,this.canvasWidthHalf,this.canvasHeightHalf);
		if(this.clearBox.empty() == true) return;
		this.clearBox.intersect(this.clipBox);
		this.clearBox.expandByScalar(2);
		if(this.clearAlpha < 1) this.context.clearRect(Math.round(this.clearBox.min.x) | 0,Math.round(this.clearBox.min.y) | 0,Math.round(this.clearBox.max.x - this.clearBox.min.x) | 0,Math.round(this.clearBox.max.y - this.clearBox.min.y) | 0);
		if(this.clearAlpha > 0) {
			this.setBlending(three.THREE.NormalBlending);
			if(this.contextGlobalAlpha != 1) {
				this.context.globalAlpha = 1;
				this.contextGlobalAlpha = 1;
			}
			var r = Math.floor(this.clearColor.r * 255);
			var g = Math.floor(this.clearColor.g * 255);
			var b = Math.floor(this.clearColor.b * 255);
			this.setFillStyle("rgba(" + r + "," + g + "," + b + "," + this.clearAlpha + ")");
			this.context.fillRect(Math.round(this.clearBox.min.x) | 0,Math.round(this.clearBox.min.y) | 0,Math.round(this.clearBox.max.x - this.clearBox.min.x) | 0,Math.round(this.clearBox.max.y - this.clearBox.min.y) | 0);
		}
		this.clearBox.makeEmpty();
	}
	,getMaxAnisotropy: function() {
		return 0;
	}
	,setClearColorHex: function(hex,alpha) {
		console.log("CanvasRenderer.setClearColorHex is deprecated");
	}
	,setClearColor: function(color,alpha) {
		this.clearColor.set(color);
		this.clearAlpha = alpha != null?alpha:1.0;
		this.clearBox.set(new three.math.Vector2(-this.canvasWidthHalf,-this.canvasHeightHalf),new three.math.Vector2(this.canvasWidthHalf,this.canvasHeightHalf));
	}
	,setSize: function(width,height,updateStyle) {
		if(updateStyle == null) updateStyle = true;
		this.canvasWidth = width * this.devicePixelRatio;
		this.canvasHeight = height * this.devicePixelRatio;
		this.canvasWidthHalf = Math.floor(this.canvasWidth / 2);
		this.canvasHeightHalf = Math.floor(this.canvasHeight / 2);
		if(this.devicePixelRatio != 1 && updateStyle != false) {
			this.canvas.style.width = width + "px";
			this.canvas.style.height = height + "px";
		}
		this.clipBox.set(new three.math.Vector2(-this.canvasWidthHalf,-this.canvasHeightHalf),new three.math.Vector2(this.canvasWidthHalf,this.canvasHeightHalf));
		this.clearBox.set(new three.math.Vector2(-this.canvasWidthHalf,-this.canvasHeightHalf),new three.math.Vector2(this.canvasWidthHalf,this.canvasHeightHalf));
		this.contextGlobalAlpha = 1;
		this.contextGlobalCompositeOperation = 0;
		this.contextStrokeStyle = null;
		this.contextFillStyle = null;
		this.contextLineWidth = null;
		this.contextLineCap = null;
		this.contextLineJoin = null;
	}
	,setFaceCulling: function() {
	}
	,supportsVertexTextures: function() {
	}
	,__class__: three.renderers.CanvasRenderer
}
three.renderers.DebugRenderer = function(width,height) {
	if(height == null) height = 600;
	if(width == null) width = 800;
	this.clearAlpha = 1.0;
	this.autoClear = true;
	this.projector = new three.core.Projector();
	this.canvas = js.Browser.document.createElement("canvas");
	this.setSize(width,height);
	this.context = this.canvas.getContext("2d");
	js.Browser.document.body.appendChild(this.canvas);
	this.clearColor = new three.math.Color(15790320);
	this.clearAlpha = 1.0;
	this.context.imageSmoothingEnabled = false;
};
three.renderers.DebugRenderer.__name__ = true;
three.renderers.DebugRenderer.prototype = {
	renderFace4: function(element) {
		var x1 = element.v1.positionScreen.x * this.canvasWidthHalf;
		var y1 = element.v1.positionScreen.y * this.canvasHeightHalf;
		var x2 = element.v2.positionScreen.x * this.canvasWidthHalf;
		var y2 = element.v2.positionScreen.y * this.canvasHeightHalf;
		var x3 = element.v3.positionScreen.x * this.canvasWidthHalf;
		var y3 = element.v3.positionScreen.y * this.canvasHeightHalf;
		var x4 = element.v4.positionScreen.x * this.canvasWidthHalf;
		var y4 = element.v4.positionScreen.y * this.canvasHeightHalf;
		var material = element.material;
		if(js.Boot.__instanceof(material,three.materials.MeshFaceMaterial) == true) material = (js.Boot.__cast(material , three.materials.MeshFaceMaterial)).materials[0];
		var r = Math.round(material.color.r * 255);
		var g = Math.round(material.color.g * 255);
		var b = Math.round(material.color.b * 255);
		this.context.globalAlpha = material.opacity;
		if(material.blending == three.THREE.NormalBlending) this.context.globalCompositeOperation = "source-over"; else if(material.blending == three.THREE.AdditiveBlending) this.context.globalCompositeOperation = "lighter"; else if(material.blending == three.THREE.SubtractiveBlending) this.context.globalCompositeOperation = "darker";
		if(element.material.wireframe == true) {
			this.context.beginPath();
			this.context.moveTo(x1,y1);
			this.context.lineTo(x2,y2);
			this.context.lineTo(x3,y3);
			this.context.lineTo(x4,y4);
			this.context.closePath();
			this.context.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
			this.context.stroke();
		} else {
			var x5 = element.v2.positionScreen.x * this.canvasWidthHalf;
			var y5 = element.v2.positionScreen.y * this.canvasHeightHalf;
			var x6 = element.v4.positionScreen.x * this.canvasWidthHalf;
			var y6 = element.v4.positionScreen.y * this.canvasHeightHalf;
			this.context.beginPath();
			this.context.moveTo(x1,y1);
			this.context.lineTo(x2,y2);
			this.context.lineTo(x4,y4);
			this.context.lineTo(x5,y5);
			this.context.lineTo(x3,y3);
			this.context.lineTo(x6,y6);
			this.context.closePath();
			this.context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			this.context.fill();
		}
	}
	,render: function(scene,camera) {
		if(this.autoClear == true) this.clear();
		this.context.setTransform(1,0,0,-1,this.canvasWidthHalf,this.canvasHeightHalf);
		this.renderData = this.projector.projectScene(scene,camera,true,true);
		var e = 0, el = this.renderData.elements.length;
		while(e < el) {
			var element = this.renderData.elements[e++];
			if(element.type == three.THREE.RenderableFace4) {
				var element1 = js.Boot.__cast(element , three.renderers.renderables.RenderableFace4);
				var v1 = element1.v1, v2 = element1.v2, v3 = element1.v3, v4 = element1.v4;
				if(v1.positionScreen.z < -1 || v1.positionScreen.z > 1) continue;
				if(v2.positionScreen.z < -1 || v2.positionScreen.z > 1) continue;
				if(v3.positionScreen.z < -1 || v3.positionScreen.z > 1) continue;
				if(v4.positionScreen.z < -1 || v4.positionScreen.z > 1) continue;
				this.renderFace4(element1);
			}
		}
		this.context.setTransform(1,0,0,1,0,0);
	}
	,clear: function() {
		this.context.setTransform(1,0,0,1,0,0);
		this.context.setFillColor(this.clearColor.r * 255,Math.round(this.clearColor.g * 255),Math.round(this.clearColor.b * 255),this.clearAlpha);
		this.context.fillRect(0,0,this.canvasWidth,this.canvasHeight);
	}
	,setSize: function(width,height) {
		this.canvas.style.width = width + "px";
		this.canvas.style.height = height + "px";
		this.canvas.width = Math.round(width);
		this.canvas.height = Math.round(height);
		this.canvasWidth = width;
		this.canvasHeight = height;
		this.canvasWidthHalf = width / 2;
		this.canvasHeightHalf = height / 2;
	}
	,__class__: three.renderers.DebugRenderer
}
three.renderers.renderables = {}
three.renderers.renderables.Renderable = function() {
	this.z = null;
	this.material = null;
	this.type = null;
};
three.renderers.renderables.Renderable.__name__ = true;
three.renderers.renderables.Renderable.prototype = {
	__class__: three.renderers.renderables.Renderable
}
three.renderers.renderables.RenderableFace3 = function() {
	this.color = null;
	this.vertexNormalsLength = 0;
	three.renderers.renderables.Renderable.call(this);
	this.type = three.THREE.RenderableFace3;
	this.v1 = new three.renderers.renderables.RenderableVertex();
	this.v2 = new three.renderers.renderables.RenderableVertex();
	this.v3 = new three.renderers.renderables.RenderableVertex();
	this.centroidModel = new three.math.Vector3();
	this.normalModel = new three.math.Vector3();
	this.normalModelView = new three.math.Vector3();
	this.vertexNormalsModel = new Array();
	this.vertexNormalsModel.push(new three.math.Vector3());
	this.vertexNormalsModel.push(new three.math.Vector3());
	this.vertexNormalsModel.push(new three.math.Vector3());
	this.vertexNormalsModelView = new Array();
	this.vertexNormalsModelView.push(new three.math.Vector3());
	this.vertexNormalsModelView.push(new three.math.Vector3());
	this.vertexNormalsModelView.push(new three.math.Vector3());
	this.uvs = new Array();
	this.uvs.push(new Array());
};
three.renderers.renderables.RenderableFace3.__name__ = true;
three.renderers.renderables.RenderableFace3.__super__ = three.renderers.renderables.Renderable;
three.renderers.renderables.RenderableFace3.prototype = $extend(three.renderers.renderables.Renderable.prototype,{
	__class__: three.renderers.renderables.RenderableFace3
});
three.renderers.renderables.RenderableFace4 = function() {
	this.color = null;
	this.vertexNormalsLength = 0;
	three.renderers.renderables.Renderable.call(this);
	this.type = three.THREE.RenderableFace4;
	this.v1 = new three.renderers.renderables.RenderableVertex();
	this.v2 = new three.renderers.renderables.RenderableVertex();
	this.v3 = new three.renderers.renderables.RenderableVertex();
	this.v4 = new three.renderers.renderables.RenderableVertex();
	this.centroidModel = new three.math.Vector3();
	this.normalModel = new three.math.Vector3();
	this.normalModelView = new three.math.Vector3();
	this.vertexNormalsModel = new Array();
	this.vertexNormalsModel.push(new three.math.Vector3());
	this.vertexNormalsModel.push(new three.math.Vector3());
	this.vertexNormalsModel.push(new three.math.Vector3());
	this.vertexNormalsModel.push(new three.math.Vector3());
	this.vertexNormalsModelView = new Array();
	this.vertexNormalsModelView.push(new three.math.Vector3());
	this.vertexNormalsModelView.push(new three.math.Vector3());
	this.vertexNormalsModelView.push(new three.math.Vector3());
	this.vertexNormalsModelView.push(new three.math.Vector3());
	this.uvs = new Array();
	this.uvs.push(new Array());
};
three.renderers.renderables.RenderableFace4.__name__ = true;
three.renderers.renderables.RenderableFace4.__super__ = three.renderers.renderables.Renderable;
three.renderers.renderables.RenderableFace4.prototype = $extend(three.renderers.renderables.Renderable.prototype,{
	__class__: three.renderers.renderables.RenderableFace4
});
three.renderers.renderables.RenderableLine = function() {
	three.renderers.renderables.Renderable.call(this);
	this.type = three.THREE.RenderableLine;
	this.v1 = new three.renderers.renderables.RenderableVertex();
	this.v2 = new three.renderers.renderables.RenderableVertex();
	this.vertexColors.push(new three.math.Color());
	this.vertexColors.push(new three.math.Color());
};
three.renderers.renderables.RenderableLine.__name__ = true;
three.renderers.renderables.RenderableLine.__super__ = three.renderers.renderables.Renderable;
three.renderers.renderables.RenderableLine.prototype = $extend(three.renderers.renderables.Renderable.prototype,{
	__class__: three.renderers.renderables.RenderableLine
});
three.renderers.renderables.RenderableObject = function() {
	this.object = null;
	three.renderers.renderables.Renderable.call(this);
	this.type = three.THREE.RenderableObject;
};
three.renderers.renderables.RenderableObject.__name__ = true;
three.renderers.renderables.RenderableObject.__super__ = three.renderers.renderables.Renderable;
three.renderers.renderables.RenderableObject.prototype = $extend(three.renderers.renderables.Renderable.prototype,{
	__class__: three.renderers.renderables.RenderableObject
});
three.renderers.renderables.RenderableParticle = function() {
	this.scale = null;
	this.rotation = null;
	this.y = null;
	this.x = null;
	this.object = null;
	three.renderers.renderables.Renderable.call(this);
	this.type = three.THREE.RenderableParticle;
	this.scale = new three.math.Vector2();
};
three.renderers.renderables.RenderableParticle.__name__ = true;
three.renderers.renderables.RenderableParticle.__super__ = three.renderers.renderables.Renderable;
three.renderers.renderables.RenderableParticle.prototype = $extend(three.renderers.renderables.Renderable.prototype,{
	__class__: three.renderers.renderables.RenderableParticle
});
three.renderers.renderables.RenderableVertex = function() {
	this.visible = true;
	three.renderers.renderables.Renderable.call(this);
	this.type = three.THREE.RenderableVertex;
	this.positionWorld = new three.math.Vector3();
	this.positionScreen = new three.math.Vector4();
};
three.renderers.renderables.RenderableVertex.__name__ = true;
three.renderers.renderables.RenderableVertex.__super__ = three.renderers.renderables.Renderable;
three.renderers.renderables.RenderableVertex.prototype = $extend(three.renderers.renderables.Renderable.prototype,{
	copy: function(vertex) {
		this.positionWorld.copy(vertex.positionWorld);
		this.positionScreen.copy(vertex.positionScreen);
	}
	,__class__: three.renderers.renderables.RenderableVertex
});
three.scenes = {}
three.scenes.Scene = function() {
	three.core.Object3D.call(this);
	this.__objects = new haxe.ds.ObjectMap();
	this.__lights = new haxe.ds.ObjectMap();
	this.__objectsAdded = new haxe.ds.ObjectMap();
	this.__objectsRemoved = new haxe.ds.ObjectMap();
	this.autoUpdate = true;
	this.matrixAutoUpdate = false;
};
three.scenes.Scene.__name__ = true;
three.scenes.Scene.__super__ = three.core.Object3D;
three.scenes.Scene.prototype = $extend(three.core.Object3D.prototype,{
	__removeObject: function(object) {
		if(js.Boot.__instanceof(object,three.lights.Light) == true) {
			if(this.__lights.h.hasOwnProperty(object.__id__) == true) this.__lights.remove(object);
		} else if(js.Boot.__instanceof(object,three.cameras.Camera) == false) {
			if(this.__objects.h.hasOwnProperty(object.__id__) == true) {
				this.__objects.set(object,object);
				this.__objectsRemoved.set(object,object);
				if(this.__objectsAdded.h.hasOwnProperty(object.__id__) == true) this.__objectsAdded.remove(object);
			}
		}
		var cIter = object.children.iterator();
		while(cIter.hasNext() == true) this.__removeObject(cIter.next());
	}
	,__addObject: function(object) {
		if(js.Boot.__instanceof(object,three.lights.Light) == true) {
			if(this.__lights.h.hasOwnProperty(object.__id__) == false) this.__lights.set(object,object);
			if(object.target != null && object.target.parent == null) this.add(object.target);
		} else if(js.Boot.__instanceof(object,three.cameras.Camera) == false) {
			if(this.__objects.h.hasOwnProperty(object.__id__) == false) {
				this.__objects.set(object,object);
				this.__objectsAdded.set(object,object);
				if(this.__objectsRemoved.h.hasOwnProperty(object.__id__) == true) this.__objectsRemoved.remove(object);
			}
		}
		var cIter = object.children.iterator();
		while(cIter.hasNext() == true) this.__addObject(cIter.next());
	}
	,__class__: three.scenes.Scene
});
three.textures = {}
three.textures.Image = function(width,height) {
	this.height = 0;
	this.width = 0;
	this.data = null;
	this.data = new Array();
	if(width != null) {
		this.width = width;
		this.height = height;
	}
};
three.textures.Image.__name__ = true;
three.textures.Image.prototype = {
	__class__: three.textures.Image
}
three.textures.Texture = function(image,mapping,wrapS,wrapT,magFilter,minFilter,format,type,anisotropy) {
	this.onUpdate = null;
	this.needsUpdate = false;
	this.unpackAlignment = 4;
	this.flipY = true;
	this.premultiplyAlpha = false;
	this.generateMipmaps = true;
	this.anisotropy = 1;
	this.mapping = three.THREE.UVMapping;
	this.wrapS = three.THREE.ClampToEdgeWrapping;
	this.wrapT = three.THREE.ClampToEdgeWrapping;
	this.magFilter = three.THREE.LinearFilter;
	this.minFilter = three.THREE.LinearMipMapLinearFilter;
	this.format = three.THREE.RGBAFormat;
	this.type = three.THREE.UnsignedByteType;
	this.image = image;
	this.mipmaps = new Array();
	if(wrapS != null) this.wrapS = wrapS; else this.wrapS = three.THREE.ClampToEdgeWrapping;
	if(wrapT != null) this.wrapT = wrapT; else this.wrapT = three.THREE.ClampToEdgeWrapping;
	if(magFilter != null) this.magFilter = magFilter; else this.magFilter = three.THREE.LinearFilter;
	if(minFilter != null) this.minFilter = minFilter; else this.minFilter = three.THREE.LinearMipMapLinearFilter;
	if(anisotropy != null) this.anisotropy = anisotropy;
	if(format != null) this.format = format; else this.format = three.THREE.RGBAFormat;
	if(type != null) this.type = type; else this.type = three.THREE.UnsignedByteType;
	this.offset = new three.math.Vector2(0,0);
	this.repeat = new three.math.Vector2(1,1);
	if(image != null) this.needsUpdate = true;
};
three.textures.Texture.__name__ = true;
three.textures.Texture.prototype = {
	clone: function(texture) {
		if(texture == null) texture = new three.textures.Texture();
		texture.image = this.image;
		texture.mipmaps = this.mipmaps.slice(0);
		texture.mapping = this.mapping;
		texture.wrapS = this.wrapS;
		texture.wrapT = this.wrapT;
		texture.magFilter = this.magFilter;
		texture.minFilter = this.minFilter;
		texture.anisotropy = this.anisotropy;
		texture.format = this.format;
		texture.type = this.type;
		texture.offset.copy(this.offset);
		texture.repeat.copy(this.repeat);
		texture.generateMipmaps = this.generateMipmaps;
		texture.premultiplyAlpha = this.premultiplyAlpha;
		texture.flipY = this.flipY;
		texture.unpackAlignment = this.unpackAlignment;
		return texture;
	}
	,__class__: three.textures.Texture
}
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(typeof(JSON) != "undefined") haxe.Json = JSON;
haxe.ds.ObjectMap.count = 0;
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
three.THREE.Mesh = 0;
three.THREE.Light = 1;
three.THREE.AmbientLight = 2;
three.THREE.RenderableFace3 = 0;
three.THREE.RenderableFace4 = 1;
three.THREE.RenderableLine = 2;
three.THREE.RenderableObject = 3;
three.THREE.RenderableParticle = 4;
three.THREE.RenderableVertex = 5;
three.THREE.defaultEulerOrder = "XYZ";
three.THREE.CullFaceNone = 0;
three.THREE.CullFaceBack = 1;
three.THREE.CullFaceFront = 2;
three.THREE.CullFaceFrontBack = 3;
three.THREE.FrontFaceDirectionCW = 0;
three.THREE.FrontFaceDirectionCCW = 1;
three.THREE.BasicShadowMap = 0;
three.THREE.PCFShadowMap = 1;
three.THREE.PCFSoftShadowMap = 2;
three.THREE.FrontSide = 0;
three.THREE.BackSide = 1;
three.THREE.DoubleSide = 2;
three.THREE.NoShading = 0;
three.THREE.FlatShading = 1;
three.THREE.SmoothShading = 2;
three.THREE.NoColors = 0;
three.THREE.FaceColors = 1;
three.THREE.VertexColors = 2;
three.THREE.NoBlending = 0;
three.THREE.NormalBlending = 1;
three.THREE.AdditiveBlending = 2;
three.THREE.SubtractiveBlending = 3;
three.THREE.MultiplyBlending = 4;
three.THREE.CustomBlending = 5;
three.THREE.AddEquation = 100;
three.THREE.SubtractEquation = 101;
three.THREE.ReverseSubtractEquation = 102;
three.THREE.ZeroFactor = 200;
three.THREE.OneFactor = 201;
three.THREE.SrcColorFactor = 202;
three.THREE.OneMinusSrcColorFactor = 203;
three.THREE.SrcAlphaFactor = 204;
three.THREE.OneMinusSrcAlphaFactor = 205;
three.THREE.DstAlphaFactor = 206;
three.THREE.OneMinusDstAlphaFactor = 207;
three.THREE.DstColorFactor = 208;
three.THREE.OneMinusDstColorFactor = 209;
three.THREE.SrcAlphaSaturateFactor = 210;
three.THREE.MultiplyOperation = 0;
three.THREE.MixOperation = 1;
three.THREE.AddOperation = 2;
three.THREE.UVMapping = 0;
three.THREE.CubeRflectionMapping = 1;
three.THREE.CubeRefractionMapping = 2;
three.THREE.SphericalReflectionMapping = 3;
three.THREE.SphericalRefractionMapping = 4;
three.THREE.RepeatWrapping = 1000;
three.THREE.ClampToEdgeWrapping = 1001;
three.THREE.MirroredRepeatWrapping = 1002;
three.THREE.NearestFilter = 1003;
three.THREE.NearestMipMapNearestFilter = 1004;
three.THREE.NearestMipMapLinearFilter = 1005;
three.THREE.LinearFilter = 1006;
three.THREE.LinearMipMapNearestFilter = 1007;
three.THREE.LinearMipMapLinearFilter = 1008;
three.THREE.UnsignedByteType = 1009;
three.THREE.ByteType = 1010;
three.THREE.ShortType = 1011;
three.THREE.UnsignedShortType = 1012;
three.THREE.IntType = 1013;
three.THREE.UnsignedIntType = 1014;
three.THREE.FloatType = 1015;
three.THREE.UnsignedShort4444Type = 1016;
three.THREE.UnsignedShort5551Type = 1017;
three.THREE.UnsignedShort565Type = 1018;
three.THREE.AlphaFormat = 1019;
three.THREE.RGBFormat = 1020;
three.THREE.RGBAFormat = 1021;
three.THREE.LuminanceFormat = 1022;
three.THREE.LuminanceAlphaFormat = 1023;
three.THREE.RGB_S3TC_DXT1_Format = 2001;
three.THREE.RGBA_S3TC_DXT1_Format = 2002;
three.THREE.RGBA_S3TC_DXT3_Format = 2003;
three.THREE.RGBA_S3TC_DXT5_Format = 2004;
three.extras.MathUtils.DEG2RAD = Math.PI / 180;
three.extras.MathUtils.RAD2DEG = 180 / Math.PI;
Tcanvas.main();
})();
