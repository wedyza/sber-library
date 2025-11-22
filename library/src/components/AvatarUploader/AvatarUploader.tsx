import React, { useRef } from 'react';
import './avatarUploader.scss'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateUserAvatar } from '../../features/user/userSlice';

const AvatarUploader: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const avatar = user?.avatar;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      dispatch(updateUserAvatar(file));
    }
  };

  return (
    <div className='profile-nav_avatar' onClick={handleClick} style={{ cursor: 'pointer' }}>
      {avatar ? (
        <img src={avatar} alt='Аватар' style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
      ) : (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16437 0 0 7.16296 0 15.9993C0 24.8356 7.16367 31.9986 16 31.9986C24.837 31.9986 32 24.8356 32 15.9993C32 7.16296 24.837 0 16 0ZM16 4.78398C18.9237 4.78398 21.2928 7.15383 21.2928 10.0761C21.2928 12.999 18.9237 15.3682 16 15.3682C13.0777 15.3682 10.7086 12.999 10.7086 10.0761C10.7086 7.15383 13.0777 4.78398 16 4.78398ZM15.9965 27.8155C13.0806 27.8155 10.4099 26.7536 8.35 24.9959C7.84819 24.5679 7.55864 23.9403 7.55864 23.2817C7.55864 20.318 9.9573 17.9461 12.9217 17.9461H19.0797C22.0448 17.9461 24.4343 20.318 24.4343 23.2817C24.4343 23.941 24.1462 24.5672 23.6437 24.9952C21.5845 26.7536 18.9131 27.8155 15.9965 27.8155Z" fill="#212529"/>
        </svg>
      )}
      <input
        type='file'
        ref={inputRef}
        style={{ display: 'none' }}
        accept='image/*'
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarUploader;