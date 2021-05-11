module.exports = smart404;
var routesName = "smart404_routes"
function smart404(app, {methods = ["GET"], distance = .8, status = 302, ignoreRoutes = []} = {}){
	methods = methods.map(i => i.trim().toLowerCase())
	global[routesName] = global[routesName] || app.routes || app._router.stack || router.stack;
	var routes = global[routesName]
	var mroutes = global[routesName].filter(i => i.route && i.stack).map(i => i.route).map(i => ({method: i.stack[0].method, path: i.path}));
	console.log(mroutes)
	return (req, res, next) => {
		console.log(mroutes);
		let p = req.path;
		if (mroutes.map(i => i.path).includes(p)) return next();
		let newpath = mroutes
			.filter(i => !ignoreRoutes.includes(i.path))
			.filter(i => req.method.toLowerCase() == i.method)
			.filter(i => methods.includes(i.method) && _distance(i.path, p) > distance)
			.map(i => i.path).sort(i => _distance(i, p))[0];
		if (newpath){
			res.status(status).redirect(newpath)
			return;
		} else {
			return next();
		}
	}
}

function _distance(a, b) {
	let adjustments = {
		A: "E",
		A: "I",
		A: "O",
		A: "U",
		B: "V",
		E: "I",
		E: "O",
		E: "U",
		I: "O",
		I: "U",
		O: "U",
		I: "Y",
		E: "Y",
		C: "G",
		E: "F",
		W: "U",
		W: "V",
		X: "K",
		S: "Z",
		X: "S",
		Q: "C",
		U: "V",
		M: "N",
		L: "I",
		Q: "O",
		P: "R",
		I: "J",
		2: "Z",
		5: "S",
		8: "B",
		1: "I",
		1: "L",
		0: "O",
		0: "Q",
		C: "K",
		G: "J",
		E: " ",
		Y: " ",
		S: " ",
	};
	if (!a || !b) {
		return 0.0;
	}
	a = a.trim().toUpperCase();
	b = b.trim().toUpperCase();
	var a_len = a.length;
	var b_len = b.length;
	var a_flag = [];
	var b_flag = [];
	var search_range = Math.floor(Math.max(a_len, b_len) / 2) - 1;
	var minv = Math.min(a_len, b_len);
	var Num_com = 0;
	var yl1 = b_len - 1;
	for (var i = 0; i < a_len; i++) {
		var lowlim = i >= search_range ? i - search_range : 0;
		var hilim = i + search_range <= yl1 ? i + search_range : yl1;
		for (var j = lowlim; j <= hilim; j++) {
			if (b_flag[j] !== 1 && a[j] === b[i]) {
				a_flag[j] = 1;
				b_flag[i] = 1;
				Num_com++;
				break;
			}
		}
	}
	if (Num_com === 0) {
		return 0.0;
	}
	var k = 0;
	var N_trans = 0;
	for (var i = 0; i < a_len; i++) {
		if (a_flag[i] === 1) {
			var j;
			for (j = k; j < b_len; j++) {
				if (b_flag[j] === 1) {
					k = j + 1;
					break;
				}
			}
			if (a[i] !== b[j]) {
				N_trans++;
			}
		}
	}
	N_trans = Math.floor(N_trans / 2);
	var N_simi = 0;
	var adjwt = adjustments;
	if (minv > Num_com) {
		for (var i = 0; i < a_len; i++) {
			if (!a_flag[i]) {
				for (var j = 0; j < b_len; j++) {
					if (!b_flag[j]) {
						if (adjwt[a[i]] === b[j]) {
							N_simi += 3;
							b_flag[j] = 2;
							break;
						}
					}
				}
			}
		}
	}
	var Num_sim = N_simi / 10.0 + Num_com;
	var weight =
		Num_sim / a_len + Num_sim / b_len + (Num_com - N_trans) / Num_com;
	weight = weight / 3;
	if (weight > 0.7) {
		var j = minv >= 4 ? 4 : minv;
		var i;
		for (i = 0; i < j && a[i] === b[i]; i++) {}
		if (i) {
			weight += i * 0.1 * (1.0 - weight);
		}
		if (minv > 4 && Num_com > i + 1 && 2 * Num_com >= minv + i) {
			weight +=
				(1 - weight) *
				((Num_com - i - 1) / (a_len * b_len - i * 2 + 2));
		}
	}
	return weight;
};
