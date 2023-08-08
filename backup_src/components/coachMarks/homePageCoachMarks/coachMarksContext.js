import React, { createContext, useContext, useState } from 'react'

export const CoachMarksContext = createContext()

export const CoachMarksContextProvider = ({ children }) => {
    const [run, setRun] = useState(false);
    const [isEnd, setIsEnd] = useState(false)
    const [isStart, setIsStart] = useState(true)
    const [currentStep, setCurrentStep] = useState(0)
    const [hasPassedTour, setHasPassedTour] = useState(false)
    const [steps, setSteps] = useState({ type: null, list: [] });
    const [screenWidth, setScreenWidth] = useState(0);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    return(
        <CoachMarksContext.Provider value={{ run, setRun, isEnd, setIsEnd, isStart, setIsStart, currentStep, setCurrentStep, hasPassedTour, setHasPassedTour, steps, setSteps, screenWidth, setScreenWidth, menuIsOpen, setMenuIsOpen }}>{children}</CoachMarksContext.Provider>
    )
}

export const useCoachMarksContext = () => {
    return useContext(CoachMarksContext)
}