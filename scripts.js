// LYRIC INFO
const songLyricsArray = "So eat it just eat it,You better listen better do what youre told,You havent even touched your tuna casserole,You better chow down or its gonna get cold,So eat it,I dont care if youre full,Just eat it eat it eat it eat it,Open up your mouth and feed it,Have some more yogurt have some more Spam,It doesnt matter if its fresh or canned,Just eat it eat it eat it,eat it,Dont you make me repeat it,Have a banana have a whole bunch,It doesnt matter what you had for lunch,Just eat it eat it eat it eat it,Eat it eat it eat it eat it,Eat it eat it eat it eat it,If its gettin cold reheat it,Have a big dinner have a light snack,If you dont like it you cant send it back,Just eat it eat it eat it eat it,Get yourself an egg and beat it,Oh Lord,Have some more chicken have some more pie,It doesnt matter if its broiled or fried,Just eat it eat it eat it eat it,Dont you make me repeat it,Oh no,Have a banana have a whole bunch,It doesnt matter what you had for lunch".split(',');

// INITIAL REDUX STATE
const initialState = {
  songLyricsArray: songLyricsArray,
  arrayPosition: 0,
}

// REDUX REDUCER
const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case 'NEXT_LYRIC':
      let newArrayPosition = state.arrayPosition + 1;
      newState = {
        songLyricsArray: state.songLyricsArray,
        arrayPosition: newArrayPosition,
      }
      return newState;
    case 'RESTART_SONG':
      newState = initialState;
      return newState;
    default:
      return state;
  }
}

// JEST TESTS + SETUP
const { expect } = window;

expect(reducer(initialState, { type: null })).toEqual(initialState);

expect(reducer(initialState, { type: 'NEXT_LYRIC' })).toEqual({
  songLyricsArray: songLyricsArray,
  arrayPosition: 1
});

expect(reducer({
    songLyricsArray: songLyricsArray,
    arrayPosition: 1,
  },
  { type: 'RESTART_SONG' })
).toEqual(initialState);

// example JEST TEST
// test('two plus two is four', () => {
//   expect(2 + 2).toBe(4);
// });

// REDUX STORE
const { createStore } = Redux;
const store = createStore(reducer);

// RENDERING STATE IN DOM
const renderLyrics = () => {
  // defines a lyricsDisplay constant referring to the div with a 'lyrics' ID in index.html
  const lyricsDisplay = document.getElementById('lyrics');
  // if there are already lyrics in this div, remove them one-by-one until it is empty:
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }
  // Locates the song lyric at the current arrayPosition:
  const currentLine = store.getState().songLyricsArray[store.getState().arrayPosition];
  // Creates DOM text node containing the song lyric identified in line above:
  const renderedLine = document.createTextNode(currentLine);
  // Adds text node created in line above to 'lyrics' div in DOM
  document.getElementById('lyrics').appendChild(renderedLine);
}

// runs renderLyrics() method from above when page is finished loading.
// window.onload is HTML5 version of jQuery's $(document).ready()
window.onload = function() {
  renderLyrics();
}

// CLICK LISTENER
const userClick = () => {
  const currentState = store.getState();
  if (currentState.arrayPosition === currentState.songLyricsArray.length - 1) {
    store.dispatch({ type: 'RESTART_SONG' } );
  } else {
    store.dispatch({ type: 'NEXT_LYRIC' } );
  }
}
store.subscribe(renderLyrics);
