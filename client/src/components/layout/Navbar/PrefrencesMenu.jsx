import DropdownTransation from '../../common/Transations/DropdownTransation'
import { NavLink } from 'react-router-dom'
import { useAuth } from "../../../context/AuthContext"
import { Moon, Sun } from 'lucide-react';


function PrefrencesMenu({ onClose }) {
    const { requireAuth, user } = useAuth();
    const defaultImage = "https://approachschoolofmotoring.co.uk/wp-content/uploads/2019/01/profile-plain-300x278.png";

    return (
        <DropdownTransation>
            <div className='pref-menu'>
                <div className='menu'>
                    <NavLink
                        key="Settings"
                        to="/dashboard"
                        onClick={(event) => {
                            if (!requireAuth()) {
                                event.preventDefault();
                            }
                            onClose();
                        }}>
                                <img src={user?.imageUrl || defaultImage} />
                                <h5>{user?.name|| "Login Now"} </h5>                    
                    </NavLink>
                    <div className='option'>
                        <p>Theme: </p>
                        <div className="option__actions">
                            <button><Sun size={14} strokeWidth={2} /></button>
                            <button><Moon size={14} strokeWidth={2} /></button>
                        </div>
                    </div>
                    <div className='option'>
                        <p>Language: </p>
                        <div className="option__actions">
                            <button>🇬🇧</button>
                            <button>🇸🇦</button>
                        </div>
                    </div>
                </div>
                {/* <h1>
                        Hello
                    </h1>
                    <button onClick={onClose}>
                        X
                    </button> */}
            </div>
        </DropdownTransation>
    )
}

export default PrefrencesMenu