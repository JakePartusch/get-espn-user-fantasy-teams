const axios = require('axios');

const getUserTeams = (loginValue, password, apiKey) => {
    const request = { loginValue, password };
    const headers = {'authorization' : `APIKEY ${apiKey}`, 'content-type': "application/json"}
    return axios.post('https://ha.registerdisney.go.com/jgc/v5/client/ESPN-ESPNCOM-PROD/guest/login?langPref=en-US', request, {headers}).then((response) => {
        return axios.get(`http://fan.api.espn.go.com/apis/v2/fans/${response.data.data.profile.swid}?xhr=1&source=ESPN.com+-+FAM`).then((response) => {
            const preferences = response.data.preferences;
            const leagueUrls = preferences.map(preference => preference.metaData.entry.entryURL)
            return leagueUrls;
        })
    });
}

exports.getEspnUserFantasyTeams = function getEspnUserFantasyTeams(req, res) {
  if (!req.body.username || !req.body.password || !req.body.apiKey) {
    res.status(400).send('No username/password defined!');
  } else {
    getUserTeams(req.body.username, req.body.password, req.body.apiKey).then((data) => {
    	res.status(200).send(data);
    }).catch((e) => {
    	console.log(e);
      	res.status(400).send("Unable to retrieve teams with specified username/password");
    });
  }
};