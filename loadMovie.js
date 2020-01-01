const movie = require('./callMovie');
const base = Buffer.alloc(1, 0);

module.exports = function (req, res, url) {
	switch (req.method) {
		case 'GET':
			const match = req.url.match(/\/movies\/([^.]+)(?:\.zip)?$/);
			if (!match) return;

			var id = match[1];
			res.setHeader('Content-Type', 'application/zip');
			movie.load(id).then(v => { res.statusCode = 200, res.end(v) })
				.catch(e => { res.statusCode = 404, res.end(e) })
			return true;

		case 'POST':
			if (!url.path.startsWith('/goapi/getMovie/')) return;
			res.setHeader('Content-Type', 'application/zip');

			movie.load(url.query.movieId).then(b =>
				res.end(Buffer.concat([base, b]))
			).catch(() => res.end('1'));
			return true;
	}
}