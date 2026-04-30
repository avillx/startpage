import { memo } from 'react';
import './Header.css';

const Header = memo(({ settingsMode, onToggleSettings }) => {
  return (
    <button className="header-toggle" onClick={onToggleSettings} title="Settings">
      {settingsMode ? '✕' : '⚙'}
    </button>
  );
});

export default Header;