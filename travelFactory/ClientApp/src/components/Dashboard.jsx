import { useState, useEffect } from "react";
import "./Dashboard.css"
import Appview from "./Appview";


const Dashboard = () => {
    const [apps, setapps] = useState([]);
    const [addApp, setaddApp] = useState(false);

    useEffect(() => {
        const FetchDataApps = async () => {
            try {
                const response = await fetch('AppModel');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setapps(result)
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        }
        FetchDataApps()
    }, [addApp])

    const handleNewApp = () => { setaddApp(false) };
    const appTitles = (app, index) => <div className="app-title" key={index} >{app.title}</div>

    const downloadXlsx = async (appId) => {
        try {
            const response = await fetch(`/AppModel/download?appName=${appId}`);
            if (!response.ok) {
                throw new Error('Failed to download CSV');
            }
            const blob = await response.blob();
            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(new Blob([blob]));
            link.download = `${appId}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading CSV:', error);
        }
    }

    const allProjectView = () => {
        return (
            <>
                {apps.map((appInfo, i) => appCard(appInfo, i))}
                <button onClick={() => setaddApp(true)}>Add app</button>
            </>
        )
    }
    const appCard = (appObject, index) => {
        return (
            <fieldset className="app-info" key={index} >
                <legend>{appObject.title}</legend>
                <div className="info"><b>Last deployement:</b>  {appObject.deployed}</div>
                <div className="controller-btn">
                    <button onClick={() => downloadXlsx(appObject.title)}>download on xlsx</button>
                    <button>Deploy</button>
                </div>
            </fieldset>
        )
    }
    return (
        <>
            <h2 className="title">Translator manager</h2>
            <div className="dashboard-container">
                <div className="left-apps">
                    <h2 className="title">My Apps</h2>
                    {apps.map((app, i) => appTitles(app, i))}
                </div>
                <div className="right-container">
                    {(addApp) ? <Appview handleAdd={() => handleNewApp()} /> : allProjectView()}
                </div>
            </div>
        </>
    )
}

export default Dashboard