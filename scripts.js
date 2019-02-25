// LYRIC INFO  ----------------------------------------------------------
const songList = {
  1: "So eat it just eat it,You better listen better do what youre told,You havent even touched your tuna casserole,You better chow down or its gonna get cold,So eat it,I dont care if youre full,Just eat it eat it eat it eat it,Open up your mouth and feed it,Have some more yogurt have some more Spam,It doesnt matter if its fresh or canned,Just eat it eat it eat it,eat it,Dont you make me repeat it,Have a banana have a whole bunch,It doesnt matter what you had for lunch,Just eat it eat it eat it eat it,Eat it eat it eat it eat it,Eat it eat it eat it eat it,If its gettin cold reheat it,Have a big dinner have a light snack,If you dont like it you cant send it back,Just eat it eat it eat it eat it,Get yourself an egg and beat it,Oh Lord,Have some more chicken have some more pie,It doesnt matter if its broiled or fried,Just eat it eat it eat it eat it,Dont you make me repeat it,Oh no,Have a banana have a whole bunch,It doesnt matter what you had for lunch".split(','),

  2: "So messed up I want you here,In my room, I want you here, Now we're gonna be face-to-face,And I'll lay right down in my favorite place,And now I want to be your dog,Now I want to be your dog,Now I want to be your dog,Well come on,Now I'm ready to close my eyes,And now I'm ready to close my mind,And now I'm ready to feel your hand,And lose my heart on the burning sands,And now I want to be your dog,And now I wanna be your dog,Now I want to be your dog,Well, come on".split(',')
};

// INITIAL REDUX STATE ----------------------------------------------------------
const initialState = {
  currentSongId: null,
  songsById: {
    1: {
      title: "Fat",
      artist: "Weird Al",
      songId: 1,
      songArray: songList[1],
      arrayPosition: 0,
    },
    2: {
      title: "wanna be your dog",
      artist: "the stooges",
      songId: 2,
      songArray: songList[2],
      arrayPosition: 0,
    }
  }
};

// REDUX REDUCER  ----------------------------------------------------------
const lyricChangeReducer = (state = initialState.songsById, action) => {

  // Declares several variables used below, without yet defining.
  let newArrayPosition;
  let newSongsByIdEntry;
  let newSongsByIdStateSlice;

  switch (action.type) {
    case 'NEXT_LYRIC':

      // Locates the arrayPosition of the song whose ID was provided
      // in the action's payload, and increments it by one:
      newArrayPosition = state[action.currentSongId].arrayPosition + 1;

      // Creates a copy of that song's entry in the songsById state slice,
      // and adds the updated newArrayPosition value we just calculated as its arrayPosition:
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: newArrayPosition
      })

      // Creates a copy of the entire songsById state slice, and adds the
      // updated newSongsById state entry we just created to this new copy:
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });

      // Returns the entire newSongsByIdStateSlice we just constructed, which will
      // update state in our Redux store to match this returned value:
      return newSongsByIdStateSlice;

    case 'RESTART_SONG':

      // Creates a copy of the song entry in songsById state slice whose ID matches
      // the currentSongId included with the action, sets the copy's arrayPosition value
      // to 0:
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: 0
      })

      // Creates a copy of the entire songsById state slice, and adds the
      // updated newSongsByIdEntry we just created to this copy:
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });

      // Returns the entire newSongsByIdStateSlice we just constructed, which will
      // update the songsById state slice in our Redux store to match the new slice returned:
      return newSongsByIdStateSlice;

      // If action is neither 'NEXT_LYRIC' nor 'RESTART_STATE' type, return existing state:
    default:
      return state;
  }
}

const songChangeReducer = (state = initialState.currentSongId, action) => {
  switch (action.type){
    case 'CHANGE_SONG':
      return action.newSelectedSongId
    default:
      return state;
  }
}

const rootReducer = this.Redux.combineReducers({
  currentSongId: songChangeReducer,
  songsById: lyricChangeReducer
});

// REDUX STORE  ----------------------------------------------------------
const { createStore } = Redux;
const store = createStore(rootReducer);


// JEST TESTS + SETUP ----------------------------------------------------------
const { expect } = window;

expect(lyricChangeReducer(initialState.songsById, { type: null })).toEqual(initialState.songsById);

