import * as types from './../constants/ActionTypes';
import v4 from 'uuid/v4';
import { MusicMatch } from '../../.env';

export const nextLyric = (currentSongId) => ({
  type: types.NEXT_LYRIC,
  currentSongId
});

export const restartSong = (currentSongId) => ({
  type: types.RESTART_SONG,
  currentSongId
});

export const changeSong = (newSelectedSongId) => ({
  type: types.CHANGE_SONG,
  newSelectedSongId
});

// Takes the 'title' from our form as argument:
export function fetchSongId(title) {

  // Notice the entire method actually returns a function!
  // We'll discuss what's up with this in the next lesson.
  return function (dispatch) {

    // Creates a local ID with UUID:
    const localSongId = v4();

    // Replaces spaces in the user-provided song title with underscores
    // because our API URL cannot contain spaces:
    title = title.replace(' ', '_');

    // Returns the result of the fetch() function contacting the API
    // endpoint, with our title parameters added to request URL
    return fetch('http://api.musixmatch.com/ws/1.1/track.search?&q_track=' + title + '&page_size=1&s_track_rating=desc&apikey=${MusicMatch.apiKey')
    // .then() waits until code preceding it completes. So, code here
    // will not run until fetch() returns data from the API:
      .then(

        // Retrieves JSON response from API:
        response => response.json(),

        // Prints any errors to the console IF call is unsuccessful:
        error => console.log('An error occurred.', error))

    // Waits until code preceding it finishes to run.
    // The return value from first then() block (API response) is passed to second
    // .then() block as parameter 'json':
      .then(function(json) {

        // Yells excitedly, and prints API response to console.
        // We'll add more code here later, after we confirm responses are
        // being received correctly.
        console.log('CHECK OUT THIS SWEET API RESPONSE:', json);
      });
  };
}
