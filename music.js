        const CLIENT_ID = '820ac110bc714b6c8dd097f1775f6083'; // Replace with your Spotify app's client ID
        const REDIRECT_URI = 'https://lizard-ctrl.github.io/spotifycollage/'; // Change this if needed
        const SCOPES = 'user-read-currently-playing user-modify-playback-state'; // Permissions to control playback
    
        // Get the access token from the URL hash
        function getAccessTokenFromUrl() {
            const hash = window.location.hash.substring(1); // Get everything after the '#'
            const params = new URLSearchParams(hash);
            return params.get('access_token');
        }
    
        // Redirect to Spotify login to authorize the app
        function redirectToSpotifyLogin() {
            const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
            window.location.href = authUrl; // Redirect the user to Spotify login
        }
    
        // Function to fetch and display the currently playing track
        async function fetchCurrentlyPlaying(accessToken) {
            try {
                const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
    
                if (response.status === 204 || response.status === 404) {
                    // No track currently playing
                    document.getElementById('track-name').innerText = 'No track is currently playing.';
                    document.getElementById('artist-name').innerText = '';
                    return;
                }
    
                const data = await response.json();
    
                // Extract and display the track name
                const trackName = data.item.name.toUpperCase();
                document.getElementById('track-name').innerText = trackName;
                const artistName = data.item.artists.map(artist => artist.name).join(', ').toUpperCase();
                document.getElementById('artist-name').innerText = `ARTIST: ${artistName}`;
            } catch (error) {
                console.error('Error fetching currently playing track:', error);
                document.getElementById('track-name').innerText = 'Failed to fetch track info.';
            }
        }
    
        // Function to skip to the next track
       async function skipToNextTrack(accessToken) {
        try {
                await fetch('https://api.spotify.com/v1/me/player/next', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                fetchCurrentlyPlaying(accessToken); // Update the displayed track
            } catch (error) {
                console.error('Error skipping to previous track:', error);
            }
}

    
        // Function to skip to the previous track
        async function skipToPreviousTrack(accessToken) {
            try {
                await fetch('https://api.spotify.com/v1/me/player/previous', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                fetchCurrentlyPlaying(accessToken); // Update the displayed track
            } catch (error) {
                console.error('Error skipping to previous track:', error);
            }
        }
    
        // Main logic to get token and fetch the track
        const accessToken = getAccessTokenFromUrl();
        if (accessToken) {
            // Token is available, fetch currently playing track
            fetchCurrentlyPlaying(accessToken);
        } else {
            // No token, redirect to Spotify login
            redirectToSpotifyLogin();
        }
    
        // Event listener for keydown events
        window.addEventListener('keydown', function (event) {
            const accessToken = getAccessTokenFromUrl();
            if (!accessToken) return; // Skip if there's no token
    
            if (event.code === 'Space') {
                // Spacebar pressed, fetch the track again
                fetchCurrentlyPlaying(accessToken);
            } else if (event.code === 'ArrowRight') {
                // Right arrow pressed, skip to next track
                skipToNextTrack(accessToken);
                event.preventDefault();
            } else if (event.code === 'ArrowLeft') {
                // Left arrow pressed, skip to previous track
                skipToPreviousTrack(accessToken);
                event.preventDefault();
            }
        });