expect(lyricChangeReducer(initialState.songsById, { type: 'NEXT_LYRIC', currentSongId: 2 })).toEqual({
  1: {
    title: "Fat",
    artist: "Weird Al",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "wanna be your dog",
    artist: "the stooges",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 1,
  }
});

expect(lyricChangeReducer(initialState.songsById, { type: 'RESTART_SONG', currentSongId: 1 })).toEqual({
  1: {
    title: "Fat",
    artist: "Weird Al",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "wanna be your dog",
    artist: "the stooges",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 0,
  }
});

expect(songChangeReducer(initialState, { type: null })).toEqual(initialState);

expect(songChangeReducer(initialState, { type: 'CHANGE_SONG', newSelectedSongId: 1 })).toEqual(1);

expect(rootReducer(initialState, { type: null })).toEqual(initialState);

expect(store.getState().currentSongId).toEqual(songChangeReducer(undefined, { type: null }));

expect(store.getState().songsById).toEqual(lyricChangeReducer(undefined, { type: null }));

// ------------
// example JEST TEST
// test('two plus two is four', () => {
//   expect(2 + 2).toBe(4);
// });
// ------------


// RENDERING STATE IN DOM ----------------------------------------------------------
const renderLyrics = () => {
  // defines a lyricsDisplay constant referring to the div with a 'lyrics' ID in index.html
  const lyricsDisplay = document.getElementById('lyrics');
  // if there are already lyrics in this div, remove them one-by-one until it is empty:
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }
  if (store.getState().currentSongId) {
      const currentLine = document.createTextNode(store.getState().songsById[store.getState().currentSongId].songArray[store.getState().songsById[store.getState().currentSongId].arrayPosition]);
      document.getElementById('lyrics').appendChild(currentLine);
    } else {
      const selectSongMessage = document.createTextNode("Select a song from the menu above to sing along!");
      document.getElementById('lyrics').appendChild(selectSongMessage);
    }
  }

const renderSongs = () => {

  // Retrieves songsById state slice from store:
  const songsById = store.getState().songsById;

  // Cycles through each key in songsById:
  for (const songKey in songsById) {

    // Locates song corresponding with each key, saves as 'song' constant:
    const song = songsById[songKey]

    // Creates <li>, <h3>, and <em> HTMl elements to render this song's
    // information in the DOM:
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');

    // Creates text node containing each song's title:
    const songTitle = document.createTextNode(song.title);

    // Creates text node containing each song's artist:
    const songArtist = document.createTextNode(' by ' + song.artist);

    // Adds songTitle text node to the <em> element we created 3 lines up:
    em.appendChild(songTitle);

    // Adds <em> element that now contains song title to <h3> element created
    // 5 lines up:
    h3.appendChild(em);

    // Also adds songArtist text node created 2 lines up to <h3> element created
    // 6 lines up:
    h3.appendChild(songArtist);

    // Adds click event listener to same  <h3> element, when this <h3> is clicked,
    // an event handler called selectSong() will run, using song's ID as argument:
    h3.addEventListener('click', function() {
      selectSong(song.songId);
    });

    // Adds entire <h3> element to the <li> element created 11 lines above:
    li.appendChild(h3);

    // Appends this <li> element to the <ul> in index.html with a 'songs' ID:
    document.getElementById('songs').appendChild(li);
  }
}


// runs renderLyrics() method from above when page is finished loading.
// window.onload is HTML5 version of jQuery's $(document).ready()
window.onload = function() {
  renderSongs();
  renderLyrics();
}

// CLICK LISTENER  ----------------------------------------------------------
const userClick = () => {
  if (store.getState().songsById[store.getState().currentSongId].arrayPosition === store.getState().songsById[store.getState().currentSongId].songArray.length - 1) {
    store.dispatch({ type: 'RESTART_SONG',
                     currentSongId: store.getState().currentSongId });
  } else {
    store.dispatch({ type: 'NEXT_LYRIC',
                     currentSongId: store.getState().currentSongId });
  }
}

const selectSong = (newSongId) => {
  let action;
  if (store.getState().currentSongId) {
    action = {
      type: 'RESTART_SONG',
      currentSongId: store.getState().currentSongId
    }
    store.dispatch(action);
  }
  action = {
    type: 'CHANGE_SONG',
    newSelectedSongId: newSongId
  }
  store.dispatch(action);
}

store.subscribe(renderLyrics);
