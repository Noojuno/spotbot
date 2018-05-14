const fetch = require("isomorphic-fetch");

class Spotify {
  constructor(options) {
    this.client_id = options.client_id;
    this.client_secret = options.client_secret;
    this.redirect_uri = options.redirect_uri;
  }

  generateAccessUrl(scopes) {
    const authUrl = "https://accounts.spotify.com/authorize";
    const client_id = this.client_id;
    const response_type = "code";
    const redirect_uri = this.redirect_uri;
    const scope = (scopes || []).join(" ");

    const params = { client_id, response_type, redirect_uri, scope };
    const paramString = paramify(params);

    return authUrl + "?" + paramString;
  }

  setAccessToken(token) {
    this.access_token = token;
  }

  async getTokens(code) {
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const grant_type = "authorization_code";
    const redirect_uri = this.redirect_uri;

    const params = paramify({
      grant_type,
      redirect_uri,
      code,
      client_id: this.client_id,
      client_secret: this.client_secret
    });

    const options = {
      method: "POST",
      body: params,
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    };

    try {
      let res = await fetch(tokenUrl, options);
      return res.json();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async refreshToken(refresh_token) {
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const grant_type = "refresh_token";
    const redirect_uri = this.redirect_uri;

    const params = paramify({
      grant_type,
      refresh_token,
      client_id: this.client_id,
      client_secret: this.client_secret
    });

    const options = {
      method: "POST",
      body: params,
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    };

    try {
      let res = await fetch(tokenUrl, options);
      return res.json();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createPlaylist(name, user, isPublic = true) {
    const url = "https://api.spotify.com/v1/users/" + user + "/playlists";

    const body = { name, public: isPublic };
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    };

    try {
      let res = await fetch(url, options);
      return res.json();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async addSongToPlaylist(songId, playlistId, user) {
    const url =
      "https://api.spotify.com/v1/users/" +
      user +
      "/playlists/" +
      playlistId +
      "/tracks";

    const body = {
      uris: ["spotify:track:" + songId]
    };

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(body)
    };

    try {
      let res = await fetch(url, options);
      return res.json();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

const paramify = params => {
  const paramString = Object.keys(params)
    .map(function(k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
    })
    .join("&");

  return paramString;
};

module.exports = Spotify;
