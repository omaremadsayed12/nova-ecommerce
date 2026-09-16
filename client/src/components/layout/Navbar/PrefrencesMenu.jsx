import DropdownTransation from '../../common/Transations/DropdownTransation'
import { NavLink } from 'react-router-dom'
import { useAuth } from "../../../context/AuthContext"
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

function PrefrencesMenu({ onClose }) {
    const { theme, setTheme } = useTheme();
    console.log(theme);
    
    const { requireAuth, user } = useAuth();
    const defaultImage = "https://static.vecteezy.com/system/resources/previews/013/360/247/non_2x/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg";
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
                        <h5>{user?.name || "Login Now"} </h5>
                    </NavLink>
                    <div className='option'>
                        <p>Theme: </p>
                        <div className="option__actions">
                            <button onClick={() => setTheme("light")} className={theme === "light" ? "active" : ""}><Sun size={14} strokeWidth={2} /></button>
                            <button onClick={() => setTheme("dark")} className={theme === "dark" ? "active" : ""}><Moon size={14} strokeWidth={2} /></button>
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
            </div>
        </DropdownTransation>
    )
}

export default PrefrencesMenu