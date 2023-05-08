import { useState } from 'react';
import { Person, PersonCircle, List } from 'react-bootstrap-icons';

const TopMenu = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <header className={`fixed top-0 left-0 w-full bg-gray-800 text-center shadow-md z-50`}>
        <div className={`relative w-auto m-auto py-10 text-3xl text-[#F1CA1D] font-light tracking-widest`}>My Memento</div>
        <div className={`fixed top-0 right-0 text-white m-4 inline-flex flex-col h-full`}>
            <div 
                className={`flex-initial inline-flex pl-6 pb-2 text-sm`}             
            >
                <div className={`flex-initial`}>{loggedIn ? 'Welcome, User' : 'Anonymous'}</div>
                <div className={`flex-initial inline-flex hover:cursor-pointer`} onClick={() => setLoggedIn(!loggedIn)}>
                    <span className={`pl-4 text-md`}>{loggedIn ? <PersonCircle /> : <Person />}</span>
                    <span className={'text-sm pl-2'}>Log {loggedIn ? 'out' : 'in'}</span>
                </div>
            </div>
        </div>
    </header>
  );
};

export default TopMenu;

