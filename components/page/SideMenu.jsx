import { useDataContext } from "util/context";
import { Person, PersonCircle, List } from 'react-bootstrap-icons';

const SideMenu = () => {
  const { styles, sideMenuOpenContext } = useDataContext();
  const [isOpen, setIsOpen] = sideMenuOpenContext;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="fixed top-0 left-0 z-50 p-4 bg-gray-800 text-white"
        onClick={toggleMenu}
      >
        <img src="/buddha-elephant.png" className={`${styles.icon} flex-initial`} />
      </button>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-md transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Person />
        <PersonCircle />
      </aside>
    </>
  );
};

export default SideMenu;
