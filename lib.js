var key = '86848195-3da5-444b-b9ba-50bef67bf677';

function makeReq(urlPart, success) {
	// console.log(urlPart);
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

function doScan(success, id) {
	makeReq("scan&arg=" + encodeURIComponent(id), success);
}

function doSendMove(success, id, dir) {
	makeReq("move&arg=" + encodeURIComponent(id) + "&arg2=" + dir, success);
}

function doExamine(success, id) {
	makeReq("getinfofor&arg=" + encodeURIComponent(id), success);
}

function doPick(success, id) {
	makeReq("get&arg=" + encodeURIComponent(id), success);
}

function doDrop(success, id, itemId) {
	makeReq("drop&arg=" + encodeURIComponent(itemId) + "&arg2=" + encodeURIComponent(id), success);
}

function doAllocPoints(success, id, attr) {
	makeReq("allocatepoints&arg=" + attr + "&arg2=" + encodeURIComponent(id), success);
}

function doMoveStairs(success, id, type) {
	makeReq(type + "&arg=" + id, success);
}

function doUse(success, id, itemId, itemInfo) {
	var type;
	if (itemInfo.subtype == "potion")
		type = "quaff";
	else if (itemInfo.subtype == "weapon")
		type = "wield";
	else if (itemInfo.subtype == "armor")
		type = "equip";
	else
		type = prompt("lolwat \"" + itemInfo.subtype + "\"?");
	console.warn(itemInfo);
	makeReq(type + "&arg=" + itemId + "&arg2=" + id, success);
}

var last10Req = [];
function ratelimit(fun) {
	return function f() {
		var args = arguments;
		var now = Date.now();
		if (last10Req.length === 10) {
			if (last10Req[0] + 1100 > now) {
				setTimeout(function() {
					f.apply(this, args);
				}, last10Req[0] + 1100 - now);
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
var scan = ratelimit(doScan);
var sendMove = ratelimit(doSendMove);
var examine = ratelimit(doExamine);
var pick = ratelimit(doPick);
var drop = ratelimit(doDrop);
var allocPoints = ratelimit(doAllocPoints);
var moveStairs = ratelimit(doMoveStairs);
var use = ratelimit(doUse);

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
