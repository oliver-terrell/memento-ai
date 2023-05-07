import { useDataContext } from "util/context";
import { Person, PersonCircle, List } from 'react-bootstrap-icons';

const TopMenu = ({}) => {
    const { styles, menuBarOpenContext } = useDataContext();
    const [isOpen, setIsOpen] = menuBarOpenContext;
    
    return <div className={`absolute top-0 w-screen py-4 px-4 bg-gray-800 text-xl inline-flex flex-col gap-5
        border-b border-gray-300 border-opacity-100 border-t-1
    `}>
        <div className={`font-bold inline-flex flex-none`}>
            <div 
                className={
                    `hover:cursor-pointer border-gray-800 border-2 rounded-md
                    ${isOpen 
                        ? `border-solid border-[#fff49b] bg-[#fff49b] hover:border-[#F1CA1D]`
                        : `border-dotted hover:border-solid hover:border-[#F1CA1D]`}
                    `
                }
                onClick={() => setIsOpen(!isOpen)}
            >
                <img src="/buddha-elephant.png" className={`${styles.icon} flex-initial`} />
            </div>
            <div className={`flex-initial m-auto px-10 pr-32 text-3xl text-[#F1CA1D] font-light tracking-widest`}>My Memento</div>
        </div>

        <div className={`${isOpen ? "inline-flex" : "hidden"} relative gap-20 flex-none border-t border-gray-300 border-opacity-100 border-t-1 pt-4 pl-4`}>
            <div className={`flex-initial text-white hover:cursor-pointer hover:border-solid hover:border-1 hover:border-gray-300`}><Person /></div>
            <div className={`flex-initial text-white hover:cursor-pointer `}><PersonCircle /></div>
            <div className={`flex-initial text-white hover:cursor-pointer `}><List /></div>
            <div className={`flex-initial text-white hover:cursor-pointer `}>Elepha</div>
            <div className={`flex-initial text-white hover:cursor-pointer `}>nt Dick</div>
        </div>
    </div>;
};

export default TopMenu;
