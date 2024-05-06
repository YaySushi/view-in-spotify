require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());


app.get('/getSong', (req, res) => {
	const yt_api_key = process.env.YOUTUBE_API_KEY;
	const video_id = req.query.video_id;
	const url = "https://www.googleapis.com/youtube/v3/videos?id=" + video_id + "&key=" + yt_api_key + "&fields=items(snippet(title))&part=snippet";

	fetch(url)
		.then(response => response.json())
		.then(data => {
			var video_name = "";
			if (data["items"].length > 0)
				video_name = data["items"][0]["snippet"]["title"];
			video_name = cleanVideoName(video_name);

			// authenticate using `Client credentials` authorization flow
			// https://developer.spotify.com/documentation/web-api/concepts/authorization
			const auth_url = "https://accounts.spotify.com/api/token"
			const client_id = process.env.SPOTIFY_CLIENT_ID;
			const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
			const form = {
				'grant_type': 'client_credentials'
			}
			var formBody = [];
			for (var property in form) {
				var encodedKey = encodeURIComponent(property);
				var encodedValue = encodeURIComponent(form[property]);
				formBody.push(encodedKey + "=" + encodedValue);
			}
			formBody = formBody.join("&");
			options = {
				method: 'POST',
				body: formBody,
				headers: {
					'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret).toString('base64'),
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			};

			fetch(auth_url, options)
				.then(response => response.json())
				.then(data => {
					access_token = data["access_token"]
					// get song:
					const url2 = `https://api.spotify.com/v1/search?q= ${video_name} &type=track`;
					options = {
						method: 'GET',
						headers: {
							'Authorization': 'Bearer ' + access_token
						}
					};

					fetch(url2, options)
						.then(response2 => response2.json())
						.then(data => {
							tracks = data["tracks"]["items"];
							if (tracks)
								return res.send({ body: tracks[0] })
							return res.status(404).send('Not Found');
						}).catch(error => { console.error('Error:', error);; });
				}).catch(error => { console.error('Error:', error); });
		}).catch(error => { console.error('Error:', error); });
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

function cleanVideoName(videoname) {
	// remove anything in brackets (i.e. "(Official Video)") since it messes
	// up with Spotify's search. also remove dashes.
	videoname = videoname.replace('-', "");
	videoname = videoname.replace('"', "");
	videoname = videoname.replace(/\([\s\S]*\)/g, "");
	videoname = videoname.replace(/\[[\s\S]*\]/g, "");
	return videoname;
}