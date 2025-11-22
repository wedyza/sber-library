import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useState } from 'react';
import './ProfilePage.scss';
import { updateUserInfo } from '../../features/user/userSlice';
import AvatarUploader from '../../components/AvatarUploader/AvatarUploader';

const ProfilePage = () => {
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();

  const [editingField, setEditingField] = useState<null | 'firstName' | 'lastName'>(null);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  const handleBlur = async () => {
    if (!user) return;

    const updatedData = {
      first_name: firstName,
      last_name: lastName
    };

    try {
      await dispatch(updateUserInfo(updatedData)).unwrap();
      console.log('Данные обновлены');
    } catch (error) {
      console.error('Ошибка обновления', error);
    }

    setEditingField(null);
  };

  return (
    <div className='page-profile'>
      <div className='profile-head'>
        <div className='profile-head_avatar'>
          <AvatarUploader />
        </div>
        <h1 className='profile-head_name med-20'>
          {firstName} {lastName}
        </h1>
      </div>

      <div className='profile-info med-14'>
        <div className='profile-info_item'>
          {editingField === 'lastName' ? (
            <input
              type="text"
              className='profile-info_input med-14'
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <div className='profile-info_item-unactive'>
              <span className='profile-info_value'>{lastName}</span>

              <button
                className='profile-info_edit'
                onClick={() => setEditingField('lastName')}
              >
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.1898 2.81563L12.6698 1.33564C13.4509 0.554587 14.7172 0.554587 15.4982 1.33564L16.9125 2.74985C17.6935 3.5309 17.6935 4.79723 16.9125 5.57828L15.4325 7.05827M11.1898 2.81563L1.57416 12.4313C1.24209 12.7634 1.03746 13.2017 0.996134 13.6695L0.754048 16.4099C0.699277 17.0299 1.21815 17.5488 1.83817 17.494L4.57858 17.252C5.04639 17.2106 5.48473 17.006 5.8168 16.6739L15.4325 7.05827M11.1898 2.81563L15.4325 7.05827" stroke="#AAB0B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className='profile-info_item'>
          {editingField === 'firstName' ? (
            <input
              type="text"
              className='profile-info_input med-14'
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <div className='profile-info_item-unactive'>
              <span className='profile-info_value'>{firstName}</span>

              <button
                className='profile-info_edit'
                onClick={() => setEditingField('firstName')}
              >
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.1898 2.81563L12.6698 1.33564C13.4509 0.554587 14.7172 0.554587 15.4982 1.33564L16.9125 2.74985C17.6935 3.5309 17.6935 4.79723 16.9125 5.57828L15.4325 7.05827M11.1898 2.81563L1.57416 12.4313C1.24209 12.7634 1.03746 13.2017 0.996134 13.6695L0.754048 16.4099C0.699277 17.0299 1.21815 17.5488 1.83817 17.494L4.57858 17.252C5.04639 17.2106 5.48473 17.006 5.8168 16.6739L15.4325 7.05827M11.1898 2.81563L15.4325 7.05827" stroke="#AAB0B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className='profile-info_item'>
          <div className='profile-info_item-unactive'>
            <span className='profile-info_value'>{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
