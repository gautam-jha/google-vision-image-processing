const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
app.use(express.static(`${__dirname}/view`));
app.use(express.static(`${__dirname}/assets`));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
	console.log(`Running server on port ${port}`);
});
/* http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
}); */

const vision = require('@google-cloud/vision')({
	projectId: 'utopian-river-177800',
	keyFilename: 'key.json',
});

function getFeatures(data) {
	const result = [];
	data.forEach((x) => {
		result.push({ type: x });
	});
	return result;
}

app.get('/', (req, res) => {
	res.render('index.html');
});

app.post('/proceed', (req, res) => {
	vision
		.annotateImage({
			image: {
				source: { imageUri: req.body.image_url },
			},
			features: getFeatures(req.body.features),
		})
		.then((response) => {
			const result = {};
			result.features = req.body.features;
			result.body = response[0];
			result.imageUrl = req.body.image_url;
			return res.send(result);
		});
});
