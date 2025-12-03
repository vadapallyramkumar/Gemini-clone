import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets.js';
import { Context } from '../../Context/Context.jsx';

function Sidebar() {

  const [extended, setExtended] = useState(false);

  const { previousPrompts, onSent, setRecentprompt, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentprompt(prompt);
    await onSent(prompt);
  }

  return (
    <div className='sidebar' >
      <div className='top'>
        <img src={assets.menu_icon} alt="Gemini Logo" className='menu' onClick={() => setExtended(prev => !prev)} />
        <div className='new-chat' onClick={() => newChat()}>
            <img src={assets.plus_icon} alt="New Chat" />
            {
                extended && <p>New Chat</p>
            }
        </div>
        <div className='recent'>
            {
                extended && (
                    <>
                        <p className='recent-title'>Recent</p>
                        {
                            previousPrompts.map((item, index) => {
                                return (
                                    <div className='recent-entry' key={index} onClick={() => loadPrompt(item)}>
                                        <img src={assets.message_icon} alt="Gemini Icon" />
                                        <p>{item.slice(0 ,18)} ...</p>
                                    </div>
                                );
                            })
                        }
                        
                    </>
                )
            }
        </div>
      </div>
      <div className='bottom'>
        <div className='bottom-item recent-entry'>
            <img src={assets.question_icon} alt="" />
            {extended && <p>Help</p>}
        </div>
        <div className='bottom-item recent-entry'>
            <img src={assets.history_icon} alt="" />
            {extended && <p>History</p>}
        </div>
        <div className='bottom-item recent-entry'>
            <img src={assets.setting_icon} alt="" />
            {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
