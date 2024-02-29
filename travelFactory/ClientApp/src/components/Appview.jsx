
import './Appview.css'
import { useState } from "react";

const Appview = (props) => {
    // eslint-disable-next-line react/prop-types
    let { handleAdd } = props;
    const [title, settitle] = useState('');
    const [words, setWords] = useState([]);
    const [key, setKey] = useState('');
    const [englishWord, setEnglishWord] = useState('');
    const [frenchWord, setFrenchWord] = useState('');
    const [dutchWord, setDutchWord] = useState('');

    const addWord = () => {
        setWords([...words, { Key: key, English: englishWord, French: frenchWord, Dutch: dutchWord }]);
        setKey('');
        setEnglishWord('');
        setFrenchWord('');
        setDutchWord('');
    }

    const postNewApp = async (e) => {
        e.preventDefault()
        const url = '/AppModel/CreateApp';
        const newApp = {
            Title: title,
            deployed: new Date().toString(),
            Words: words
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newApp)
            });
            if (response.ok) {
                console.log('New app created:');
                handleAdd();
            } else {
                const errorMessage = await response.text();
                alert(errorMessage);
                console.error('Error creating app:', errorMessage);
            }
        } catch (error) {
            console.error('An error occurred during the fetch:', error);
        }
    }

    const renderPrevWords = () => {
        return words.map((word) => {
            return (
                <>
                    <span>{word.Key}</span>
                    <span>{word.English}</span>
                    <span>{word.French}</span>
                    <span>{word.Dutch}</span>
                </>)
        })
    }
    return (
        <form className='edit-container'>
            <div className="grid">
                <span>
                    <strong>Key</strong>
                </span>
                <span>
                    <strong>English</strong>
                </span>
                <span>
                    <strong>French</strong>
                </span>
                <span>
                    <strong>Dutch</strong>
                </span>
                {renderPrevWords()}
                <input type="text" value={key} onChange={(e) => setKey(e.target.value)} />
                <input type="text" value={englishWord} onChange={(e) => setEnglishWord(e.target.value)} />
                <input type="text" value={frenchWord} onChange={(e) => setFrenchWord(e.target.value)} />
                <input type="text" value={dutchWord} onChange={(e) => setDutchWord(e.target.value)} />
                <button onClick={() => addWord()}>Add</button>
            </div>
            <div className='conroller-container'>
                <input type="text" value={title} placeholder='App Name' onChange={(e) => settitle(e.target.value)} required />
                <button onClick={(e) => postNewApp(e)}>Save</button>
            </div>
        </form>
    )
}
export default Appview
