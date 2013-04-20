var key = '86848195-3da5-444b-b9ba-50bef67bf677';

function makeReq(urlPart, success) {
	var req = new XMLHttpRequest();
	req.open("GET", "https://genericwitticism.com:8000/api3/?session=" + key + "&command=" + urlPart);
	req.onreadystatechange = function() {
		if (req.readyState === 4) {
			success(JSON.parse(req.responseText));
		}
	};
	req.send(null);
}

function doGetParty(success) {
	makeReq("getparty", success);
}

function doCreateChar(success, stats) {
	makeReq("createcharacter&arg=" + JSON.stringify(stats), success);
}

function doGetChar(success, id) {
	makeReq("getcharacter&arg=" + encodeURIComponent(id), success);
}

function doDeleteChar(success, id) {
	makeReq("deletecharacter&arg=" + encodeURIComponent(id), success);
}

var last10Req = [];
function ratelimit(fun) {
	return function f() {
		var now = Date.now();
		if (last10Req.length === 10) {
			if (last10Req[0] + 1000 > now) {
				setTimeout(function() {
					f.apply(this, arguments);
				}, last10Req[0] + 1000 - now);
				return;
			}
			last10Req.shift();
		}
		last10Req.push(now);
		fun.apply(this, arguments);
	};
}

var getParty = ratelimit(doGetParty);
var createChar = ratelimit(doCreateChar);
var getChar = ratelimit(doGetChar);
var deleteChar = ratelimit(doDeleteChar);

/*
createChar(function(ret) {
	console.log(ret);
	var id = ret._id;
	getParty(function(ret) {
		console.log(ret);
		getChar(function(ret) {
			console.log(ret);
			deleteChar(function(ret) {
				console.log(ret);
				console.log("done");
			}, id);
		}, id);
	});
}, {'name':'foobar','str':'15','dex':'15','con':'10','int':'10','wis':'10'});
*/
