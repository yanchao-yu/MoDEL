import { useState, createContext } from 'react'

export const DataContext = createContext<any>(null);



const DataContextProvider = (props : any) => {

    const [data, setData] = useState<any>(null);

    console.log({globalData : data});
    
    return (
        <DataContext.Provider value={{
            data, setData
        }}>
            {props.children}
        </DataContext.Provider>
    );
}

export default DataContextProvider;