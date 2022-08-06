import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    dropdown: {
        type: "",
        id: "",
    }
}

const dropdownSlice = createSlice({
    name: "dropdown",
    initialState,
    reducers: {
        getDropdownItems: (state, action) => {
            state.dropdown = action.payload;
        }
    }
})