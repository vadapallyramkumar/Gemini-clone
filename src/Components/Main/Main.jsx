import React, { useContext } from 'react'
import './Main.css';
import { assets } from '../../assets/assets.js';
import { Context } from '../../Context/Context.jsx';

function Main() {

    const {
        onSent,
        recentprompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
    } = useContext(Context);

  return (
    <div className='main'>
        <div className='nav'>
            <p>Gemini</p>
            <img src={assets.user_icon} />
        </div>
        <div className='main-container'>
            {
                !showResult ? (
                    <>
                        <div className='greet'>
                            <p>
                                <span>Hello, Ram.</span>
                            </p>
                            <p>
                                How can I assist you today?
                            </p>
                        </div>
                        <div className='cards'>
                            <div className='card'>
                                <p>Suggest beautiful places to see  on an upcoming road trip</p>
                                <img src={assets.compass_icon} alt='' />
                            </div>
                            <div className='card'>
                                <p>Breify summarize the concept: urban planning</p>
                                <img src={assets.compass_icon} alt='' />
                            </div>
                            <div className='card'>
                                <p>Clashes during a Bhopal gas tragedy rally, a high-speed rocket-sled test by DRDO</p>
                                <img src={assets.compass_icon} alt='' />
                            </div>
                            <div className='card'>
                                <p>A man proposing Bollywood-style in Times Square, a boat rescuing a driver from a sinking SUV</p>
                                <img src={assets.compass_icon} alt='' />
                            </div>
                        </div>
                    </>
                ) : <div className='result'>
                        <div className='result-title'>
                            <img src={assets.user_icon} alt='' />
                            <p>{recentprompt}</p>
                        </div>
                        <div className='result-data'>
                            <img src={assets.gemini_icon} alt='' />
                            {
                                loading ? <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div> : <p dangerouslySetInnerHTML={{__html:resultData}}></p>
                            }
                        </div>
                    </div>
            }

            <div className='main-bottom'>
                <div className='search-box'>
                    <input value={input} onChange={(e) => setInput(e.target.value)} type='text' placeholder='Type your message here...' />
                    <div>
                        <img src={assets.gallery_icon} />
                        <img src={assets.mic_icon} />
                        <img onClick={onSent} src={assets.send_icon} />
                    </div>
                </div>
                <p className='bottom-info'>Gemini may show wrong info</p>
            </div>
        </div>
    </div>
  )
}

export default Main;
