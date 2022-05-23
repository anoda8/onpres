import React, {useState} from 'react';
import { Platform } from 'react-native';

export const useInputDate = () => { 
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }

    const showDatePicker = () => {
        showMode('date');
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    }

    return {
        date, showDatePicker, show, mode, onChange
    }
}

export const useInputTime = () => { 
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }

    const showDatePicker = () => {
        showMode('time');
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    }

    return {
        date, showDatePicker, show, mode, onChange
    }
}