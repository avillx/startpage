import { memo } from 'react';
import './Greeting.css';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  if (h >= 17 && h < 22) return 'Good evening';
  return 'Good night';
};

const Greeting = memo(({ username, onUsernameChange, settingsMode }) => {
  const greeting = getGreeting();

  return (
    <div className="greeting">
      {settingsMode ? (
        <input
          className="greeting-input"
          value={username}
          onChange={e => onUsernameChange(e.target.value)}
          placeholder="Enter your name"
        />
      ) : (
        <span className="greeting-text">
          {greeting}{username ? `, ${username}` : ''}
        </span>
      )}
    </div>
  );
});

export default Greeting;