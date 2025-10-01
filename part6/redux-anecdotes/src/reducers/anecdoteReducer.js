import { createSlice } from "@reduxjs/toolkit";
import anecdotesService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdote",
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      console.log("rendering anecdotes", action.payload);
      return action.payload;
    },
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload;
      const index = state.findIndex((a) => a.id === updatedAnecdote.id);
      if (index !== -1) {
        state[index] = updatedAnecdote;
      }
    },
  },
});

export const { appendAnecdote, setAnecdotes, updateAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdotesService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const vote = (id) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdotesService.vote(id);
    dispatch(updateAnecdote(updatedAnecdote));
  };
};

export default anecdoteSlice.reducer;
